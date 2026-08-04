import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Skeleton,
  Spin,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PackageCheck, PackagePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { buildUnitOptions } from '@/features/residents/model/condo';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { SignaturePad } from '@/shared/components/SignaturePad/SignaturePad';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  deliveryKeys,
  useCreatePackageMutation,
  useCreateSigningSessionMutation,
  useDeliverPackageMutation,
  usePackageQuery,
  usePackagesQuery,
} from '../hooks/use-deliveries';
import type {
  CreatePackagePayload,
  PackageFilters,
  PackageListItem,
  PackageStatus,
} from '../model/delivery.types';
import { PACKAGE_STATUS_COLORS, PACKAGE_STATUS_LABELS } from '../model/delivery.types';
import * as S from './DeliveriesPage.styles';

interface RegisterFormValues {
  unitNumber: string;
  description: string;
  carrier?: string;
  notes?: string;
}

interface DeliverFormValues {
  recipientName: string;
  signature: string;
}

const STATUS_FILTER_OPTIONS = [
  { value: 'WAITING', label: 'Aguardando retirada' },
  { value: 'DELIVERED', label: 'Entregue' },
];

/** How often the desktop modal checks whether the phone has finished signing. */
const SIGNING_POLL_INTERVAL_MS = 2000;

export function DeliveriesPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery(queries.downMd);
  const [registerForm] = Form.useForm<RegisterFormValues>();
  const [deliverForm] = Form.useForm<DeliverFormValues>();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PackageFilters>({
    page: 1,
    limit: 20,
    status: 'WAITING',
  });

  const packagesQuery = usePackagesQuery(condominium.id, filters);
  const detailQuery = usePackageQuery(condominium.id, detailId ?? undefined);
  const createPackage = useCreatePackageMutation(condominium.id);
  const deliverPackage = useDeliverPackageMutation(condominium.id);
  const createSigningSession = useCreateSigningSessionMutation(condominium.id);

  const unitOptions = useMemo(
    () => buildUnitOptions(condominium.unitNumbers),
    [condominium.unitNumbers],
  );

  // Enquanto o QR Code está de pé, verifica no servidor se o celular já assinou.
  const isAwaitingRemoteSignature =
    Boolean(deliveringId) && !isMobile && Boolean(createSigningSession.data);
  const signingStatusQuery = usePackageQuery(
    condominium.id,
    isAwaitingRemoteSignature ? (deliveringId ?? undefined) : undefined,
    { refetchInterval: isAwaitingRemoteSignature ? SIGNING_POLL_INTERVAL_MS : false },
  );

  useEffect(() => {
    if (isAwaitingRemoteSignature && signingStatusQuery.data?.status === 'DELIVERED') {
      message.success('Assinatura recebida. Entrega protocolada.');
      setDeliveringId(null);
      createSigningSession.reset();
      void queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAwaitingRemoteSignature, signingStatusQuery.data?.status]);

  const openRegister = () => {
    registerForm.resetFields();
    setRegisterOpen(true);
  };

  const handleRegister = (values: RegisterFormValues) => {
    const payload: CreatePackagePayload = {
      unitNumber: values.unitNumber,
      description: values.description.trim(),
      carrier: values.carrier?.trim() || null,
      notes: values.notes?.trim() || null,
    };

    createPackage.mutate(payload, {
      onSuccess: () => {
        message.success('Encomenda registrada na portaria.');
        setRegisterOpen(false);
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível registrar a encomenda.',
        ),
    });
  };

  const openDeliver = (id: string) => {
    setDeliveringId(id);

    if (isMobile) {
      deliverForm.resetFields();
      return;
    }

    createSigningSession.mutate(id, {
      onError: (error: unknown) => {
        message.error(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível gerar o QR Code de assinatura.',
        );
        setDeliveringId(null);
      },
    });
  };

  const closeDeliver = () => {
    setDeliveringId(null);
    createSigningSession.reset();
  };

  const handleDeliver = (values: DeliverFormValues) => {
    if (!deliveringId) {
      return;
    }

    deliverPackage.mutate(
      {
        id: deliveringId,
        payload: {
          recipientName: values.recipientName.trim(),
          signature: values.signature,
        },
      },
      {
        onSuccess: () => {
          message.success('Entrega protocolada com assinatura.');
          setDeliveringId(null);
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível protocolar a entrega.',
          ),
      },
    );
  };

  const columns: ColumnsType<PackageListItem> = [
    {
      title: 'Unidade',
      dataIndex: 'unitNumber',
      width: 100,
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (status: PackageStatus) => (
        <Tag color={PACKAGE_STATUS_COLORS[status]}>{PACKAGE_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: 'Chegada',
      dataIndex: 'receivedAt',
      width: 150,
      render: (receivedAt: string) => dayjs(receivedAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_value, row) => (
        <S.Actions>
          <Button size="small" onClick={() => setDetailId(row.id)}>
            Ver
          </Button>
          {row.status === 'WAITING' ? (
            <Button
              size="small"
              type="primary"
              icon={<PackageCheck size={14} />}
              onClick={() => openDeliver(row.id)}
            >
              Protocolar
            </Button>
          ) : null}
        </S.Actions>
      ),
    },
  ];

  const packages = packagesQuery.data?.items ?? [];
  const totalPackages = packagesQuery.data?.total ?? 0;

  return (
    <>
      <PageHeading
        title="Encomendas"
        description="Registre volumes na portaria e protocole a retirada com assinatura de quem leva."
        actions={
          <Button type="primary" icon={<PackagePlus size={16} />} onClick={openRegister}>
            Registrar encomenda
          </Button>
        }
      />

      <S.Filters>
        <Select
          allowClear
          placeholder="Status"
          style={{ width: isMobile ? '100%' : 220 }}
          value={filters.status}
          options={STATUS_FILTER_OPTIONS}
          onChange={(status) =>
            setFilters((current) => ({
              ...current,
              page: 1,
              status: (status as PackageStatus | undefined) ?? undefined,
            }))
          }
        />
      </S.Filters>

      {packagesQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : isMobile ? (
        <>
          {packages.length === 0 ? (
            <S.CardEmpty>Nenhuma encomenda encontrada.</S.CardEmpty>
          ) : (
            <S.CardList>
              {packages.map((item) => (
                <S.PackageCard key={item.id}>
                  <S.CardTop>
                    <S.CardUnit>Unidade {item.unitNumber}</S.CardUnit>
                    <Tag color={PACKAGE_STATUS_COLORS[item.status]}>
                      {PACKAGE_STATUS_LABELS[item.status]}
                    </Tag>
                  </S.CardTop>
                  <S.CardDescription>{item.description}</S.CardDescription>
                  <S.CardMeta>
                    Chegada: {dayjs(item.receivedAt).format('DD/MM/YYYY HH:mm')}
                    {item.carrier ? ` · ${item.carrier}` : null}
                  </S.CardMeta>
                  <S.CardActions>
                    <Button onClick={() => setDetailId(item.id)}>Ver detalhes</Button>
                    {item.status === 'WAITING' ? (
                      <Button
                        type="primary"
                        icon={<PackageCheck size={16} />}
                        onClick={() => openDeliver(item.id)}
                      >
                        Protocolar
                      </Button>
                    ) : null}
                  </S.CardActions>
                </S.PackageCard>
              ))}
            </S.CardList>
          )}

          {totalPackages > (filters.limit ?? 20) ? (
            <S.CardPagination>
              <Pagination
                simple
                current={filters.page}
                pageSize={filters.limit ?? 20}
                total={totalPackages}
                onChange={(page, limit) =>
                  setFilters((current) => ({ ...current, page, limit }))
                }
              />
            </S.CardPagination>
          ) : null}
        </>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={packages}
          {...mobileTableProps(false, {
            current: filters.page,
            pageSize: filters.limit,
            total: totalPackages,
            onChange: (page, limit) => setFilters((current) => ({ ...current, page, limit })),
          })}
        />
      )}

      <Modal
        title="Registrar encomenda"
        open={registerOpen}
        onCancel={() => setRegisterOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form<RegisterFormValues>
          form={registerForm}
          layout="vertical"
          requiredMark={false}
          onFinish={handleRegister}
          disabled={createPackage.isPending}
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
          <Button type="primary" htmlType="submit" block loading={createPackage.isPending}>
            Registrar na portaria
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Protocolar entrega"
        open={Boolean(deliveringId)}
        onCancel={closeDeliver}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 560)}
        styles={{ body: { paddingTop: 8 } }}
      >
        {isMobile ? (
          <Form<DeliverFormValues>
            form={deliverForm}
            layout="vertical"
            requiredMark={false}
            onFinish={handleDeliver}
            disabled={deliverPackage.isPending}
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
            <Button type="primary" htmlType="submit" block loading={deliverPackage.isPending}>
              Confirmar entrega
            </Button>
          </Form>
        ) : (
          <S.SigningSessionPanel>
            {createSigningSession.isPending || !createSigningSession.data ? (
              <Spin tip="Gerando QR Code..." />
            ) : (
              <>
                <p>Peça para quem retirou escanear o QR Code no celular e assinar a retirada.</p>
                <img
                  src={createSigningSession.data.qrPngDataUrl}
                  alt="QR Code para assinar a entrega"
                  width={240}
                  height={240}
                />
                <S.SigningWaiting>
                  <Spin size="small" /> Aguardando assinatura...
                </S.SigningWaiting>
                <S.SigningExpiry>
                  Link válido até {dayjs(createSigningSession.data.expiresAt).format('HH:mm')}
                </S.SigningExpiry>
              </>
            )}
          </S.SigningSessionPanel>
        )}
      </Modal>

      <Drawer
        title="Detalhe da encomenda"
        open={Boolean(detailId)}
        onClose={() => setDetailId(null)}
        placement={isMobile ? 'bottom' : 'right'}
        height={isMobile ? '90vh' : undefined}
        width={isMobile ? '100%' : 420}
      >
        {detailQuery.isLoading ? <Skeleton active /> : null}
        {detailQuery.data ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <strong>Unidade:</strong> {detailQuery.data.unitNumber}
            </div>
            <div>
              <strong>Descrição:</strong> {detailQuery.data.description}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <Tag color={PACKAGE_STATUS_COLORS[detailQuery.data.status]}>
                {PACKAGE_STATUS_LABELS[detailQuery.data.status]}
              </Tag>
            </div>
            <div>
              <strong>Chegada:</strong>{' '}
              {dayjs(detailQuery.data.receivedAt).format('DD/MM/YYYY HH:mm')}
            </div>
            {detailQuery.data.deliveredAt ? (
              <div>
                <strong>Entrega:</strong>{' '}
                {dayjs(detailQuery.data.deliveredAt).format('DD/MM/YYYY HH:mm')}
              </div>
            ) : null}
            {detailQuery.data.recipientName ? (
              <div>
                <strong>Retirado por:</strong> {detailQuery.data.recipientName}
              </div>
            ) : null}
            {detailQuery.data.signature ? (
              <div>
                <strong>Assinatura:</strong>
                <S.SignaturePreview
                  src={detailQuery.data.signature}
                  alt={`Assinatura de ${detailQuery.data.recipientName ?? 'retirada'}`}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
