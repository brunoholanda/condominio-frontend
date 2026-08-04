import { App, Button, Form, Input, Modal, Result, Select, Skeleton } from 'antd';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { useManagerCondominium } from '../components/ManagerLayout';
import {
  useAddCondoMemberMutation,
  useCondoMembersQuery,
  useRemoveCondoMemberMutation,
  useUpdateCondoMemberRoleMutation,
} from '../hooks/use-condominiums';
import type { AddCondoMemberPayload, CondoMember, MembershipRole } from '../model/condominium.types';
import {
  MEMBERSHIP_ROLES,
  MEMBERSHIP_ROLE_DESCRIPTIONS,
  MEMBERSHIP_ROLE_LABELS,
} from '../model/condominium.types';
import * as S from './MembersAdminPage.styles';

const ROLE_OPTIONS = MEMBERSHIP_ROLES.map((value) => ({
  value,
  label: MEMBERSHIP_ROLE_LABELS[value],
}));

interface AddMemberFormValues {
  email: string;
  role: MembershipRole;
  name?: string;
  password?: string;
  isNewAccount: boolean;
}

/** OWNER gerencia quem acessa o condomínio e com qual papel. */
export function MembersAdminPage() {
  const condominium = useManagerCondominium();
  const { session } = useAuth();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [form] = Form.useForm<AddMemberFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const isNewAccount = Form.useWatch('isNewAccount', form) ?? true;

  const membersQuery = useCondoMembersQuery(condominium.id);
  const addMember = useAddCondoMemberMutation(condominium.id);
  const updateRole = useUpdateCondoMemberRoleMutation(condominium.id);
  const removeMember = useRemoveCondoMemberMutation(condominium.id);

  if (condominium.myRole !== 'OWNER') {
    return (
      <Result
        status="403"
        title="Acesso restrito"
        subTitle="Somente o proprietário do condomínio pode gerenciar a equipe."
      />
    );
  }

  const members = membersQuery.data ?? [];

  const openCreate = () => {
    form.setFieldsValue({
      email: '',
      role: 'OPERATOR',
      name: undefined,
      password: undefined,
      isNewAccount: true,
    });
    setModalOpen(true);
  };

  const handleSubmit = (values: AddMemberFormValues) => {
    const payload: AddCondoMemberPayload = {
      email: values.email.trim().toLowerCase(),
      role: values.role,
      ...(values.isNewAccount
        ? { name: values.name?.trim(), password: values.password }
        : {}),
    };

    addMember.mutate(payload, {
      onSuccess: () => {
        message.success('Pessoa adicionada à equipe.');
        setModalOpen(false);
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível adicionar a pessoa.',
        ),
    });
  };

  const handleRoleChange = (member: CondoMember, role: MembershipRole) => {
    if (role === member.role) {
      return;
    }

    updateRole.mutate(
      { membershipId: member.id, role },
      {
        onSuccess: () => message.success(`Papel de ${member.name} atualizado.`),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível alterar o papel.',
          ),
      },
    );
  };

  const handleRemove = (member: CondoMember) => {
    modal.confirm({
      title: `Remover ${member.name} da equipe?`,
      content: 'A pessoa perde o acesso a este condomínio, mas a conta na plataforma permanece.',
      okText: 'Remover',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () =>
        removeMember.mutate(member.id, {
          onSuccess: () => message.success('Acesso removido.'),
          onError: (error: unknown) =>
            message.error(
              error instanceof ApiError ? error.message : 'Não foi possível remover o acesso.',
            ),
        }),
    });
  };

  return (
    <>
      <PageHeading
        title="Equipe"
        description="Defina quem pode acessar este condomínio e o que cada pessoa pode fazer."
        actions={
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Adicionar pessoa
          </Button>
        }
      />

      <S.Hint>
        Cada pessoa precisa de uma conta na plataforma. Você pode criar a conta aqui ou vincular
        alguém que já se cadastrou em /registro. Gestores novos também podem se cadastrar sozinhos e
        criar os próprios condomínios.
      </S.Hint>

      {membersQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

      {!membersQuery.isLoading ? (
        <S.List>
          {members.map((member) => {
            const isSelf = member.userId === session?.user.id;

            return (
              <S.Row key={member.id}>
                <S.Info>
                  <S.Name>
                    {member.name}
                    {isSelf ? ' (você)' : ''}
                  </S.Name>
                  <S.Email>{member.email}</S.Email>
                </S.Info>

                <S.Actions>
                  <Select
                    value={member.role}
                    options={ROLE_OPTIONS}
                    style={{ minWidth: isMobile ? undefined : 160, width: isMobile ? '100%' : undefined }}
                    disabled={updateRole.isPending}
                    onChange={(role) => handleRoleChange(member, role)}
                    aria-label={`Papel de ${member.name}`}
                  />
                  <Button
                    danger
                    icon={<Trash2 size={16} />}
                    disabled={isSelf || removeMember.isPending}
                    onClick={() => handleRemove(member)}
                    block={isMobile}
                  >
                    Remover
                  </Button>
                </S.Actions>
              </S.Row>
            );
          })}
        </S.List>
      ) : null}

      <Modal
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <UserCog size={18} /> Adicionar à equipe
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form<AddMemberFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          disabled={addMember.isPending}
          initialValues={{ role: 'OPERATOR', isNewAccount: true }}
        >
          <Form.Item name="isNewAccount" label="Situação da pessoa">
            <Select
              options={[
                { value: true, label: 'Criar conta nova na plataforma' },
                { value: false, label: 'Já tem conta (só vincular pelo e-mail)' },
              ]}
            />
          </Form.Item>

          <Form.Item name="email" label="E-mail" rules={[rules.required(), rules.email()]}>
            <Input type="email" autoComplete="off" />
          </Form.Item>

          {isNewAccount ? (
            <>
              <Form.Item name="name" label="Nome completo" rules={[rules.required(), rules.text(3, 150)]}>
                <Input autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Senha inicial"
                rules={[rules.required(), rules.text(8, 72)]}
                extra="A pessoa entra com e-mail + senha e confirma o código enviado por e-mail."
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </>
          ) : null}

          <Form.Item name="role" label="Papel de acesso" rules={[rules.required()]}>
            <Select options={ROLE_OPTIONS} />
          </Form.Item>

          <S.RoleHelp>
            {MEMBERSHIP_ROLES.map((role) => (
              <li key={role}>
                <strong>{MEMBERSHIP_ROLE_LABELS[role]}:</strong> {MEMBERSHIP_ROLE_DESCRIPTIONS[role]}
              </li>
            ))}
          </S.RoleHelp>

          <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={addMember.isPending}>
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
