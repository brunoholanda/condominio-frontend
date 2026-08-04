import { App, Button, Input, Select, Skeleton, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CreditCard, Ticket, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  SUBSCRIPTION_STATUS_COLORS,
  SUBSCRIPTION_STATUS_LABELS,
} from '@/features/account/model/account.types';
import { findPlan } from '@/features/marketing/model/plans';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  usePlatformAccountsQuery,
  useSetAccountActiveMutation,
  useSetPlatformRoleMutation,
  useUpdateAccountSubscriptionMutation,
} from '../hooks/use-platform-admin';
import type {
  PlatformAccount,
  PlatformPlan,
  PlatformSubscriptionStatus,
} from '../model/platform-admin.types';
import * as S from './PlatformAccountsPage.styles';

type QuickFilter =
  | { kind: 'all' }
  | { kind: 'status'; status: PlatformSubscriptionStatus }
  | { kind: 'inactive' };

const PLAN_OPTIONS: { value: PlatformPlan; label: string }[] = [
  { value: 'lite', label: 'Lite' },
  { value: 'prime', label: 'Prime' },
  { value: 'gestor', label: 'Gestor' },
];

const STATUS_OPTIONS = (Object.keys(SUBSCRIPTION_STATUS_LABELS) as PlatformSubscriptionStatus[]).map(
  (value) => ({
    value,
    label: SUBSCRIPTION_STATUS_LABELS[value],
  }),
);

