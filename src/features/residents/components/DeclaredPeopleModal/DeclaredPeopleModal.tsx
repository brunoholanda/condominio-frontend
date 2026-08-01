import { Input, Modal, Result, Skeleton } from 'antd';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { maskPhone } from '@/shared/utils/masks';
import { useAllResidentsQuery } from '../../hooks/use-residents';
import type { ResidentListItem } from '../../model/resident.types';
import { OCCUPANCY_TYPE_LABELS } from '../../model/resident.types';
import * as S from './DeclaredPeopleModal.styles';

interface DeclaredPerson {
  key: string;
  name: string;
  unit: string;
  /** Titular com o vínculo, ou o parentesco declarado pelo morador adicional. */
  role: string;
  phone: string;
  /** Moradores adicionais não informam contato próprio: o número é o do titular. */
  ownPhone: boolean;
}

/** Titular na frente, depois quem ele declarou, unidade por unidade. */
function toDeclaredPeople(residents: ResidentListItem[]): DeclaredPerson[] {
  return residents
    .toSorted((first, second) => first.unit.localeCompare(second.unit, 'pt-BR', { numeric: true }))
    .flatMap((resident) => [
      {
        key: resident.id,
        name: resident.fullName,
        unit: resident.unit,
        role: `Titular · ${OCCUPANCY_TYPE_LABELS[resident.occupancyType]}`,
        phone: resident.mobilePhone,
        ownPhone: true,
      },
      ...resident.householdMembers.map((member, index) => ({
        key: `${resident.id}-${index}`,
        name: member.fullName,
        unit: resident.unit,
        role: member.kinship,
        phone: resident.mobilePhone,
        ownPhone: false,
      })),
    ]);
}

/** Busca sem acento e sem caixa, do jeito que a pessoa digita com pressa. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

interface DeclaredPeopleModalProps {
  open: boolean;
  onClose: () => void;
}

/** Quem mora no condomínio e por qual telefone falar com a unidade. */
export function DeclaredPeopleModal({ open, onClose }: DeclaredPeopleModalProps) {
  const { data, isLoading, isError } = useAllResidentsQuery(open);
  const [search, setSearch] = useState('');

  const people = useMemo(() => toDeclaredPeople(data ?? []), [data]);

  const found = useMemo(() => {
    const term = normalize(search.trim());

    return term === ''
      ? people
      : people.filter(
          (person) => normalize(person.name).includes(term) || person.unit.includes(term),
        );
  }, [people, search]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      okText="Fechar"
      cancelButtonProps={{ style: { display: 'none' } }}
      width={640}
      title="Moradores declarados"
    >
      <S.Intro>
        Todas as pessoas informadas nos formulários das unidades. O telefone é sempre o celular do
        titular, porque moradores adicionais não declaram contato próprio. Use os números apenas
        para assuntos do condomínio.
      </S.Intro>

      {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : null}

      {isError ? (
        <Result
          status="error"
          title="Não foi possível carregar a lista"
          subTitle="Feche e abra novamente em alguns instantes."
        />
      ) : null}

      {data ? (
        <>
          <Input
            allowClear
            prefix={<Search size={15} />}
            placeholder="Buscar por nome ou unidade"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <S.Count>
            {found.length === people.length
              ? `${people.length} pessoa(s) em ${data.length} unidade(s)`
              : `${found.length} de ${people.length} pessoa(s)`}
          </S.Count>

          {found.length === 0 ? (
            <S.Empty>Nenhuma pessoa encontrada para essa busca.</S.Empty>
          ) : (
            <S.People>
              {found.map((person) => (
                <S.Person key={person.key}>
                  <S.Identity>
                    <S.Name>{person.name}</S.Name>
                    <S.Role>
                      Unidade {person.unit} · {person.role}
                    </S.Role>
                  </S.Identity>

                  <S.Contact>
                    <S.Phone href={`tel:+55${person.phone}`}>{maskPhone(person.phone)}</S.Phone>
                    {person.ownPhone ? null : <S.PhoneNote>contato do titular</S.PhoneNote>}
                  </S.Contact>
                </S.Person>
              ))}
            </S.People>
          )}
        </>
      ) : null}
    </Modal>
  );
}
