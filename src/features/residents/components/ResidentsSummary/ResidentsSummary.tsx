import { Building2, ClipboardCheck, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { useResidentsSummaryQuery } from '../../hooks/use-residents';
import { PendingUnitsModal } from '../PendingUnitsModal/PendingUnitsModal';
import * as S from './ResidentsSummary.styles';

const LOADING = '—';

interface CardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  note: string;
  action?: ReactNode;
}

function SummaryCard({ icon, label, value, note, action }: CardProps) {
  return (
    <S.Card>
      <S.Badge aria-hidden>{icon}</S.Badge>
      <S.Content>
        <S.Label>{label}</S.Label>
        <S.Value>{value}</S.Value>
        <S.Note>{note}</S.Note>
        {action}
      </S.Content>
    </S.Card>
  );
}

/** Adhesion panel: how many units already answered the form and how many people they declared. */
export function ResidentsSummary() {
  const { data, isLoading } = useResidentsSummaryQuery();
  const [showPending, setShowPending] = useState(false);

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
          action={
            data ? (
              <S.Action type="button" onClick={() => setShowPending(true)}>
                Ver unidades pendentes
              </S.Action>
            ) : null
          }
        />
        <SummaryCard
          icon={<Users size={20} />}
          label="Moradores cadastrados"
          value={isLoading ? LOADING : data?.totalPeople}
          note="Titulares e moradores adicionais declarados"
        />
      </S.Grid>

      <PendingUnitsModal
        open={showPending}
        units={data?.pendingUnitNumbers ?? []}
        totalUnits={data?.totalUnits ?? 0}
        onClose={() => setShowPending(false)}
      />
    </>
  );
}
