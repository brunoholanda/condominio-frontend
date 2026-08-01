import { Modal } from 'antd';
import { useMemo } from 'react';

import { groupUnitsByFloor } from '../../model/condo';
import * as S from './PendingUnitsModal.styles';

interface PendingUnitsModalProps {
  open: boolean;
  units: string[];
  totalUnits: number;
  onClose: () => void;
}

/** Quais apartamentos ainda não entregaram a ficha, agrupados por andar. */
export function PendingUnitsModal({ open, units, totalUnits, onClose }: PendingUnitsModalProps) {
  const floors = useMemo(() => groupUnitsByFloor(units), [units]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Fechar"
      cancelButtonProps={{ style: { display: 'none' } }}
      width={560}
      title="Unidades que faltam preencher"
    >
      {units.length === 0 ? (
        <S.Intro>
          Todas as {totalUnits} unidades do condomínio já preencheram o cadastro de morador.
        </S.Intro>
      ) : (
        <>
          <S.Intro>
            {units.length} de {totalUnits} unidades ainda não enviaram o formulário. Lembre-se de que
            basta um morador de cada apartamento preencher.
          </S.Intro>

          {floors.map(({ floor, units: floorUnits }) => (
            <S.Floor key={floor}>
              <S.FloorTitle>
                {floor}º andar · {floorUnits.length} pendente(s)
              </S.FloorTitle>
              <S.Units>
                {floorUnits.map((unit) => (
                  <S.Unit key={unit}>{unit}</S.Unit>
                ))}
              </S.Units>
            </S.Floor>
          ))}
        </>
      )}
    </Modal>
  );
}
