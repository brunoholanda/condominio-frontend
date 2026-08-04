import { App, Modal } from 'antd';
import { useMemo } from 'react';

import { ApiError } from '@/shared/api/api-error';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { useSetUnitVacancyMutation } from '../../hooks/use-residents';
import { groupUnitsByFloor } from '../../model/condo';
import * as S from './PendingUnitsModal.styles';

interface PendingUnitsModalProps {
  open: boolean;
  condominiumId: string;
  units: string[];
  vacantUnits: string[];
  totalUnits: number;
  onClose: () => void;
}

/** Quais apartamentos ainda não entregaram a ficha, agrupados por andar. */
export function PendingUnitsModal({
  open,
  condominiumId,
  units,
  vacantUnits,
  totalUnits,
  onClose,
}: PendingUnitsModalProps) {
  const { modal, message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const floors = useMemo(() => groupUnitsByFloor(units), [units]);
  const vacantFloors = useMemo(() => groupUnitsByFloor(vacantUnits), [vacantUnits]);
  const setVacancy = useSetUnitVacancyMutation(condominiumId);

  const applyVacancy = async (unit: string, vacant: boolean) => {
    try {
      await setVacancy.mutateAsync({ unitNumber: unit, vacant });
      message.success(
        vacant
          ? `Unidade ${unit} marcada como desocupada.`
          : `Unidade ${unit} voltou para a lista de pendentes.`,
      );
    } catch (error: unknown) {
      message.error(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível atualizar a unidade.',
      );
      throw error;
    }
  };

  const confirmMarkVacant = (unit: string) => {
    modal.confirm({
      title: `Marcar unidade ${unit} como desocupada?`,
      content:
        'Isso sinaliza que, no momento, ninguém mora nessa unidade. Ela sai da lista de pendentes e pode voltar se alguém se cadastrar depois.',
      okText: 'Marcar desocupada',
      cancelText: 'Cancelar',
      onOk: () => applyVacancy(unit, true),
    });
  };

  const confirmClearVacant = (unit: string) => {
    modal.confirm({
      title: `Remover sinalização da unidade ${unit}?`,
      content: 'A unidade volta a aparecer como pendente de preenchimento do cadastro.',
      okText: 'Voltar para pendentes',
      cancelText: 'Cancelar',
      onOk: () => applyVacancy(unit, false),
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Fechar"
      cancelButtonProps={{ style: { display: 'none' } }}
      width={mobileOverlayWidth(isMobile, 560)}
      title="Unidades que faltam preencher"
    >
      {units.length === 0 && vacantUnits.length === 0 ? (
        <S.Intro>
          Todas as {totalUnits} unidades do condomínio já preencheram o cadastro de morador.
        </S.Intro>
      ) : (
        <>
          <S.Intro>
            {units.length === 0
              ? 'Não há unidades pendentes de cadastro no momento.'
              : `${units.length} de ${totalUnits} unidades ainda não enviaram o formulário. Clique em uma unidade para marcá-la como desocupada (ninguém mora no momento).`}
          </S.Intro>

          {floors.map(({ floor, units: floorUnits }) => (
            <S.Floor key={floor}>
              <S.FloorTitle>
                {/^\d+$/.test(floor) ? `${floor}º andar` : floor} · {floorUnits.length}{' '}
                pendente(s)
              </S.FloorTitle>
              <S.Units>
                {floorUnits.map((unit) => (
                  <li key={unit}>
                    <S.UnitButton
                      type="button"
                      title={`Marcar ${unit} como desocupada`}
                      disabled={setVacancy.isPending}
                      onClick={() => confirmMarkVacant(unit)}
                    >
                      {unit}
                    </S.UnitButton>
                  </li>
                ))}
              </S.Units>
            </S.Floor>
          ))}

          {vacantUnits.length > 0 ? (
            <S.VacantSection>
              <S.Intro>
                {vacantUnits.length} unidade(s) marcada(s) como desocupada(s). Clique para
                remover a sinalização.
              </S.Intro>
              {vacantFloors.map(({ floor, units: floorUnits }) => (
                <S.Floor key={`vacant-${floor}`}>
                  <S.FloorTitle>
                    {/^\d+$/.test(floor) ? `${floor}º andar` : floor} · {floorUnits.length}{' '}
                    desocupada(s)
                  </S.FloorTitle>
                  <S.Units>
                    {floorUnits.map((unit) => (
                      <li key={unit}>
                        <S.VacantUnitButton
                          type="button"
                          title={`Remover sinalização da unidade ${unit}`}
                          disabled={setVacancy.isPending}
                          onClick={() => confirmClearVacant(unit)}
                        >
                          {unit}
                        </S.VacantUnitButton>
                      </li>
                    ))}
                  </S.Units>
                </S.Floor>
              ))}
            </S.VacantSection>
          ) : null}
        </>
      )}
    </Modal>
  );
}
