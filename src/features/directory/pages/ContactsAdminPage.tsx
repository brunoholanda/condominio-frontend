import { App, Button, Form, Input, Modal, Select, Skeleton } from 'antd';
import { ArrowDown, ArrowUp, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { PhoneInput } from '@/shared/components/PhoneInput/PhoneInput';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { maskPhone, onlyDigits } from '@/shared/utils/masks';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useContactsQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
  useReorderContactsMutation,
  useUpdateContactMutation,
} from '../hooks/use-contacts';
import type { ContactCategory, UsefulContact, UsefulContactPayload } from '../model/contact.types';
import { CONTACT_CATEGORIES, CONTACT_CATEGORY_LABELS } from '../model/contact.types';
import * as S from './ContactsAdminPage.styles';

const CATEGORY_OPTIONS = CONTACT_CATEGORIES.map((value) => ({
  value,
  label: CONTACT_CATEGORY_LABELS[value],
}));

interface ContactFormValues {
  label: string;
  category: ContactCategory;
  phone?: string;
  url?: string;
}

export function ContactsAdminPage() {
  const condominium = useManagerCondominium();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [form] = Form.useForm<ContactFormValues>();
  const [editing, setEditing] = useState<UsefulContact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const contactsQuery = useContactsQuery(condominium.id);
  const createContact = useCreateContactMutation(condominium.id);
  const updateContact = useUpdateContactMutation(condominium.id);
  const deleteContact = useDeleteContactMutation(condominium.id);
  const reorderContacts = useReorderContactsMutation(condominium.id);

  const contacts = contactsQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (contact: UsefulContact) => {
    setEditing(contact);
    form.setFieldsValue({
      label: contact.label,
      category: contact.category,
      phone: contact.phone ? maskPhone(contact.phone) : undefined,
      url: contact.url ?? undefined,
    });
    setModalOpen(true);
  };

  const handleSubmit = (values: ContactFormValues) => {
    const payload: UsefulContactPayload = {
      label: values.label.trim(),
      category: values.category,
      phone: values.phone ? onlyDigits(values.phone) || undefined : undefined,
      url: values.url?.trim() || undefined,
    };

    const onSuccess = () => {
      message.success(editing ? 'Contato atualizado.' : 'Contato adicionado.');
      setModalOpen(false);
    };
    const onError = (error: unknown) =>
      message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar o contato.');

    if (editing) {
      updateContact.mutate({ id: editing.id, payload }, { onSuccess, onError });
    } else {
      createContact.mutate(payload, { onSuccess, onError });
    }
  };

  const handleDelete = (contact: UsefulContact) => {
    modal.confirm({
      title: `Remover "${contact.label}"?`,
      okText: 'Remover',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () =>
        deleteContact.mutate(contact.id, {
          onSuccess: () => message.success('Contato removido.'),
          onError: () => message.error('Não foi possível remover o contato.'),
        }),
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;

    if (target < 0 || target >= contacts.length) {
      return;
    }

    const reordered = [...contacts];
    const [moved] = reordered.splice(index, 1);

    if (!moved) {
      return;
    }

    reordered.splice(target, 0, moved);

    reorderContacts.mutate(
      reordered.map((contact) => contact.id),
      { onError: () => message.error('Não foi possível reordenar os contatos.') },
    );
  };

  return (
    <>
      <PageHeading
        title="Contatos úteis"
        description="Telefones e links exibidos na página pública do condomínio (portaria, síndico, administradora e outros)."
        actions={
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Novo contato
          </Button>
        }
      />

      {contactsQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

      {!contactsQuery.isLoading && contacts.length === 0 ? (
        <S.Row>
          <S.Info>Nenhum contato cadastrado ainda.</S.Info>
        </S.Row>
      ) : null}

      <S.List>
        {contacts.map((contact, index) => (
          <S.Row key={contact.id}>
            <S.OrderButtons>
              <Button
                type="text"
                size="small"
                icon={<ArrowUp size={14} />}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label="Mover para cima"
              />
              <Button
                type="text"
                size="small"
                icon={<ArrowDown size={14} />}
                disabled={index === contacts.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Mover para baixo"
              />
            </S.OrderButtons>

            <S.Info>
              <S.Label>
                {contact.label} · {CONTACT_CATEGORY_LABELS[contact.category]}
              </S.Label>
              <S.Detail>
                {contact.phone ? <Phone size={12} style={{ verticalAlign: 'middle' }} /> : null}{' '}
                {contact.phone ? maskPhone(contact.phone) : contact.url ?? 'Sem telefone ou link'}
              </S.Detail>
            </S.Info>

            <S.Actions>
              <Button
                type="text"
                size="small"
                icon={<Pencil size={15} />}
                onClick={() => openEdit(contact)}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={15} />}
                onClick={() => handleDelete(contact)}
              />
            </S.Actions>
          </S.Row>
        ))}
      </S.List>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar contato' : 'Novo contato'}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={createContact.isPending || updateContact.isPending}
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item name="label" label="Nome do contato" rules={[rules.required(), rules.text(2, 150)]}>
            <Input placeholder="Portaria, Síndico, Administradora..." />
          </Form.Item>

          <Form.Item name="category" label="Categoria" rules={[rules.required()]}>
            <Select options={CATEGORY_OPTIONS} placeholder="Selecione" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone (opcional)"
            normalize={maskPhone}
            rules={[rules.phone()]}
          >
            <PhoneInput />
          </Form.Item>

          <Form.Item name="url" label="Link (opcional)">
            <Input placeholder="https://wa.me/5511988887777" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
