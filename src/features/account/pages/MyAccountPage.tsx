import { App, Button, Skeleton, Tag } from 'antd';
import { Check, CreditCard, LifeBuoy, Sparkles } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  findPlan,
  formatPlanPrice,
  PLANS,
  TRIAL_DAYS,
  type PlanId,
} from '@/features/marketing/model/plans';
import { useMyTicketsQuery } from '@/features/support/hooks/use-support';
import {
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
} from '@/features/support/model/support.types';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useBillingPortalMutation, useCheckoutMutation } from '../hooks/use-billing';
import {
  SUBSCRIPTION_STATUS_COLORS,
  SUBSCRIPTION_STATUS_LABELS,
  trialDaysRemaining,
} from '../model/account.types';
import * as S from './MyAccountPage.styles';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const last = parts[parts.length - 1];

  if (!first) {
    return '?';
  }

  if (!last || parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

/** Assinatura da conta (Stripe) + resumo dos chamados de suporte. */
export function MyAccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { message } = App.useApp();
  const { session, refreshSession } = useAuth();
  const user = session?.user;
  const ticketsQuery = useMyTicketsQuery(Boolean(user));
  const checkout = useCheckoutMutation();
  const portal = useBillingPortalMutation();
  const openTickets = useMemo(
    () =>
      ticketsQuery.data?.filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS',
      ) ?? [],
    [ticketsQuery.data],
  );

  useEffect(() => {
    const checkoutResult = searchParams.get('checkout');

    if (!checkoutResult) {
      return;
    }

    if (checkoutResult === 'success') {
      message.success('Pagamento confirmado. Sua assinatura será atualizada em instantes.');
      void refreshSession();
    } else if (checkoutResult === 'cancel') {
      message.info('Checkout cancelado. Você pode tentar de novo quando quiser.');
    }

    const next = new URLSearchParams(searchParams);
    next.delete('checkout');
    setSearchParams(next, { replace: true });
  }, [message, refreshSession, searchParams, setSearchParams]);

  if (!user) {
    return null;
  }

  const plan = findPlan(user.plan) ?? PLANS[0]!;
  const daysLeft = trialDaysRemaining(user.trialEndsAt);
  const isTrialing = user.subscriptionStatus === 'TRIALING';
  const trialRatio = isTrialing ? Math.min(1, Math.max(0, 1 - daysLeft / TRIAL_DAYS)) : 0;
  const upgradePlans = PLANS.filter((item) => {
    if (user.plan === 'lite') {
      return item.id === 'prime' || item.id === 'gestor';
    }

    if (user.plan === 'prime') {
      return item.id === 'gestor';
    }

    return false;
  });
  const showConfirmLite = isTrialing && user.plan === 'lite';

  const startCheckout = (planId: PlanId) => {
    checkout.mutate(planId, {
      onSuccess: ({ url }) => {
        window.location.assign(url);
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível abrir o checkout Stripe.',
        ),
    });
  };

  const openPortal = () => {
    portal.mutate(undefined, {
      onSuccess: ({ url }) => {
        window.location.assign(url);
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível abrir o portal Stripe.',
        ),
    });
  };

  return (
    <S.Page>
      <PageHeading
        title="Minha conta"
        description="Plano, pagamento e chamados de suporte em um só lugar."
      />

      <S.Profile>
        <S.Avatar aria-hidden>{initials(user.name)}</S.Avatar>
        <S.ProfileText>
          <S.ProfileName>{user.name}</S.ProfileName>
          <S.ProfileEmail title={user.email}>{user.email}</S.ProfileEmail>
        </S.ProfileText>
      </S.Profile>

      <S.PlanPanel>
        <S.PlanEyebrow>Seu plano atual</S.PlanEyebrow>
        <S.PlanHeader>
          <div>
            <S.PlanTitle>{plan.name}</S.PlanTitle>
            <S.PlanPrice>
              <strong>{formatPlanPrice(plan.priceCents)}</strong>
              {plan.periodLabel}
            </S.PlanPrice>
          </div>
          <Tag color={SUBSCRIPTION_STATUS_COLORS[user.subscriptionStatus]}>
            {SUBSCRIPTION_STATUS_LABELS[user.subscriptionStatus]}
          </Tag>
        </S.PlanHeader>

        <S.PlanSummary>{plan.summary}</S.PlanSummary>

        <S.Highlights>
          {plan.highlights.map((item) => (
            <S.Highlight key={item}>
              <Check size={16} aria-hidden />
              <span>{item}</span>
            </S.Highlight>
          ))}
        </S.Highlights>

        {isTrialing ? (
          <S.TrialBox>
            <S.TrialLabel>
              <span>
                Teste grátis · <strong>{daysLeft === 0 ? 'encerra hoje' : `${daysLeft} dia(s)`}</strong>
              </span>
              <span>até {new Date(user.trialEndsAt).toLocaleDateString('pt-BR')}</span>
            </S.TrialLabel>
            <S.TrialTrack>
              <S.TrialFill $ratio={trialRatio} />
            </S.TrialTrack>
          </S.TrialBox>
        ) : null}

        <S.Actions>
          {showConfirmLite ? (
            <Button
              type="primary"
              size="large"
              loading={checkout.isPending}
              onClick={() => startCheckout('lite')}
            >
              Confirmar Lite no Stripe
            </Button>
          ) : null}
          <Button
            size="large"
            icon={<CreditCard size={16} />}
            loading={portal.isPending}
            onClick={openPortal}
          >
            Gerenciar pagamento
          </Button>
          <Button
            size="large"
            icon={<LifeBuoy size={16} />}
            onClick={() => void navigate('/app/suporte')}
          >
            Suporte
          </Button>
        </S.Actions>
      </S.PlanPanel>

      {upgradePlans.length > 0 ? (
        <S.Section>
          <S.SectionHead>
            <div>
              <S.SectionTitle>Mudar de plano</S.SectionTitle>
              <S.SectionDesc>
                Escolha um plano e conclua o pagamento com segurança pelo Stripe.
              </S.SectionDesc>
            </div>
          </S.SectionHead>

          <S.UpgradeGrid>
            {upgradePlans.map((item) => (
              <S.UpgradeOption
                key={item.id}
                type="button"
                disabled={checkout.isPending}
                onClick={() => startCheckout(item.id)}
              >
                <S.UpgradeName>
                  {item.name}
                  <S.UpgradePrice>
                    {formatPlanPrice(item.priceCents)}
                    {item.periodLabel}
                  </S.UpgradePrice>
                </S.UpgradeName>
                <S.UpgradeSummary>{item.summary}</S.UpgradeSummary>
                <S.UpgradeCta>
                  <Sparkles size={16} aria-hidden />
                  Assinar {item.name}
                </S.UpgradeCta>
              </S.UpgradeOption>
            ))}
          </S.UpgradeGrid>
        </S.Section>
      ) : null}

      <S.Section>
        <S.SectionHead>
          <div>
            <S.SectionTitle>Chamados abertos</S.SectionTitle>
            <S.SectionDesc>Acompanhe o andamento dos seus tickets.</S.SectionDesc>
          </div>
          <Button type="link" onClick={() => void navigate('/app/suporte')}>
            Ver todos / abrir
          </Button>
        </S.SectionHead>

        {ticketsQuery.isLoading ? <Skeleton active paragraph={{ rows: 3 }} /> : null}

        {!ticketsQuery.isLoading && openTickets.length === 0 ? (
          <S.EmptyTickets>
            <p>Nenhum chamado em andamento. Se precisar de ajuda, abra um ticket no suporte.</p>
            <Button icon={<LifeBuoy size={16} />} onClick={() => void navigate('/app/suporte')}>
              Ir para suporte
            </Button>
          </S.EmptyTickets>
        ) : null}

        <S.TicketList>
          {openTickets.slice(0, 5).map((ticket) => (
            <S.TicketItem key={ticket.id}>
              <S.TicketMeta>
                <Tag color={TICKET_STATUS_COLORS[ticket.status]}>
                  {TICKET_STATUS_LABELS[ticket.status]}
                </Tag>
                <Tag>{TICKET_CATEGORY_LABELS[ticket.category]}</Tag>
              </S.TicketMeta>
              <S.TicketSubject>{ticket.subject}</S.TicketSubject>
            </S.TicketItem>
          ))}
        </S.TicketList>
      </S.Section>
    </S.Page>
  );
}
