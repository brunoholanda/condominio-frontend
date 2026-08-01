import { Building2, ClipboardCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { useResidentsSummaryQuery } from '../../hooks/use-residents';
import { DeclaredPeopleModal } from '../DeclaredPeopleModal/DeclaredPeopleModal';
import { PendingUnitsModal } from '../PendingUnitsModal/PendingUnitsModal';
import * as S from './ResidentsSummary.styles';

const LOADING = '—';

interface CardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  note: string;
  /** Sem `onClick` o card é só informativo; com ele, o card inteiro abre a tela. */
  actionLabel?: string;
  onClick?: () => void;
}

function SummaryCard({ icon, label, value, note, actionLabel, onClick }: CardProps) {
  const Wrapper = onClick ? S.InteractiveCard : S.Card;

  return (
    <Wrapper>
      <S.Badge aria-hidden>{icon}</S.Badge>
      <S.Content>
        <S.Label>{label}</S.Label>
        <S.Value>{value}</S.Value>
        <S.Note>{note}</S.Note>
        {onClick ? (
          <S.Action type="button" onClick={onClick}>
            {actionLabel}
          </S.Action>
        ) : null}
      </S.Content>
    </Wrapper>
  );
}

/** Adhesion panel: how many units already answered the form and how many people they declared. */
export function ResidentsSummary() {
  const { data, isLoading } = useResidentsSummaryQuery();
  const [showPending, setShowPending] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

  const percentage =
    data && data.totalUnits > 0 ? Math.round((data.registeredUnits / data.totalUnits) * 100) : 0;

  return (
    <>
      <S.Grid aria-label="Resumo do condomínio">
        <SummaryCard
          icon={<Building2 size={20} />}
          label="Unidades no condomínio"
          value={isLoading ? LOADING : data?.totalUnits}
          note="17 apartamentos em cada um dos 4 andares"
        />
        <SummaryCard
          icon={<ClipboardCheck size={20} />}
          label="Formulários preenchidos"
          value={isLoading ? LOADING : `${data?.registeredUnits ?? 0}/${data?.totalUnits ?? 0}`}
          note={
            isLoading
              ? 'Carregando...'
              : `${percentage}% das unidades · faltam ${data?.pendingUnits ?? 0}`
          }
          actionLabel="Ver unidades pendentes"
          onClick={data ? () => setShowPending(true) : undefined}
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Moradores cadastrados"
          value={isLoading ? LOADING : data?.totalPeople}
          note="Titulares e moradores adicionais declarados"
          actionLabel="Ver a lista com telefones"
          onClick={data ? () => setShowPeople(true) : undefined}
        />
      </S.Grid>

      <PendingUnitsModal
        open={showPending}
        units={data?.pendingUnitNumbers ?? []}
        totalUnits={data?.totalUnits ?? 0}
        onClose={() => setShowPending(false)}
      />

      <DeclaredPeopleModal open={showPeople} onClose={() => setShowPeople(false)} />
    </>
  );
}
