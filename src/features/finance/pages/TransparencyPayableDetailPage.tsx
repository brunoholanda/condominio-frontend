import { Button, List, Result, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import { Download, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { ATTACHMENT_TYPE_LABELS } from '../model/finance.types';
import {
  useDownloadTransparencyAttachmentMutation,
  useTransparencyPayableQuery,
} from '../hooks/use-finance';
import * as S from './TransparencyPortalPage.styles';

const DATE_FORMAT = 'DD/MM/YYYY';

/** Detalhe público de uma conta paga, com download dos anexos. */
export function TransparencyPayableDetailPage() {
  const { slug, payableId } = useParams<{ slug: string; payableId: string }>();
  const condominiumQuery = usePublicCondominiumQuery(slug);
  const payableQuery = useTransparencyPayableQuery(slug, payableId);
  const downloadAttachment = useDownloadTransparencyAttachmentMutation(slug ?? '');

  if (condominiumQuery.isError || payableQuery.isError) {
    return (
      <Result
        status="404"
        title="Conta não encontrada"
        subTitle="Esta conta não está disponível no portal da transparência."
        extra={
          <Link to={`/c/${slug}/transparencia`}>Voltar ao portal</Link>
        }
      />
    );
  }

  const payable = payableQuery.data;

  return (
    <>
      <PageHeading
        title={payable?.description ?? 'Conta paga'}
        description={
          condominiumQuery.data
            ? `Detalhe no portal da transparência do ${condominiumQuery.data.name}.`
            : 'Detalhe no portal da transparência.'
        }
        actions={
          <Link to={`/c/${slug}/transparencia`}>Voltar à lista</Link>
        }
      />

      {payableQuery.isLoading || !payable ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <S.DetailCard>
          <S.Row>
            <Tag>{payable.category}</Tag>
            <S.Amount>{formatCentsToBRL(payable.amountCents)}</S.Amount>
          </S.Row>

          <S.DetailGrid>
            <div>
              <S.Label>Fornecedor</S.Label>
              <div>{payable.vendor}</div>
            </div>
            <div>
              <S.Label>Vencimento</S.Label>
              <div>{dayjs(payable.dueDate).format(DATE_FORMAT)}</div>
            </div>
            <div>
              <S.Label>Pago em</S.Label>
              <div>
                {payable.paidAt ? dayjs(payable.paidAt).format(DATE_FORMAT) : '—'}
              </div>
            </div>
          </S.DetailGrid>

          {payable.notes ? (
            <div>
              <S.Label>Observações</S.Label>
              <S.Notes>{payable.notes}</S.Notes>
            </div>
          ) : null}

          <div>
            <S.Label>Documentos anexados</S.Label>
            {payable.attachments.length === 0 ? (
              <S.Empty>Nenhum documento anexado a este pagamento.</S.Empty>
            ) : (
              <S.AttachmentList>
                <List
                  dataSource={payable.attachments}
                  renderItem={(attachment) => (
                    <List.Item
                      actions={[
                        <Button
                          key="download"
                          type="link"
                          icon={<Download size={16} />}
                          loading={downloadAttachment.isPending}
                          onClick={() =>
                            downloadAttachment.mutate({
                              payableId: payable.id,
                              attachmentId: attachment.id,
                            })
                          }
                        >
                          Abrir
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileText size={20} />}
                        title={attachment.fileName}
                        description={`${ATTACHMENT_TYPE_LABELS[attachment.type]} · ${(attachment.sizeBytes / 1024).toFixed(0)} KB`}
                      />
                    </List.Item>
                  )}
                />
              </S.AttachmentList>
            )}
          </div>
        </S.DetailCard>
      )}
    </>
  );
}
