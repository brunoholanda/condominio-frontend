import { Button, Drawer, Result, Tag } from 'antd';
import dayjs from 'dayjs';
import {
  Briefcase,
  Car,
  IdCard,
  KeyRound,
  LifeBuoy,
  PawPrint,
  Pencil,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { VIEW_ONLY_NOTICE } from '@/shared/privacy/operator-duties';
import { maskCpf, maskPhone, maskPlate } from '@/shared/utils/masks';
import { queries } from '@/styles/theme';
import { useResidentQuery } from '../../hooks/use-residents';
import type { Resident } from '../../model/resident.types';
import { OCCUPANCY_TYPE_LABELS, PET_SPECIES_LABELS } from '../../model/resident.types';
import * as S from './ResidentDetailsDrawer.styles';

const DATE_FORMAT = 'DD/MM/YYYY';
const STAMP_FORMAT = 'DD/MM/YYYY [às] HH:mm';
const NOT_INFORMED = '—';

interface FieldProps {
  label: string;
  value: ReactNode;
}

function Field({ label, value }: FieldProps) {
  const filled = value !== undefined && value !== null && value !== '';

  return (
    <S.Field>
      <S.FieldLabel>{label}</S.FieldLabel>
      <S.FieldValue>{filled ? value : NOT_INFORMED}</S.FieldValue>
    </S.Field>
  );
}

interface GroupProps {
  icon: ReactNode;
  title: string;
  /** Quantos itens a seção reúne; omitido nas seções de valor único. */
  count?: number;
  children: ReactNode;
}

function Group({ icon, title, count, children }: GroupProps) {
  return (
    <S.Group>
      <S.GroupTitle>
        {icon}
        {title}
        {count === undefined ? null : <S.Count>({count})</S.Count>}
      </S.GroupTitle>
      {children}
    </S.Group>
  );
}

function ResidentDetails({ resident }: { resident: Resident }) {
  return (
    <>
      <S.Notice
        type="info"
        showIcon
        message="Você está apenas consultando este cadastro"
        description={VIEW_ONLY_NOTICE}
      />

      <S.Groups>
        <Group icon={<IdCard size={16} />} title="Identificação do morador">
          <S.Fields>
            <Field label="Unidade/Apartamento" value={resident.unit} />
            <Field
              label="Vínculo com a unidade"
              value={
                <Tag color={resident.occupancyType === 'OWNER' ? 'gold' : 'blue'}>
                  {OCCUPANCY_TYPE_LABELS[resident.occupancyType]}
                </Tag>
              }
            />
            <Field label="Nome completo" value={resident.fullName} />
            <Field label="RG" value={resident.rg} />
            <Field label="CPF" value={maskCpf(resident.cpf)} />
            <Field label="E-mail" value={resident.email} />
            <Field
              label="Telefone"
              value={resident.landlinePhone ? maskPhone(resident.landlinePhone) : NOT_INFORMED}
            />
            <Field label="Celular" value={maskPhone(resident.mobilePhone)} />
            <Field
              label="Mudou-se em"
              value={dayjs(resident.movedInAt).format(DATE_FORMAT)}
            />
          </S.Fields>
        </Group>

        <Group icon={<LifeBuoy size={16} />} title="Em caso de emergência">
          <S.Fields>
            <Field label="Nome" value={resident.emergencyContact.name} />
            <Field label="Telefone/Celular" value={maskPhone(resident.emergencyContact.phone)} />
          </S.Fields>
        </Group>

        {resident.landlord ? (
          <Group icon={<KeyRound size={16} />} title="Em caso de locatário">
            <S.Fields>
              <Field label="Proprietário/Administradora" value={resident.landlord.name} />
              <Field label="Telefone" value={maskPhone(resident.landlord.phone)} />
            </S.Fields>
          </Group>
        ) : null}

        <Group
          icon={<Users size={16} />}
          title="Demais moradores da unidade"
          count={resident.householdMembers.length}
        >
          {resident.householdMembers.length === 0 ? (
            <S.Empty>Nenhum outro morador informado.</S.Empty>
          ) : (
            <S.Cards>
              {resident.householdMembers.map((member) => (
                <S.Card key={`${member.fullName}-${member.rg}`}>
                  <S.CardTitle>{member.fullName}</S.CardTitle>
                  <S.Fields>
                    <Field label="RG" value={member.rg} />
                    <Field label="Grau de parentesco" value={member.kinship} />
                  </S.Fields>
                </S.Card>
              ))}
            </S.Cards>
          )}
        </Group>

        <Group
          icon={<Briefcase size={16} />}
          title="Funcionário(s) da unidade"
          count={resident.employees.length}
        >
          {resident.employees.length === 0 ? (
            <S.Empty>Nenhum funcionário informado.</S.Empty>
          ) : (
            <S.Cards>
              {resident.employees.map((employee) => (
                <S.Card key={`${employee.fullName}-${employee.rg}`}>
                  <S.CardTitle>{employee.fullName}</S.CardTitle>
                  <S.Fields>
                    <Field label="RG" value={employee.rg} />
                    <Field label="Cargo" value={employee.role} />
                    <Field label="Expediente" value={employee.workSchedule} />
                  </S.Fields>
                </S.Card>
              ))}
            </S.Cards>
          )}
        </Group>

        <Group icon={<Car size={16} />} title="Veículos da unidade" count={resident.vehicles.length}>
          {resident.vehicles.length === 0 ? (
            <S.Empty>Nenhum veículo informado.</S.Empty>
          ) : (
            <S.Cards>
              {resident.vehicles.map((vehicle) => (
                <S.Card key={vehicle.plate}>
                  <S.CardTitle>
                    {vehicle.brand} {vehicle.model}
                  </S.CardTitle>
                  <S.Fields>
                    <Field label="Placa" value={maskPlate(vehicle.plate)} />
                    <Field label="Cor" value={vehicle.color} />
                  </S.Fields>
                </S.Card>
              ))}
            </S.Cards>
          )}
        </Group>

        <Group icon={<PawPrint size={16} />} title="Animais de estimação" count={resident.pets.length}>
          {resident.pets.length === 0 ? (
            <S.Empty>Nenhum animal informado.</S.Empty>
          ) : (
            <S.Cards>
              {resident.pets.map((pet) => (
                <S.Card key={`${pet.name}-${pet.species}`}>
                  <S.CardTitle>{pet.name}</S.CardTitle>
                  <S.Fields>
                    <Field label="Espécie" value={PET_SPECIES_LABELS[pet.species]} />
                    <Field label="Raça" value={pet.breed} />
                    <Field label="Cor" value={pet.color} />
                  </S.Fields>
                </S.Card>
              ))}
            </S.Cards>
          )}
        </Group>

        <Group icon={<ShieldCheck size={16} />} title="Autorização de uso dos dados">
          <S.Fields>
            <Field
              label="Autorização"
              value={
                <Tag color={resident.dataUsageConsent ? 'green' : 'red'}>
                  {resident.dataUsageConsent ? 'Concedida pelo morador' : 'Não registrada'}
                </Tag>
              }
            />
            <Field label="Assinado em" value={dayjs(resident.signedAt).format(STAMP_FORMAT)} />
          </S.Fields>

          {resident.signature ? (
            <S.Signature src={resident.signature} alt={`Assinatura de ${resident.fullName}`} />
          ) : null}
        </Group>
      </S.Groups>

      <S.Timestamps>
        Cadastro recebido em {dayjs(resident.createdAt).format(STAMP_FORMAT)} · última alteração em{' '}
        {dayjs(resident.updatedAt).format(STAMP_FORMAT)}
      </S.Timestamps>
    </>
  );
}

interface ResidentDetailsDrawerProps {
  /** Mantido enquanto o painel fecha, para o conteúdo não sumir na animação. */
  residentId: string | undefined;
  open: boolean;
  onClose: () => void;
  onEdit: (resident: Resident) => void;
}

/** Consulta da ficha inteira sem campos editáveis, para quem só precisa ler. */
export function ResidentDetailsDrawer({
  residentId,
  open,
  onClose,
  onEdit,
}: ResidentDetailsDrawerProps) {
  const isMobile = useMediaQuery(queries.downMd);
  const residentQuery = useResidentQuery(residentId);
  const resident = residentQuery.data;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      loading={residentQuery.isLoading}
      width={isMobile ? '100%' : 640}
      styles={{ body: { padding: isMobile ? 16 : 24 } }}
      title={resident ? `Unidade ${resident.unit} · ${resident.fullName}` : 'Cadastro do morador'}
      footer={
        <S.Footer>
          <Button onClick={onClose}>Fechar</Button>
          <Button
            type="primary"
            icon={<Pencil size={16} />}
            disabled={!resident}
            onClick={() => {
              if (resident) {
                onEdit(resident);
              }
            }}
          >
            Editar cadastro
          </Button>
        </S.Footer>
      }
    >
      {residentQuery.isError ? (
        <Result
          status="error"
          title="Não foi possível abrir o cadastro"
          subTitle="Feche o painel e tente novamente em alguns instantes."
        />
      ) : null}

      {resident ? <ResidentDetails resident={resident} /> : null}
    </Drawer>
  );
}
