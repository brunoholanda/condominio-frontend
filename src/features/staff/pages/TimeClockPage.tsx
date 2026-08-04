import { Alert, App, Button, Form, Input, Result, Spin } from 'antd';
import { Camera, LogOut, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { ApiError } from '@/shared/api/api-error';
import { maskCpf, onlyDigits } from '@/shared/utils/masks';
import { staffApi } from '../api/staff.api';
import { PUNCH_TYPE_LABELS, type PunchType, type StaffMe } from '../model/staff.types';
import * as S from './TimeClockPage.styles';

const STAFF_TOKEN_KEY = 'condo-staff-token';

function readStaffToken(slug: string): string | null {
  try {
    return sessionStorage.getItem(`${STAFF_TOKEN_KEY}:${slug}`);
  } catch {
    return null;
  }
}

function writeStaffToken(slug: string, token: string | null) {
  try {
    const key = `${STAFF_TOKEN_KEY}:${slug}`;

    if (token) {
      sessionStorage.setItem(key, token);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

export function TimeClockPage() {
  const { slug } = useParams<{ slug: string }>();
  const { message } = App.useApp();
  const condoQuery = usePublicCondominiumQuery(slug);
  const [token, setToken] = useState<string | null>(() => (slug ? readStaffToken(slug) : null));
  const [me, setMe] = useState<StaffMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [punching, setPunching] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [form] = Form.useForm<{ cpf: string; pin: string }>();

  const isMobileHint =
    typeof navigator !== 'undefined' &&
    !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch {
      message.error('Não foi possível acessar a câmera. Permita o uso da câmera no celular.');
    }
  }, [message, stopCamera]);

  const refreshMe = useCallback(
    async (accessToken: string) => {
      if (!slug) {
        return;
      }

      setLoadingMe(true);

      try {
        const profile = await staffApi.me(slug, accessToken);
        setMe(profile);
      } catch (error) {
        writeStaffToken(slug, null);
        setToken(null);
        setMe(null);
        message.error(
          error instanceof ApiError ? error.message : 'Sessão expirada. Entre novamente.',
        );
      } finally {
        setLoadingMe(false);
      }
    },
    [message, slug],
  );

  useEffect(() => {
    if (token) {
      void refreshMe(token);
    }
  }, [token, refreshMe]);

  useEffect(() => {
    if (!token) {
      stopCamera();
      return;
    }

    void startCamera();

    if (!navigator.geolocation) {
      setLocationError('Este dispositivo não suporta geolocalização.');
      return;
    }

    setLocationError(null);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
        });
        setLocationError(null);
      },
      () => {
        setLocationError(
          'A localização é obrigatória para registrar o ponto. Ative o GPS e permita o acesso.',
        );
        setLocation(null);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      stopCamera();
    };
  }, [token, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
      }
    };
  }, [selfiePreview]);

  const handleLogin = async (values: { cpf: string; pin: string }) => {
    if (!slug) {
      return;
    }

    setLoggingIn(true);

    try {
      const result = await staffApi.login(slug, onlyDigits(values.cpf), values.pin);
      writeStaffToken(slug, result.accessToken);
      setToken(result.accessToken);
      message.success(`Olá, ${result.fullName}!`);
    } catch (error) {
      message.error(error instanceof ApiError ? error.message : 'Falha no login.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (slug) {
      writeStaffToken(slug, null);
    }

    setToken(null);
    setMe(null);
    setSelfieBlob(null);
    setSelfiePreview(null);
    stopCamera();
  };

  const captureSelfie = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          message.error('Não foi possível capturar a selfie.');
          return;
        }

        if (selfiePreview) {
          URL.revokeObjectURL(selfiePreview);
        }

        setSelfieBlob(blob);
        setSelfiePreview(URL.createObjectURL(blob));
      },
      'image/jpeg',
      0.85,
    );
  };

  const registerPunch = async () => {
    if (!slug || !token || !me) {
      return;
    }

    if (!location) {
      message.error('Aguarde a localização GPS ou permita o acesso.');
      return;
    }

    if (!selfieBlob) {
      message.error('Capture uma selfie antes de bater o ponto.');
      return;
    }

    setPunching(true);

    try {
      const formData = new FormData();
      formData.append('selfie', selfieBlob, 'selfie.jpg');
      formData.append('type', me.nextPunchType);
      formData.append('latitude', String(location.latitude));
      formData.append('longitude', String(location.longitude));

      if (location.accuracy != null) {
        formData.append('accuracyMeters', String(location.accuracy));
      }

      await staffApi.punch(slug, token, formData);
      message.success(`${PUNCH_TYPE_LABELS[me.nextPunchType]} registrada com sucesso.`);
      setSelfieBlob(null);

      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
        setSelfiePreview(null);
      }

      await refreshMe(token);
    } catch (error) {
      message.error(error instanceof ApiError ? error.message : 'Não foi possível registrar o ponto.');
      await refreshMe(token);
    } finally {
      setPunching(false);
    }
  };

  if (condoQuery.isError) {
    return (
      <Result status="404" title="Condomínio não encontrado" subTitle="Verifique o link informado." />
    );
  }

  if (condoQuery.isLoading || !condoQuery.data) {
    return (
      <S.Page>
        <Spin />
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Header>
        <S.Brand>{condoQuery.data.name}</S.Brand>
        <S.Subtitle>Ponto eletrônico</S.Subtitle>
      </S.Header>

      {isMobileHint ? (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Use o celular"
          description="O ponto exige GPS e câmera frontal. Prefira abrir esta página no smartphone."
        />
      ) : null}

      {!token ? (
        <S.Card>
          <Form form={form} layout="vertical" onFinish={(values) => void handleLogin(values)}>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: 'Informe o CPF' }]}
              getValueFromEvent={(e) => maskCpf(e.target.value)}
            >
              <Input inputMode="numeric" maxLength={14} size="large" />
            </Form.Item>
            <Form.Item
              name="pin"
              label="PIN"
              rules={[
                { required: true, message: 'Informe o PIN' },
                { pattern: /^\d{4,6}$/, message: 'PIN com 4 a 6 dígitos' },
              ]}
            >
              <Input.Password inputMode="numeric" maxLength={6} size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loggingIn}>
              Entrar
            </Button>
          </Form>
        </S.Card>
      ) : (
        <S.Card>
          {loadingMe || !me ? (
            <Spin />
          ) : (
            <>
              <S.Welcome>
                <div>
                  <strong>{me.fullName}</strong>
                  <span>{me.jobTitle}</span>
                </div>
                <Button type="text" icon={<LogOut size={16} />} onClick={handleLogout} aria-label="Sair" />
              </S.Welcome>

              <S.LocationBox $ok={Boolean(location) && !locationError}>
                <MapPin size={18} aria-hidden />
                <div>
                  <strong>Localização obrigatória</strong>
                  <p>
                    {locationError ??
                      (location
                        ? `GPS ativo (±${location.accuracy ? Math.round(location.accuracy) : '?'} m). Raio permitido: ${me.geofenceRadiusMeters} m.`
                        : 'Obtendo localização…')}
                  </p>
                </div>
              </S.LocationBox>

              <S.CameraArea>
                {!selfiePreview ? (
                  <video ref={videoRef} playsInline muted autoPlay />
                ) : (
                  <img src={selfiePreview} alt="Selfie capturada" />
                )}
              </S.CameraArea>

              <S.CameraActions>
                {!selfiePreview ? (
                  <Button
                    icon={<Camera size={16} />}
                    onClick={captureSelfie}
                    disabled={!cameraReady}
                    block
                    size="large"
                  >
                    Tirar selfie
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (selfiePreview) {
                        URL.revokeObjectURL(selfiePreview);
                      }

                      setSelfiePreview(null);
                      setSelfieBlob(null);
                      void startCamera();
                    }}
                    block
                  >
                    Tirar outra foto
                  </Button>
                )}
              </S.CameraActions>

              <Button
                type="primary"
                block
                size="large"
                loading={punching}
                disabled={!location || !selfieBlob}
                onClick={() => void registerPunch()}
                style={{ marginTop: 12 }}
              >
                Registrar {PUNCH_TYPE_LABELS[me.nextPunchType as PunchType]}
              </Button>

              {me.lastPunchType ? (
                <S.Hint>
                  Última marcação hoje: {PUNCH_TYPE_LABELS[me.lastPunchType as PunchType]}
                </S.Hint>
              ) : (
                <S.Hint>Nenhuma marcação aceita hoje ainda.</S.Hint>
              )}
            </>
          )}
        </S.Card>
      )}
    </S.Page>
  );
}
