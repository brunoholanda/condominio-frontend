import { App, Button, Drawer, Form, Input, Popconfirm, Select, Skeleton, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useDocumentsQuery,
  useUpdateDocumentMutation,
} from '../hooks/use-documents';
import type { CondoDocument, DocumentPayload, DocumentType } from '../model/document.types';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '../model/document.types';
import * as S from './DocumentsAdminPage.styles';

const TYPE_OPTIONS = DOCUMENT_TYPES.map((value) => ({ value, label: DOCUMENT_TYPE_LABELS[value] }));

interface DocumentFormValues {
  type: DocumentType;
  title: string;
  body: string;
  isPublic: boolean;
}

export function DocumentsAdminPage() {
  const condominium = useManagerCondominium();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [form] = Form.useForm<DocumentFormValues>();
  const [editing, setEditing] = useState<CondoDocument | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const documentsQuery = useDocumentsQuery(condominium.id);
  const createDocument = useCreateDocumentMutation(condominium.id);
  const updateDocument = useUpdateDocumentMutation(condominium.id);
  const deleteDocument = useDeleteDocumentMutation(condominium.id);

  const documents = documentsQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ isPublic: true });
    setDrawerOpen(true);
  };

  const openEdit = (document: CondoDocument) => {
    setEditing(document);
    form.setFieldsValue({
      type: document.type,
      title: document.title,
      body: document.body,
      isPublic: document.isPublic,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = (values: DocumentFormValues) => {
    const payload: DocumentPayload = {
      type: values.type,
      title: values.title.trim(),
      body: values.body.trim(),
      isPublic: values.isPublic,
    };

    const onSuccess = () => {
      message.success(editing ? 'Documento atualizado.' : 'Documento publicado.');
      setDrawerOpen(false);
    };
    const onError = (error: unknown) =>
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível salvar o documento.',
      );

    if (editing) {
      updateDocument.mutate({ id: editing.id, payload }, { onSuccess, onError });
    } else {
      createDocument.mutate(payload, { onSuccess, onError });
    }
  };

  const handleDelete = (document: CondoDocument) => {
    modal.confirm({
      title: `Remover "${document.title}"?`,
      okText: 'Remover',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () =>
        deleteDocument.mutate(document.id, {
          onSuccess: () => message.success('Documento removido.'),
          onError: () => message.error('Não foi possível remover o documento.'),
        }),
    });
  };

  const columns: ColumnsType<CondoDocument> = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: 200,
      render: (type: DocumentType) => <Tag>{DOCUMENT_TYPE_LABELS[type]}</Tag>,
    },
    { title: 'Título', dataIndex: 'title', ellipsis: true },
    {
      title: 'Visibilidade',
      dataIndex: 'isPublic',
      width: 130,
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? 'green' : 'default'}>{isPublic ? 'Público' : 'Interno'}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 110,
      align: 'right',
      render: (_value, document) => (
        <>
          <Button
            type="text"
            size="small"
            icon={<Pencil size={15} />}
            onClick={() => openEdit(document)}
          />
          <Popconfirm
            title="Remover documento"
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(document)}
          >
            <Button type="text" size="small" danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Documentos"
        description="Avisos, atas e convocações de assembleia. Documentos públicos aparecem na página do condomínio."
        actions={
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Novo documento
          </Button>
        }
      />

      {documentsQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : isMobile ? (
        documents.length === 0 ? (
          <S.CardEmpty>Nenhum documento cadastrado.</S.CardEmpty>
        ) : (
          <S.CardList>
            {documents.map((document) => (
              <S.ItemCard key={document.id}>
                <S.CardTop>
                  <S.CardTitle>{document.title}</S.CardTitle>
                  <Tag color={document.isPublic ? 'green' : 'default'}>
                    {document.isPublic ? 'Público' : 'Interno'}
                  </Tag>
                </S.CardTop>
                <S.CardTags>
                  <Tag>{DOCUMENT_TYPE_LABELS[document.type]}</Tag>
                </S.CardTags>
                <S.CardActions>
                  <Button icon={<Pencil size={16} />} onClick={() => openEdit(document)}>
                    Editar
                  </Button>
                  <Button danger icon={<Trash2 size={16} />} onClick={() => handleDelete(document)}>
                    Remover
                  </Button>
                </S.CardActions>
              </S.ItemCard>
            ))}
          </S.CardList>
        )
      ) : (
        <Table<CondoDocument>
          rowKey="id"
          columns={columns}
          dataSource={documents}
          {...mobileTableProps(false)}
          pagination={false}
        />
      )}

      <Drawer
        open={drawerOpen}
        title={editing ? 'Editar documento' : 'Novo documento'}
        width={mobileOverlayWidth(isMobile, 560)}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Button
            type="primary"
            icon={<FileText size={16} />}
            loading={createDocument.isPending || updateDocument.isPending}
            onClick={() => form.submit()}
          >
            Salvar
          </Button>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item name="type" label="Tipo" rules={[rules.required()]}>
            <Select options={TYPE_OPTIONS} placeholder="Selecione" />
          </Form.Item>

          <Form.Item name="title" label="Título" rules={[rules.required(), rules.text(3, 200)]}>
            <Input placeholder="Ex.: Ata da assembleia de julho" />
          </Form.Item>

          <Form.Item name="body" label="Conteúdo" rules={[rules.required(), rules.text(1, 20000)]}>
            <Input.TextArea rows={12} placeholder="Texto completo do documento" />
          </Form.Item>

          <Form.Item
            name="isPublic"
            label="Visível na página pública do condomínio"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
