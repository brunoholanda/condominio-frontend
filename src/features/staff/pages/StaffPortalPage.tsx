import {
  Alert,
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Result,
  Select,
  Spin,
  Tag,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  ArrowLeft,
  Camera,
  Clock3,
  LogIn,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  PackagePlus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import type { PackageListItem } from '@/features/deliveries/model/delivery.types';
import {
  PACKAGE_STATUS_COLORS,
  PACKAGE_STATUS_LABELS,
} from '@/features/deliveries/model/delivery.types';
import { buildUnitOptions } from '@/features/residents/model/condo';
import type { VisitorPass } from '@/features/visitors/model/visitor.types';
import {
  VISITOR_PASS_STATUS_COLORS,
  VISITOR_PASS_STATUS_LABELS,
} from '@/features/visitors/model/visitor.types';
import { ApiError } from '@/shared/api/api-error';
import { SignaturePad } from '@/shared/components/SignaturePad/SignaturePad';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { compressSelfieBlob } from '@/shared/utils/compress-selfie';
import { rules } from '@/shared/utils/form-rules';
import { maskCpf, onlyDigits } from '@/shared/utils/masks';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { staffApi } from '../api/staff.api';
import { readStaffToken, writeStaffToken } from '../model/staff-session';
import { PUNCH_TYPE_LABELS, type PunchType, type StaffMe } from '../model/staff.types';
import * as S from './StaffPortalPage.styles';

type ModuleView = 'hub' | 'ponto' | 'visitantes' | 'encomendas';

interface VisitorFormValues {
  visitorName: string;
  visitorDocument?: string;
  hostName: string;
  unitNumber?: string;
  expectedAt: Dayjs;
  expiresAt: Dayjs;
  notes?: string;
}

interface PackageFormValues {
  unitNumber: string;
  description: string;
  carrier?: string;
  notes?: string;
}

interface DeliverFormValues {
  recipientName: string;
  signature: string;
}

export function StaffPortalPage() {
  const { slug } = useParams<{ slug: string }>();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const condoQuery = usePublicCondominiumQuery(slug);
  const [token, setToken] = useState<string | null>(() => (slug ? readStaffToken(slug) : null));
  const [me, setMe] = useState<StaffMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [view, setView] = useState<ModuleView>('hub');
  const [loginForm] = Form.useForm<{ cpf: string; pin: string }>();

  // Ponto
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

  // Visitantes
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [creatingVisitor, setCreatingVisitor] = useState(false);
  const [visitorForm] = Form.useForm<VisitorFormValues>();

  // Encomendas
  const [packages, setPackages] = useState<PackageListItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [creatingPackage, setCreatingPackage] = useState(false);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [delivering, setDelivering] = useState(false);
  const [packageForm] = Form.useForm<PackageFormValues>();
  const [deliverForm] = Form.useForm<DeliverFormValues>();

  const isDesktopHint =
    typeof navigator !== 'undefined' && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const unitOptions = useMemo(
    () => buildUnitOptions(me?.unitNumbers ?? []),
    [me?.unitNumbers],
  );

  const enabledModules = useMemo(() => {
    if (!me) {
      return [];
    }

    const modules: Array<{
      id: ModuleView;
      title: string;
      hint: string;
      icon: typeof Clock3;
    }> = [];

    if (me.canAccessTimeClock) {
      modules.push({
        id: 'ponto',
        title: 'Ponto eletrônico',
        hint: 'Registrar entrada, intervalo e saída',
        icon: Clock3,
      });
    }

    if (me.canAccessVisitors) {
      modules.push({
        id: 'visitantes',
        title: 'Visitantes',
        hint: 'Registrar e fazer check-in',
        icon: Users,
      });
    }

    if (me.canAccessDeliveries) {
      modules.push({
        id: 'encomendas',
        title: 'Encomendas',
        hint: 'Receber e protocolar entregas',
        icon: Package,
      });
    }

    return modules;
  }, [me]);

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
    if (view !== 'ponto' || !token) {
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
  }, [view, token, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
      }
    };
  }, [selfiePreview]);

  const loadVisitors = useCallback(async () => {
    if (!slug || !token) {
      return;
    }

    setLoadingVisitors(true);

    try {
      const list = await staffApi.listStaffVisitors(slug, token, { status: 'PENDING' });
      setVisitors(list);
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível carregar os visitantes.',
      );
    } finally {
      setLoadingVisitors(false);
    }
  }, [message, slug, token]);

  const loadPackages = useCallback(async () => {
    if (!slug || !token) {
      return;
    }

    setLoadingPackages(true);

    try {
      const result = await staffApi.listStaffPackages(slug, token, {
        status: 'WAITING',
        page: 1,
        limit: 50,
      });
      setPackages(result.items);
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível carregar as encomendas.',
      );
    } finally {
      setLoadingPackages(false);
    }
  }, [message, slug, token]);

  useEffect(() => {
    if (view === 'visitantes' && token) {
      void loadVisitors();
    }

    if (view === 'encomendas' && token) {
      void loadPackages();
    }
  }, [view, token, loadVisitors, loadPackages]);

  const handleLogin = async (values: { cpf: string; pin: string }) => {
    if (!slug) {
      return;
    }

    setLoggingIn(true);

    try {
      const result = await staffApi.login(slug, onlyDigits(values.cpf), values.pin);
      writeStaffToken(slug, result.accessToken);
      setToken(result.accessToken);
      setView('hub');
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
    setView('hub');
    setSelfieBlob(null);
    setSelfiePreview(null);
    setVisitors([]);
    setPackages([]);
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

    void compressSelfieBlob(canvas)
      .then((blob) => {
        if (selfiePreview) {
          URL.revokeObjectURL(selfiePreview);
        }

        setSelfieBlob(blob);
        setSelfiePreview(URL.createObjectURL(blob));
      })
      .catch(() => {
        message.error('Não foi possível capturar a selfie.');
      });
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

  const openVisitorModal = () => {
    visitorForm.resetFields();
    visitorForm.setFieldsValue({
      expectedAt: dayjs().add(15, 'minute'),
      expiresAt: dayjs().add(4, 'hour'),
    });
    setVisitorModalOpen(true);
  };

  const handleCreateVisitor = async (values: VisitorFormValues) => {
    if (!slug || !token) {
      return;
    }

    setCreatingVisitor(true);

    try {
      await staffApi.createStaffVisitor(slug, token, {
        visitorName: values.visitorName.trim(),
        visitorDocument: values.visitorDocument?.trim() || null,
        hostName: values.hostName.trim(),
        unitNumber: values.unitNumber || null,
        expectedAt: values.expectedAt.toISOString(),
        expiresAt: values.expiresAt.toISOString(),
        notes: values.notes?.trim() || null,
      });
      message.success('Passe de visitante registrado.');
      setVisitorModalOpen(false);
      await loadVisitors();
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível registrar o visitante.',
      );
    } finally {
      setCreatingVisitor(false);
    }
  };

  const handleCheckIn = async (passId: string) => {
    if (!slug || !token) {
      return;
    }

    setCheckingInId(passId);

    try {
      await staffApi.checkInStaffVisitor(slug, token, passId);
      message.success('Entrada registrada.');
      await loadVisitors();
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível registrar a entrada.',
      );
    } finally {
      setCheckingInId(null);
    }
  };

  const openPackageModal = () => {
    packageForm.resetFields();
    setPackageModalOpen(true);
  };

  const handleCreatePackage = async (values: PackageFormValues) => {
    if (!slug || !token) {
      return;
    }

    setCreatingPackage(true);

    try {
      await staffApi.createStaffPackage(slug, token, {
        unitNumber: values.unitNumber,
        description: values.description.trim(),
        carrier: values.carrier?.trim() || null,
        notes: values.notes?.trim() || null,
      });
      message.success('Encomenda registrada na portaria.');
      setPackageModalOpen(false);
      await loadPackages();
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível registrar a encomenda.',
      );
    } finally {
      setCreatingPackage(false);
    }
  };

  const openDeliver = (id: string) => {
    deliverForm.resetFields();
    setDeliveringId(id);
  };

  const handleDeliver = async (values: DeliverFormValues) => {
    if (!slug || !token || !deliveringId) {
      return;
    }

    setDelivering(true);

    try {
      await staffApi.deliverStaffPackage(slug, token, deliveringId, {
        recipientName: values.recipientName.trim(),
        signature: values.signature,
      });
      message.success('Entrega protocolada com assinatura.');
      setDeliveringId(null);
      await loadPackages();
    } catch (error) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível protocolar a entrega.',
      );
    } finally {
      setDelivering(false);
    }
  };

  const goBackToHub = () => {
    setView('hub');
    setSelfieBlob(null);

    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
      setSelfiePreview(null);
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

  const renderPunch = () => {
    if (!me) {
      return <Spin />;
    }

    return (
      <>
        {isDesktopHint ? (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Use o celular"
            description="O ponto exige GPS e câmera frontal. Prefira abrir esta página no smartphone."
          />
        ) : null}

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
    );
  };

  const renderVisitors = () => (
    <>
      <S.Toolbar>
        <Button type="primary" icon={<UserPlus size={16} />} onClick={openVisitorModal} block>
          Novo visitante
        </Button>
      </S.Toolbar>

      {loadingVisitors ? (
        <Spin />
      ) : visitors.length === 0 ? (
        <S.Empty>Nenhum visitante aguardando.</S.Empty>
      ) : (
        <S.List>
          {visitors.map((pass) => (
            <S.ListItem key={pass.id}>
              <S.ListItemTop>
                <strong>{pass.visitorName}</strong>
                <Tag color={VISITOR_PASS_STATUS_COLORS[pass.status]}>
                  {VISITOR_PASS_STATUS_LABELS[pass.status]}
                </Tag>
              </S.ListItemTop>
              <S.ListMeta>
                {pass.hostName}
                {pass.unitNumber ? ` · Unidade ${pass.unitNumber}` : ''}
                {pass.visitorDocument ? ` · ${pass.visitorDocument}` : ''}
              </S.ListMeta>
              <S.ListMeta>Previsto: {dayjs(pass.expectedAt).format('DD/MM HH:mm')}</S.ListMeta>
              <S.ListActions>
                <Button
                  type="primary"
                  icon={<LogIn size={14} />}
                  loading={checkingInId === pass.id}
                  onClick={() => void handleCheckIn(pass.id)}
                >
                  Check-in
                </Button>
              </S.ListActions>
            </S.ListItem>
          ))}
        </S.List>
      )}

      <Modal
        title="Novo visitante"
        open={visitorModalOpen}
        onCancel={() => setVisitorModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form<VisitorFormValues>
          form={visitorForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => void handleCreateVisitor(values)}
          disabled={creatingVisitor}
        >
          <Form.Item name="visitorName" label="Nome do visitante" rules={[rules.required()]}>
            <Input placeholder="Nome completo" />
          </Form.Item>
          <Form.Item name="visitorDocument" label="Documento">
            <Input placeholder="RG ou CPF (opcional)" />
          </Form.Item>
          <Form.Item name="hostName" label="Anfitrião" rules={[rules.required()]}>
            <Input placeholder="Quem recebe" />
          </Form.Item>
          <Form.Item name="unitNumber" label="Unidade">
            <Select
              allowClear
              showSearch
              options={unitOptions}
              optionFilterProp="label"
              placeholder="Opcional"
            />
          </Form.Item>
          <Form.Item name="expectedAt" label="Chegada prevista" rules={[rules.required()]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiresAt" label="Válido até" rules={[rules.required()]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Observações">
            <Input.TextArea rows={2} maxLength={1000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={creatingVisitor}>
            Registrar passe
          </Button>
        </Form>
      </Modal>
    </>
  );

  const renderPackages = () => (
    <>
      <S.Toolbar>
        <Button type="primary" icon={<PackagePlus size={16} />} onClick={openPackageModal} block>
          Registrar encomenda
        </Button>
      </S.Toolbar>

      {loadingPackages ? (
        <Spin />
      ) : packages.length === 0 ? (
        <S.Empty>Nenhuma encomenda aguardando retirada.</S.Empty>
      ) : (
        <S.List>
          {packages.map((item) => (
            <S.ListItem key={item.id}>
              <S.ListItemTop>
                <strong>Unidade {item.unitNumber}</strong>
                <Tag color={PACKAGE_STATUS_COLORS[item.status]}>
                  {PACKAGE_STATUS_LABELS[item.status]}
                </Tag>
              </S.ListItemTop>
              <S.ListMeta>{item.description}</S.ListMeta>
              <S.ListMeta>
                Chegada: {dayjs(item.receivedAt).format('DD/MM/YYYY HH:mm')}
                {item.carrier ? ` · ${item.carrier}` : ''}
              </S.ListMeta>
              <S.ListActions>
                <Button
                  type="primary"
                  icon={<PackageCheck size={14} />}
                  onClick={() => openDeliver(item.id)}
                >
                  Protocolar
                </Button>
              </S.ListActions>
            </S.ListItem>
          ))}
        </S.List>
      )}

      <Modal
        title="Registrar encomenda"
        open={packageModalOpen}
        onCancel={() => setPackageModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form<PackageFormValues>
          form={packageForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => void handleCreatePackage(values)}
          disabled={creatingPackage}
        >
          <Form.Item name="unitNumber" label="Unidade" rules={[rules.required()]}>
            <Select
              showSearch
              options={unitOptions}
              optionFilterProp="label"
              placeholder="Selecione a unidade"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[rules.required(), rules.text(2, 200)]}
          >
            <Input placeholder="Ex.: Caixa média — Amazon" />
          </Form.Item>
          <Form.Item name="carrier" label="Transportadora / remetente">
            <Input placeholder="Correios, Mercado Livre..." />
          </Form.Item>
          <Form.Item name="notes" label="Observações">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={creatingPackage}>
            Registrar na portaria
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Protocolar entrega"
        open={Boolean(deliveringId)}
        onCancel={() => setDeliveringId(null)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 560)}
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form<DeliverFormValues>
          form={deliverForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => void handleDeliver(values)}
          disabled={delivering}
        >
          <Form.Item
            name="recipientName"
            label="Nome de quem retirou"
            rules={[rules.required(), rules.text(3, 150)]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="signature"
            label="Assinatura"
            rules={[rules.required('A assinatura é obrigatória')]}
            extra="Assine na tela com o dedo."
          >
            <SignaturePad />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={delivering}>
            Confirmar entrega
          </Button>
        </Form>
      </Modal>
    </>
  );

  const moduleTitle: Record<Exclude<ModuleView, 'hub'>, string> = {
    ponto: 'Ponto eletrônico',
    visitantes: 'Visitantes',
    encomendas: 'Encomendas',
  };

  return (
    <S.Page>
      <S.Header>
        <S.Brand>{condoQuery.data.name}</S.Brand>
        <S.Subtitle>Portal do funcionário</S.Subtitle>
      </S.Header>

      {!token ? (
        <S.Card>
          <Form form={loginForm} layout="vertical" onFinish={(values) => void handleLogin(values)}>
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
          ) : view === 'hub' ? (
            <>
              <S.Welcome>
                <div>
                  <strong>{me.fullName}</strong>
                  <span>{me.jobTitle}</span>
                </div>
                <Button
                  type="text"
                  icon={<LogOut size={16} />}
                  onClick={handleLogout}
                  aria-label="Sair"
                />
              </S.Welcome>

              {enabledModules.length === 0 ? (
                <S.Empty>Nenhum módulo liberado para este funcionário.</S.Empty>
              ) : (
                <S.ModuleGrid>
                  {enabledModules.map((mod) => {
                    const Icon = mod.icon;

                    return (
                      <S.ModuleCard key={mod.id} type="button" onClick={() => setView(mod.id)}>
                        <S.ModuleIcon>
                          <Icon size={22} aria-hidden />
                        </S.ModuleIcon>
                        <S.ModuleText>
                          <strong>{mod.title}</strong>
                          <span>{mod.hint}</span>
                        </S.ModuleText>
                      </S.ModuleCard>
                    );
                  })}
                </S.ModuleGrid>
              )}
            </>
          ) : (
            <>
              <S.ModuleTopBar>
                <Button
                  type="text"
                  icon={<ArrowLeft size={18} />}
                  onClick={goBackToHub}
                  aria-label="Voltar"
                />
                <S.ModuleTitle>{moduleTitle[view]}</S.ModuleTitle>
                <Button
                  type="text"
                  icon={<LogOut size={16} />}
                  onClick={handleLogout}
                  aria-label="Sair"
                />
              </S.ModuleTopBar>

              {view === 'ponto' ? renderPunch() : null}
              {view === 'visitantes' ? renderVisitors() : null}
              {view === 'encomendas' ? renderPackages() : null}
            </>
          )}
        </S.Card>
      )}
    </S.Page>
  );
}
