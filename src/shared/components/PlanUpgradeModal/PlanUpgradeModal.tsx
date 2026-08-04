import { App, Button, Modal } from 'antd';
import { Sparkles } from 'lucide-react';

import { useCheckoutMutation } from '@/features/account/hooks/use-billing';
import { findPlan, formatPlanPrice, type PlanId } from '@/features/marketing/model/plans';
import { ApiError } from '@/shared/api/api-error';

interface PlanUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  upgradePlanId: PlanId;
}

/** Modal informativo + checkout Stripe quando o plano atual não cobre a ação. */
export function PlanUpgradeModal({
  open,
  onClose,
  title,
  description,
  upgradePlanId,
}: PlanUpgradeModalProps) {
  const { message } = App.useApp();
  const checkout = useCheckoutMutation();
  const upgrade = findPlan(upgradePlanId);

  if (!upgrade) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
        <Button
          key="plan"
          type="primary"
          icon={<Sparkles size={16} />}
          loading={checkout.isPending}
          onClick={() => {
            checkout.mutate(upgradePlanId, {
              onSuccess: ({ url }) => {
                onClose();
                window.location.assign(url);
              },
              onError: (error: unknown) =>
                message.error(
                  error instanceof ApiError
                    ? error.message
                    : 'Não foi possível abrir o checkout Stripe.',
                ),
            });
          }}
        >
          Assinar {upgrade.name} agora
        </Button>,
      ]}
    >
      <p>{description}</p>
      <p>
        Com o plano <strong>{upgrade.name}</strong> (
        {formatPlanPrice(upgrade.priceCents)}
        {upgrade.periodLabel}): {upgrade.summary}
      </p>
      <p>O pagamento é processado com segurança pelo Stripe.</p>
    </Modal>
  );
}