function formatDate(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString('pt-BR');
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Painel do dono do sistema: contas, planos e status de assinatura. */
export function PlatformAccountsPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const isSystemOwner = Boolean(session?.user.isSystemOwner);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>({ kind: 'all' });
  const [planFilter, setPlanFilter] = useState<PlatformPlan | undefined>();
  const [search, setSearch] = useState('');

  const accountsQuery = usePlatformAccountsQuery(isSystemOwner);
  const setActive = useSetAccountActiveMutation();
  const setRole = useSetPlatformRoleMutation();
  const updateSubscription = useUpdateAccountSubscriptionMutation();

  const accounts = accountsQuery.data ?? [];

  const stats = useMemo(() => {
    const byStatus = {
      TRIALING: 0,
      ACTIVE: 0,
      PAST_DUE: 0,
      CANCELED: 0,
    } satisfies Record<PlatformSubscriptionStatus, number>;
    let inactive = 0;

    for (const account of accounts) {
      byStatus[account.subscriptionStatus] += 1;
      if (!account.isActive) {
        inactive += 1;
      }
    }

    return {
      total: accounts.length,
      inactive,
      ...byStatus,
    };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return accounts.filter((account) => {
      if (planFilter && account.plan !== planFilter) {
        return false;
      }

      if (quickFilter.kind === 'status' && account.subscriptionStatus !== quickFilter.status) {
        return false;
      }

      if (quickFilter.kind === 'inactive' && account.isActive) {
        return false;
      }

      if (needle) {
        const haystack = `${account.name} ${account.email}`.toLowerCase();
        if (!haystack.includes(needle)) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, planFilter, quickFilter, search]);

  if (!isSystemOwner) {
    return <Navigate to="/app" replace />;
  }

  const toggleActive = (account: PlatformAccount, active: boolean) => {
    const action = active ? 'ativar' : 'desativar';

    modal.confirm({
      title: `${action.charAt(0).toUpperCase()}${action.slice(1)} a conta de ${account.name}?`,
      content: active
        ? 'A pessoa voltará a poder entrar na plataforma.'
        : 'A pessoa não conseguirá fazer login enquanto a conta estiver desativada.',
      okText: active ? 'Ativar' : 'Desativar',
      okButtonProps: active ? undefined : { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await setActive.mutateAsync({ id: account.id, active });
          message.success(`Conta ${active ? 'ativada' : 'desativada'}.`);
        } catch (error: unknown) {
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível atualizar a conta.',
          );
          throw error;
        }
      },
    });
  };

  const changeRole = (account: PlatformAccount, platformRole: 'SYSTEM_OWNER' | null) => {
    modal.confirm({
      title: platformRole
        ? `Tornar ${account.name} dono do sistema?`
        : `Remover o papel de dono do sistema de ${account.name}?`,
      content: platformRole
        ? 'Essa pessoa terá acesso máximo a todos os condomínios e às contas da plataforma.'
        : 'A pessoa perde o acesso global e fica só com os vínculos de condomínio que já tiver.',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await setRole.mutateAsync({ id: account.id, platformRole });
          message.success('Papel de plataforma atualizado.');
        } catch (error: unknown) {
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível atualizar o papel.',
          );
          throw error;
        }
      },
    });
  };

  const changeSubscription = (
    account: PlatformAccount,
    patch: { plan?: PlatformPlan; status?: PlatformSubscriptionStatus },
  ) => {
    const changingStatus = Boolean(patch.status && patch.status !== account.subscriptionStatus);
    const changingPlan = Boolean(patch.plan && patch.plan !== account.plan);

    const apply = () => {
      updateSubscription.mutate(
        { id: account.id, payload: patch },
        {
          onSuccess: () => message.success('Assinatura atualizada.'),
          onError: (error: unknown) =>
            message.error(
              error instanceof ApiError
                ? error.message
                : 'Não foi possível atualizar a assinatura.',
            ),
        },
      );
    };

    if (changingStatus && (patch.status === 'CANCELED' || patch.status === 'PAST_DUE')) {
      modal.confirm({
        title: `Alterar assinatura de ${account.name}?`,
        content: `O status passará para “${SUBSCRIPTION_STATUS_LABELS[patch.status!]}”.`,
        okText: 'Confirmar',
        okButtonProps: { danger: true },
        cancelText: 'Cancelar',
        onOk: () => apply(),
      });
      return;
    }

    if (changingPlan || changingStatus) {
      apply();
    }
  };

  const introTitle = (() => {
    if (accountsQuery.isLoading) {
      return 'Carregando contas…';
    }

    if (stats.PAST_DUE > 0) {
      return `${stats.PAST_DUE} conta(s) com pagamento em atraso`;
    }

    if (stats.TRIALING > 0) {
      return `${stats.total} contas · ${stats.TRIALING} em período de teste`;
    }

    return `${stats.total} conta(s) na plataforma`;
  })();

  const columns: ColumnsType<PlatformAccount> = [
    {
      title: 'Conta',
      key: 'account',
      ellipsis: true,
      render: (_value, account) => (
        <S.AccountCell>
          <S.AccountName>
            {account.name}
            {account.isSystemOwner ? <Tag color="gold">Dono</Tag> : null}
            {!account.isActive ? <Tag>Off</Tag> : null}
          </S.AccountName>
          <S.AccountEmail>{account.email}</S.AccountEmail>
        </S.AccountCell>
      ),
    },
    {
      title: 'Plano',
      dataIndex: 'plan',
      width: isMobile ? 118 : 132,
      render: (plan: PlatformPlan, account) => (
        <Select
          size="small"
          style={{ width: isMobile ? 108 : 120 }}
          value={plan}
          disabled={updateSubscription.isPending}
          options={PLAN_OPTIONS}
          onChange={(value) => changeSubscription(account, { plan: value })}
          aria-label={`Plano de ${account.name}`}
        />
      ),
    },
    {
      title: 'Assinatura',
      dataIndex: 'subscriptionStatus',
      width: isMobile ? 168 : 188,
      render: (status: PlatformSubscriptionStatus, account) => (
        <Select
          size="small"
          style={{ width: isMobile ? 156 : 176 }}
          value={status}
          disabled={updateSubscription.isPending}
          options={STATUS_OPTIONS}
          optionRender={(option) => (
            <Tag color={SUBSCRIPTION_STATUS_COLORS[option.value as PlatformSubscriptionStatus]}>
              {option.label}
            </Tag>
          )}
          labelRender={(props) => (
            <Tag
              color={SUBSCRIPTION_STATUS_COLORS[props.value as PlatformSubscriptionStatus]}
              style={{ marginInlineEnd: 0 }}
            >
              {SUBSCRIPTION_STATUS_LABELS[props.value as PlatformSubscriptionStatus]}
            </Tag>
          )}
          onChange={(value) => changeSubscription(account, { status: value })}
          aria-label={`Assinatura de ${account.name}`}
        />
      ),
    },
    {
      title: 'Trial até',
      dataIndex: 'trialEndsAt',
      width: 118,
      responsive: ['md'],
      render: (trialEndsAt: string, account) =>
        account.subscriptionStatus === 'TRIALING' ? formatDate(trialEndsAt) : '—',
    },
    {
      title: 'Acesso',
      key: 'activeSwitch',
      width: 88,
      align: 'center',
      fixed: isMobile ? 'right' : undefined,
      render: (_value, account) => (
        <Switch
          checked={account.isActive}
          disabled={setActive.isPending || account.id === session?.user.id}
          onChange={(checked) => toggleActive(account, checked)}
          aria-label={`Acesso de ${account.name}`}
        />
      ),
    },
  ];

  const clearFilters = () => {
    setQuickFilter({ kind: 'all' });
    setPlanFilter(undefined);
    setSearch('');
  };

  const hasActiveFilters =
    quickFilter.kind !== 'all' || Boolean(planFilter) || search.trim().length > 0;

  return (
    <S.Page>
      <PageHeading
        title="Contas e assinaturas"
        description="Gerencie planos, status de pagamento e acesso das contas da plataforma."
        actions={
          <>
            <Button icon={<Ticket size={16} />} onClick={() => void navigate('/app/admin/chamados')}>
              Chamados
            </Button>
            <Button type="default" onClick={() => void navigate('/app')}>
              Voltar
            </Button>
          </>
        }
      />

      <S.Intro>
        <S.IntroIcon aria-hidden>
          <CreditCard size={22} />
        </S.IntroIcon>
        <S.IntroText>
          <S.IntroTitle>{introTitle}</S.IntroTitle>
          <S.IntroDesc>
            Use os atalhos abaixo para filtrar. Expanda uma linha para ver detalhes e o papel de
            dono do sistema.
          </S.IntroDesc>
        </S.IntroText>
      </S.Intro>

      {accountsQuery.isLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : null}

      {!accountsQuery.isLoading && !accountsQuery.isError ? (
        <S.Stats>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'all' && !planFilter}
            onClick={() => {
              setQuickFilter({ kind: 'all' });
              setPlanFilter(undefined);
            }}
          >
            <S.StatValue>{stats.total}</S.StatValue>
            <S.StatLabel>Total</S.StatLabel>
          </S.Stat>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'status' && quickFilter.status === 'TRIALING'}
            onClick={() => setQuickFilter({ kind: 'status', status: 'TRIALING' })}
          >
            <S.StatValue>{stats.TRIALING}</S.StatValue>
            <S.StatLabel>Em teste</S.StatLabel>
          </S.Stat>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'status' && quickFilter.status === 'ACTIVE'}
            onClick={() => setQuickFilter({ kind: 'status', status: 'ACTIVE' })}
          >
            <S.StatValue>{stats.ACTIVE}</S.StatValue>
            <S.StatLabel>Pagas</S.StatLabel>
          </S.Stat>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'status' && quickFilter.status === 'PAST_DUE'}
            onClick={() => setQuickFilter({ kind: 'status', status: 'PAST_DUE' })}
          >
            <S.StatValue>{stats.PAST_DUE}</S.StatValue>
            <S.StatLabel>Em atraso</S.StatLabel>
          </S.Stat>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'status' && quickFilter.status === 'CANCELED'}
            onClick={() => setQuickFilter({ kind: 'status', status: 'CANCELED' })}
          >
            <S.StatValue>{stats.CANCELED}</S.StatValue>
            <S.StatLabel>Canceladas</S.StatLabel>
          </S.Stat>
          <S.Stat
            type="button"
            $active={quickFilter.kind === 'inactive'}
            onClick={() => setQuickFilter({ kind: 'inactive' })}
          >
            <S.StatValue>{stats.inactive}</S.StatValue>
            <S.StatLabel>Desativadas</S.StatLabel>
          </S.Stat>
        </S.Stats>
      ) : null}

      <S.Toolbar>
        <S.Filters>
          <Input.Search
            allowClear
            placeholder="Buscar por nome ou e-mail"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: isMobile ? '100%' : 280 }}
          />
          <Select
            allowClear
            placeholder="Filtrar plano"
            style={{ width: isMobile ? '100%' : 180 }}
            value={planFilter}
            onChange={setPlanFilter}
            options={[
              { value: 'lite', label: findPlan('lite')?.name ?? 'Lite' },
              { value: 'prime', label: findPlan('prime')?.name ?? 'Prime' },
              { value: 'gestor', label: findPlan('gestor')?.name ?? 'Gestor' },
            ]}
          />
          {hasActiveFilters ? (
            <Button type="link" onClick={clearFilters}>
              Limpar filtros
            </Button>
          ) : null}
        </S.Filters>
      </S.Toolbar>

      {accountsQuery.isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : null}

      {accountsQuery.isError ? (
        <S.ErrorBox>
          <Users size={22} aria-hidden />
          <p>Não foi possível carregar as contas. Tente novamente em instantes.</p>
          <Button onClick={() => void accountsQuery.refetch()}>Tentar de novo</Button>
        </S.ErrorBox>
      ) : null}

      {!accountsQuery.isLoading && !accountsQuery.isError ? (
        filteredAccounts.length === 0 ? (
          <S.Empty>
            <Users size={22} aria-hidden />
            <p>
              {accounts.length === 0
                ? 'Ainda não há contas cadastradas na plataforma.'
                : 'Nenhuma conta encontrada com esses filtros.'}
            </p>
            {hasActiveFilters ? (
              <Button type="default" onClick={clearFilters}>
                Limpar filtros
              </Button>
            ) : null}
          </S.Empty>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredAccounts}
            {...mobileTableProps(isMobile, { pageSize: 20 })}
            expandable={{
              expandedRowRender: (account) => (
                <S.ExpandBody>
                  <S.ExpandMeta>
                    <dt>CPF</dt>
                    <dd>{account.cpf || '—'}</dd>
                    <dt>Criada em</dt>
                    <dd>{formatDateTime(account.createdAt)}</dd>
                    <dt>Assinatura atualizada</dt>
                    <dd>{formatDateTime(account.subscriptionUpdatedAt)}</dd>
                    <dt>Trial até</dt>
                    <dd>{formatDate(account.trialEndsAt)}</dd>
                  </S.ExpandMeta>
                  <S.ExpandActions>
                    <S.ExpandActionLabel>Dono do sistema</S.ExpandActionLabel>
                    <Select
                      size="small"
                      style={{ width: 140 }}
                      value={account.isSystemOwner ? 'SYSTEM_OWNER' : 'NONE'}
                      disabled={setRole.isPending}
                      options={[
                        { value: 'NONE', label: 'Não' },
                        { value: 'SYSTEM_OWNER', label: 'Sim' },
                      ]}
                      onChange={(value) =>
                        changeRole(account, value === 'SYSTEM_OWNER' ? 'SYSTEM_OWNER' : null)
                      }
                      aria-label={`Papel de dono de ${account.name}`}
                    />
                  </S.ExpandActions>
                </S.ExpandBody>
              ),
            }}
            locale={{ emptyText: 'Nenhuma conta encontrada com esses filtros.' }}
          />
        )
      ) : null}
    </S.Page>
  );
}
