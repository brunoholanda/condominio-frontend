import {
  formatPlanPrice,
  PLANS,
  type PlanId,
} from '../model/plans';
import * as S from '../pages/LandingPage.styles';

interface LandingPlanPickerProps {
  selected: PlanId;
  onSelect: (planId: PlanId) => void;
}

/** Seletor interativo de planos (única seção com “cards” na landing). */
export function LandingPlanPicker({ selected, onSelect }: LandingPlanPickerProps) {
  return (
    <S.PlanGrid role="listbox" aria-label="Planos disponíveis">
      {PLANS.map((plan) => {
        const active = selected === plan.id;

        return (
          <S.PlanCard
            key={plan.id}
            type="button"
            role="option"
            aria-selected={active}
            $active={active}
            $featured={plan.featured}
            onClick={() => onSelect(plan.id)}
          >
            {plan.featured ? <S.PlanBadge>Mais escolhido</S.PlanBadge> : null}
            <S.PlanName>{plan.name}</S.PlanName>
            <S.PlanPrice>
              <S.PlanAmount>{formatPlanPrice(plan.priceCents)}</S.PlanAmount>
              <S.PlanPeriod>{plan.periodLabel}</S.PlanPeriod>
            </S.PlanPrice>
            <S.PlanSummary>{plan.summary}</S.PlanSummary>
            <S.PlanFeatures>
              {plan.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.PlanFeatures>
          </S.PlanCard>
        );
      })}
    </S.PlanGrid>
  );
}
