import {
  Alert,
  App,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  Pagination,
  Select,
  Skeleton,
  Switch,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { Copy, Eye, BellRing, Plus, QrCode, Settings2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { MoneyInput } from '@/shared/components/MoneyInput/MoneyInput';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useAsaasSettingsQuery,
  useCancelChargeMutation,
  useChargeSummaryQuery,
  useChargesQuery,
  useGenerateChargesMutation,
  useRemindPendingChargesMutation,
  useUpsertAsaasSettingsMutation,
} from '../hooks/use-charges';
import type { Charge, ChargeFilters, ChargeStatus } from '../model/charge.types';
import {
  CHARGE_STATUS_COLORS,
  CHARGE_STATUS_LABELS,
  CHARGE_STATUSES,
} from '../model/charge.types';
import * as S from './ChargesPage.styles';

const INITIAL_FILTERS: ChargeFilters = { page: 1, limit: 20 };
const DATE_FORMAT = 'DD/MM/YYYY';

interface GenerateFormValues {
  description: string;
  referenceMonth: Dayjs;
  dueDate: Dayjs;
  amountReais: number;
  unitNumbers: string[];
}

interface SettingsFormValues {
  apiKey: string;
  walletId?: string;
  enabled: boolean;
}

export function ChargesPage() {
  const condominium = useManagerCondominium();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [filters, setFilters] = useState<ChargeFilters>(INITIAL_FILTERS);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selected, setSelected] = useState<Charge | null>(null);
  const [generateForm] = Form.useForm<GenerateFormValues>();
  const [settingsForm] = Form.useForm<SettingsFormValues>();

  const chargesQuery = useChargesQuery(condominium.id, filters);
  const summaryQuery = useChargeSummaryQuery(condominium.id);
  const asaasQuery = useAsaasSettingsQuery(condominium.id);
  const generateCharges = useGenerateChargesMutation(condominium.id);
  const cancelCharge = useCancelChargeMutation(condominium.id);
  const remindPending = useRemindPendingChargesMutation(condominium.id);
  const upsertAsaas = useUpsertAsaasSettingsMutation(condominium.id);

  const units = condominium.unitNumbers ?? [];
  const charges = chargesQuery.data?.items ?? [];
  const total = chargesQuery.data?.total ?? 0;
  const summary = summaryQuery.data;
  const asaasConfigured = Boolean(asaasQuery.data?.configured && asaasQuery.data.enabled);

  const statusOptions = useMemo(
    () =>
      CHARGE_STATUSES.map((value) => ({
        value,
        label: CHARGE_STATUS_LABELS[value],
      })),
    [],
  );

  const openGenerate = () => {
    if (!asaasConfigured) {
      message.warning('Configure a integração Asaas antes de gerar cobranças.');
      setSettingsOpen(true);
      return;
    }

    generateForm.setFieldsValue({
      description: `Taxa condominial ${dayjs().format('MMMM/YYYY')}`,
      referenceMonth: dayjs().startOf('month'),
      dueDate: dayjs().date(10),
      amountReais: undefined,
      unitNumbers: units,
    });
    setGenerateOpen(true);
  };

  const openSettings = () => {
    settingsForm.setFieldsValue({
      apiKey: '',
      walletId: asaasQuery.data?.walletId ?? undefined,
      enabled: asaasQuery.data?.enabled ?? true,
    });
    setSettingsOpen(true);
  };

  const handleGenerate = (values: GenerateFormValues) => {
    generateCharges.mutate(
      {
        description: values.description.trim(),
        referenceMonth: values.referenceMonth.startOf('month').format('YYYY-MM-DD'),
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        amountCents: Math.round(values.amountReais * 100),
        unitNumbers: values.unitNumbers,
      },
      {
        onSuccess: (result) => {
          const ok = result.created.length;
          const fail = result.failures.length;
          if (fail === 0) {
            message.success(`${ok} cobrança(s) PIX gerada(s).`);
          } else {
            message.warning(`${ok} gerada(s), ${fail} com falha. Veja o detalhe no alerta.`);
          }
          setGenerateOpen(false);
          if (result.created[0]) {
            setSelected(result.created[0]);
          }
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível gerar as cobranças.',
          ),
      },
    );
  };

  const handleSaveSettings = (values: SettingsFormValues) => {
    upsertAsaas.mutate(
      {
        apiKey: values.apiKey.trim(),
        walletId: values.walletId?.trim() || null,
        enabled: values.enabled,
      },
      {
        onSuccess: () => {
          message.success('Integração Asaas salva e validada.');
          setSettingsOpen(false);
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível salvar a integração.',
          ),
      },
    );
  };

  const handleCancel = (charge: Charge) => {
    modal.confirm({
      title: `Cancelar cobrança da unidade ${charge.unitNumber}?`,
      content: 'A cobrança PIX será cancelada no Asaas e marcada como cancelada aqui.',
      okText: 'Cancelar cobrança',
      okButtonProps: { danger: true },
      cancelText: 'Voltar',
      onOk: () =>
        cancelCharge.mutateAsync(
          { id: charge.id },
          {
            onSuccess: () => {
              message.success('Cobrança cancelada.');
              setSelected(null);
            },
            onError: (error: unknown) =>
              message.error(
                error instanceof ApiError ? error.message : 'Não foi possível cancelar.',
              ),
          },
        ),
    });
  };

  const copyPix = async (payload: string) => {
    try {
      await navigator.clipboard.writeText(payload);
      message.success('Código PIX copiado.');
    } catch {
      message.error('Não foi possível copiar o código PIX.');
    }
  };

  const columns: ColumnsType<Charge> = [
    { title: 'Unidade', dataIndex: 'unitNumber', width: 100 },
    { title: 'Pagador', dataIndex: 'payerName', ellipsis: true, responsive: ['md'] },
    { title: 'Descrição', dataIndex: 'description', ellipsis: true },
    {
      title: 'Valor',
      dataIndex: 'amountCents',
      width: 120,
      render: (cents: number) => formatCentsToBRL(cents),
    },
    {
      title: 'Vencimento',
      dataIndex: 'dueDate',
      width: 120,
      render: (dueDate: string) => dayjs(dueDate).format(DATE_FORMAT),
    },
    {
      title: 'Status',
      dataIndex: 'displayStatus',
      width: 120,
      render: (_value, row) => (
        <Tag color={CHARGE_STATUS_COLORS[row.displayStatus]}>
          {CHARGE_STATUS_LABELS[row.displayStatus]}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 160,
      align: 'right',
      render: (_value, row) => (
        <>
          <Button type="text" size="small" icon={<Eye size={15} />} onClick={() => setSelected(row)} />
          {row.status === 'PENDING' ? (
            <Button
              type="text"
              size="small"
              danger
              icon={<X size={15} />}
              onClick={() => handleCancel(row)}
            />
          ) : null}
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Cobranças"
        description="Gere faturas PIX por unidade, acompanhe baixas automáticas via Asaas e compartilhe o QR ou o código copia-e-cola."
        actions={
          <>
            <Button
              icon={<BellRing size={16} />}
              loading={remindPending.isPending}
              onClick={() =>
                remindPending.mutate(undefined, {
                  onSuccess: (result) =>
                    message.success(
                      result.pendingCharges > 0
                        ? `${result.pendingCharges} cobrança(s) pendente(s); ${result.notifiedUsers} usuário(s) notificado(s).`
                        : 'Nenhuma cobrança pendente para lembrar.',
                    ),
                  onError: (error: unknown) =>
                    message.error(
                      error instanceof ApiError
                        ? error.message
                        : 'Não foi possível enviar os lembretes.',
                    ),
                })
              }
            >
              Lembrar pendentes
            </Button>
            <Button icon={<Settings2 size={16} />} onClick={openSettings}>
              Asaas
            </Button>
            <Button type="primary" icon={<Plus size={16} />} onClick={openGenerate}>
              Gerar cobranças
            </Button>
          </>
        }
      />

      {!asaasQuery.isLoading && !asaasConfigured ? (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="Integração Asaas não configurada"
          description="Salve a chave de API do condomínio para emitir cobranças PIX."
          action={
            <Button size="small" onClick={openSettings}>
              Configurar
            </Button>
          }
        />
      ) : null}

      {summaryQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : summary ? (
        <S.SummaryGrid>
          <S.SummaryCard>
            <S.SummaryLabel>Em aberto</S.SummaryLabel>
            <S.SummaryValue>{summary.pendingCount}</S.SummaryValue>
          </S.SummaryCard>
          <S.SummaryCard>
            <S.SummaryLabel>Valor em aberto</S.SummaryLabel>
            <S.SummaryValue>{formatCentsToBRL(summary.pendingAmountCents)}</S.SummaryValue>
          </S.SummaryCard>
          <S.SummaryCard>
            <S.SummaryLabel>Pagas</S.SummaryLabel>
            <S.SummaryValue>{summary.paidCount}</S.SummaryValue>
          </S.SummaryCard>
          <S.SummaryCard>
            <S.SummaryLabel>Canceladas</S.SummaryLabel>
            <S.SummaryValue>{summary.cancelledCount}</S.SummaryValue>
          </S.SummaryCard>
        </S.SummaryGrid>
      ) : null}

      <S.Filters>
        <Select
          allowClear
          placeholder="Status"
          style={{ width: isMobile ? '100%' : 200 }}
          value={filters.status}
          options={statusOptions}
          onChange={(status) =>
            setFilters((current) => ({
              ...current,
              page: 1,
              status: (status as ChargeStatus | undefined) ?? undefined,
            }))
          }
        />
        <Select
          allowClear
          showSearch
          placeholder="Unidade"
          style={{ width: isMobile ? '100%' : 160 }}
          value={filters.unitNumber}
          options={units.map((unit) => ({ value: unit, label: unit }))}
          onChange={(unitNumber) =>
            setFilters((current) => ({
              ...current,
              page: 1,
              unitNumber: unitNumber || undefined,
            }))
          }
        />
        <Input.Search
          allowClear
          placeholder="Buscar descrição ou pagador"
          style={{ width: isMobile ? '100%' : 280 }}
          onSearch={(search) =>
            setFilters((current) => ({
              ...current,
              page: 1,
              search: search.trim() || undefined,
            }))
          }
        />
      </S.Filters>

      {chargesQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : isMobile ? (
        <>
          {charges.length === 0 ? (
            <S.CardEmpty>Nenhuma cobrança encontrada.</S.CardEmpty>
          ) : (
            <S.CardList>
              {charges.map((charge) => (
                <S.ItemCard key={charge.id}>
                  <S.CardTop>
                    <S.CardTitle>Unidade {charge.unitNumber}</S.CardTitle>
                    <Tag color={CHARGE_STATUS_COLORS[charge.displayStatus]}>
                      {CHARGE_STATUS_LABELS[charge.displayStatus]}
                    </Tag>
                  </S.CardTop>
                  <S.CardMeta>{charge.description}</S.CardMeta>
                  <S.CardMeta>
                    {formatCentsToBRL(charge.amountCents)} · vence{' '}
                    {dayjs(charge.dueDate).format(DATE_FORMAT)}
                  </S.CardMeta>
                  <S.CardActions>
                    <Button icon={<Eye size={16} />} onClick={() => setSelected(charge)}>
                      Ver PIX
                    </Button>
                    {charge.status === 'PENDING' ? (
                      <Button danger icon={<X size={16} />} onClick={() => handleCancel(charge)}>
                        Cancelar
                      </Button>
                    ) : null}
                  </S.CardActions>
                </S.ItemCard>
              ))}
            </S.CardList>
          )}
          {total > (filters.limit ?? 20) ? (
            <S.CardPagination>
              <Pagination
                simple
                current={filters.page}
                pageSize={filters.limit}
                total={total}
                onChange={(page, limit) => setFilters((current) => ({ ...current, page, limit }))}
              />
            </S.CardPagination>
          ) : null}
        </>
      ) : (
        <Table<Charge>
          rowKey="id"
          columns={columns}
          dataSource={charges}
          {...mobileTableProps(false, {
            current: filters.page,
            pageSize: filters.limit,
            total,
            onChange: (page, limit) => setFilters((current) => ({ ...current, page, limit })),
          })}
        />
      )}

      <Drawer
        open={generateOpen}
        title="Gerar cobranças PIX"
        width={mobileOverlayWidth(isMobile, 520)}
        onClose={() => setGenerateOpen(false)}
        destroyOnHidden
      >
        <Form<GenerateFormValues>
          form={generateForm}
          layout="vertical"
          requiredMark={false}
          onFinish={handleGenerate}
          disabled={generateCharges.isPending}
        >
          <Form.Item name="description" label="Descrição" rules={[rules.required(), rules.text(3, 200)]}>
            <Input placeholder="Ex.: Taxa condominial março/2026" />
          </Form.Item>
          <Form.Item name="referenceMonth" label="Competência" rules={[rules.required()]}>
            <DatePicker picker="month" style={{ width: '100%' }} format="MM/YYYY" />
          </Form.Item>
          <Form.Item name="dueDate" label="Vencimento" rules={[rules.required()]}>
            <DatePicker style={{ width: '100%' }} format={DATE_FORMAT} />
          </Form.Item>
          <Form.Item
            name="amountReais"
            label="Valor (R$)"
            rules={[rules.required(), { type: 'number', min: 0.01, message: 'Informe um valor válido' }]}
          >
            <MoneyInput min={0.01} />
          </Form.Item>
          <Form.Item
            name="unitNumbers"
            label="Unidades"
            rules={[{ type: 'array', min: 1, message: 'Selecione ao menos uma unidade' }]}
          >
            <Checkbox.Group
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}
              options={units.map((unit) => ({ value: unit, label: unit }))}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<QrCode size={16} />}
            loading={generateCharges.isPending}
            block
            size="large"
          >
            Gerar faturas PIX
          </Button>
        </Form>

        {generateCharges.data && generateCharges.data.failures.length > 0 ? (
          <Alert
            style={{ marginTop: 16 }}
            type="warning"
            showIcon
            message="Algumas unidades falharam"
            description={
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {generateCharges.data.failures.map((item) => (
                  <li key={item.unitNumber}>
                    {item.unitNumber}: {item.error}
                  </li>
                ))}
              </ul>
            }
          />
        ) : null}
      </Drawer>

      <Drawer
        open={settingsOpen}
        title="Integração Asaas"
        width={mobileOverlayWidth(isMobile, 480)}
        onClose={() => setSettingsOpen(false)}
        destroyOnHidden
      >
        <S.SettingsHint>
          Use a chave de API da conta Asaas do condomínio (sandbox ou produção). O webhook da
          plataforma deve enviar o header <code>asaas-access-token</code> com o token configurado
          no servidor.
          {asaasQuery.data?.apiKeyHint
            ? ` Chave atual: ${asaasQuery.data.apiKeyHint}.`
            : null}
        </S.SettingsHint>
        <Form<SettingsFormValues>
          form={settingsForm}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSaveSettings}
          disabled={upsertAsaas.isPending}
        >
          <Form.Item name="apiKey" label="API Key" rules={[rules.required(), rules.text(10, 500)]}>
            <Input.Password placeholder="$aact_..." />
          </Form.Item>
          <Form.Item name="walletId" label="Wallet ID (opcional)">
            <Input placeholder="Opcional" />
          </Form.Item>
          <Form.Item name="enabled" label="Ativa" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={upsertAsaas.isPending} block size="large">
            Salvar e validar
          </Button>
        </Form>
      </Drawer>

      <Drawer
        open={Boolean(selected)}
        title={selected ? `PIX · Unidade ${selected.unitNumber}` : 'PIX'}
        width={mobileOverlayWidth(isMobile, 480)}
        onClose={() => setSelected(null)}
        destroyOnHidden
      >
        {selected ? (
          <S.PixPanel>
            <Tag color={CHARGE_STATUS_COLORS[selected.displayStatus]}>
              {CHARGE_STATUS_LABELS[selected.displayStatus]}
            </Tag>
            <div>
              <strong>{formatCentsToBRL(selected.amountCents)}</strong>
              <S.CardMeta style={{ marginTop: 8 }}>
                {selected.description}
                <br />
                Vencimento {dayjs(selected.dueDate).format(DATE_FORMAT)}
                <br />
                {selected.payerName}
              </S.CardMeta>
            </div>
            {selected.pixQrCodeBase64 ? (
              <S.PixQr
                src={`data:image/png;base64,${selected.pixQrCodeBase64}`}
                alt="QR Code PIX"
              />
            ) : (
              <S.CardMeta>QR Code indisponível para esta cobrança.</S.CardMeta>
            )}
            {selected.pixPayload ? (
              <>
                <S.PixPayload readOnly value={selected.pixPayload} />
                <Button
                  type="primary"
                  icon={<Copy size={16} />}
                  onClick={() => void copyPix(selected.pixPayload!)}
                  block
                >
                  Copiar código PIX
                </Button>
              </>
            ) : null}
            {selected.status === 'PENDING' ? (
              <Button danger onClick={() => handleCancel(selected)} block>
                Cancelar cobrança
              </Button>
            ) : null}
          </S.PixPanel>
        ) : null}
      </Drawer>
    </>
  );
}
