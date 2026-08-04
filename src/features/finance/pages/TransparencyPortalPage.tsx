import { Result, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { useTransparencyPayablesQuery } from '../hooks/use-finance';
import * as S from './TransparencyPortalPage.styles';

const DATE_FORMAT = 'DD/MM/YYYY';

/** Portal público das contas pagas do condomínio. */
export function TransparencyPortalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const condominiumQuery = usePublicCondominiumQuery(slug);
  const payablesQuery = useTransparencyPayablesQuery(slug, page);

  if (condominiumQuery.isError) {
    return (
      <Result
        status="404"
        title="Condomínio não encontrado"
        subTitle="Verifique o endereço acessado."
      />
    );
  }

  const items = payablesQuery.data?.items ?? [];
  const totalPages = payablesQuery.data?.totalPages ?? 1;

  return (
    <>
      <PageHeading
        title="Portal da transparência"
        description={
          condominiumQuery.data
            ? `Contas pagas pelo ${condominiumQuery.data.name}, com documentos anexados.`
            : 'Contas pagas pelo condomínio, com documentos anexados.'
        }
      />

      {payablesQuery.isLoading ? <Skeleton active paragraph={{ rows: 5 }} /> : null}

      {!payablesQuery.isLoading && items.length === 0 ? (
        <S.Empty>Nenhuma conta paga publicada até o momento.</S.Empty>
      ) : null}

      <S.List>
        {items.map((payable) => (
          <S.Card key={payable.id} to={`/c/${slug}/transparencia/${payable.id}`}>
            <S.Row>
              <Tag>{payable.category}</Tag>
              <S.Amount>{formatCentsToBRL(payable.amountCents)}</S.Amount>
            </S.Row>
            <S.Title>{payable.description}</S.Title>
            <S.Meta>
              {payable.vendor}
              {payable.paidAt
                ? ` · Pago em ${dayjs(payable.paidAt).format(DATE_FORMAT)}`
                : ` · Vencimento ${dayjs(payable.dueDate).format(DATE_FORMAT)}`}
            </S.Meta>
            {payable.attachmentCount > 0 ? (
              <S.AttachmentsHint>
                <FileText size={14} aria-hidden />
                {payable.attachmentCount} documento(s) anexo(s)
              </S.AttachmentsHint>
            ) : null}
          </S.Card>
        ))}
      </S.List>

      {totalPages > 1 ? (
        <S.Pagination>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            Próxima
          </button>
        </S.Pagination>
      ) : null}
    </>
  );
}
