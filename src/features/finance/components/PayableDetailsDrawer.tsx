import { App, Button, Drawer, Empty, List, Select, Steps, Tag, Upload } from 'antd';
import dayjs from 'dayjs';
import { Ban, CheckCircle2, Download, Trash2, UploadCloud } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/shared/api/api-error';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useDeleteAttachmentMutation,
  useDownloadAttachmentMutation,
  useMarkPayableAsPaidMutation,
  useCancelPayableMutation,
  usePayableAttachmentsQuery,
  useUploadAttachmentMutation,
} from '../hooks/use-finance';
import type { AttachmentType, Payable } from '../model/finance.types';
import { ATTACHMENT_TYPES, ATTACHMENT_TYPE_LABELS, PAYABLE_STATUS_COLORS, PAYABLE_STATUS_LABELS } from '../model/finance.types';

const DATE_FORMAT = 'DD/MM/YYYY';
const STAMP_FORMAT = 'DD/MM/YYYY [às] HH:mm';

const ATTACHMENT_TYPE_OPTIONS = ATTACHMENT_TYPES.map((value) => ({
  value,
  label: ATTACHMENT_TYPE_LABELS[value],
}));

function statusTimeline(payable: Payable) {
  const steps = [
    { title: 'Criada', description: dayjs(payable.createdAt).format(STAMP_FORMAT) },
  ];

  if (payable.status === 'PAID') {
    steps.push({
      title: 'Paga',
      description: payable.paidAt ? dayjs(payable.paidAt).format(STAMP_FORMAT) : '',
    });
  } else if (payable.status === 'CANCELLED') {
    steps.push({ title: 'Cancelada', description: dayjs(payable.updatedAt).format(STAMP_FORMAT) });
  } else {
    steps.push({ title: 'Vencimento', description: dayjs(payable.dueDate).format(DATE_FORMAT) });
  }

  return steps;
}

interface PayableDetailsDrawerProps {
  condominiumId: string;
  payable: Payable | null;
  open: boolean;
  onClose: () => void;
}

export function PayableDetailsDrawer({
  condominiumId,
  payable,
  open,
  onClose,
}: PayableDetailsDrawerProps) {
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [attachmentType, setAttachmentType] = useState<AttachmentType>('INVOICE');

  const attachmentsQuery = usePayableAttachmentsQuery(condominiumId, payable?.id);
  const markAsPaid = useMarkPayableAsPaidMutation(condominiumId);
  const cancelPayable = useCancelPayableMutation(condominiumId);
  const uploadAttachment = useUploadAttachmentMutation(condominiumId);
  const downloadAttachment = useDownloadAttachmentMutation(condominiumId);
  const deleteAttachment = useDeleteAttachmentMutation(condominiumId);

  if (!payable) {
    return null;
  }

  const handleMarkAsPaid = () => {
    modal.confirm({
      title: 'Marcar como paga?',
      content: `${payable.description} · ${formatCentsToBRL(payable.amountCents)}`,
      okText: 'Marcar como paga',
      cancelText: 'Cancelar',
      onOk: () =>
        markAsPaid.mutate(
          { id: payable.id },
          {
            onSuccess: () => message.success('Conta marcada como paga.'),
            onError: (error) =>
              message.error(error instanceof ApiError ? error.message : 'Não foi possível concluir.'),
          },
        ),
    });
  };

  const handleCancel = () => {
    modal.confirm({
      title: 'Cancelar esta conta?',
      okText: 'Cancelar conta',
      okButtonProps: { danger: true },
      cancelText: 'Voltar',
      onOk: () =>
        cancelPayable.mutate(
          { id: payable.id },
          {
            onSuccess: () => message.success('Conta cancelada.'),
            onError: (error) =>
              message.error(error instanceof ApiError ? error.message : 'Não foi possível cancelar.'),
          },
        ),
    });
  };

  return (
    <Drawer
      open={open}
      title={payable.description}
      placement={isMobile ? 'bottom' : 'right'}
      height={isMobile ? '90vh' : undefined}
      width={mobileOverlayWidth(isMobile, 480)}
      onClose={onClose}
    >
      <p>
        <strong>{formatCentsToBRL(payable.amountCents)}</strong> · {payable.vendor} ·{' '}
        {payable.category}
      </p>
      <p>
        <Tag color={PAYABLE_STATUS_COLORS[payable.status]}>
          {PAYABLE_STATUS_LABELS[payable.status]}
        </Tag>
        Vencimento: {dayjs(payable.dueDate).format(DATE_FORMAT)}
      </p>
      {payable.notes ? <p>{payable.notes}</p> : null}

      <Steps direction="vertical" size="small" current={1} items={statusTimeline(payable)} />

      {payable.status === 'PENDING' ? (
        <div style={{ display: 'flex', gap: 8, margin: '16px 0 24px' }}>
          <Button
            type="primary"
            icon={<CheckCircle2 size={16} />}
            loading={markAsPaid.isPending}
            onClick={handleMarkAsPaid}
          >
            Marcar como paga
          </Button>
          <Button danger icon={<Ban size={16} />} loading={cancelPayable.isPending} onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      ) : null}

      <h4>Anexos</h4>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Select
          value={attachmentType}
          options={ATTACHMENT_TYPE_OPTIONS}
          onChange={setAttachmentType}
          style={{ width: 160 }}
        />
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            uploadAttachment.mutate(
              { payableId: payable.id, file, type: attachmentType },
              {
                onSuccess: () => message.success('Anexo enviado.'),
                onError: (error) =>
                  message.error(
                    error instanceof ApiError ? error.message : 'Não foi possível enviar o anexo.',
                  ),
              },
            );

            return false;
          }}
        >
          <Button icon={<UploadCloud size={16} />} loading={uploadAttachment.isPending}>
            Enviar arquivo
          </Button>
        </Upload>
      </div>

      <List
        dataSource={attachmentsQuery.data ?? []}
        locale={{ emptyText: <Empty description="Nenhum anexo enviado" /> }}
        renderItem={(attachment) => (
          <List.Item
            actions={[
              <Button
                key="download"
                type="text"
                size="small"
                icon={<Download size={15} />}
                onClick={() =>
                  downloadAttachment.mutate({ payableId: payable.id, attachmentId: attachment.id })
                }
              />,
              <Button
                key="delete"
                type="text"
                size="small"
                danger
                icon={<Trash2 size={15} />}
                onClick={() =>
                  deleteAttachment.mutate(
                    { payableId: payable.id, attachmentId: attachment.id },
                    {
                      onSuccess: () => message.success('Anexo removido.'),
                      onError: () => message.error('Não foi possível remover o anexo.'),
                    },
                  )
                }
              />,
            ]}
          >
            <List.Item.Meta
              title={attachment.fileName}
              description={`${ATTACHMENT_TYPE_LABELS[attachment.type]} · ${(attachment.sizeBytes / 1024).toFixed(0)} KB`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
}
