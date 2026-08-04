import { Button, Result, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { usePublicDocumentQuery } from '../hooks/use-documents';
import { DOCUMENT_TYPE_LABELS } from '../model/document.types';
import * as S from './PublicDocumentsPage.styles';

const DATE_FORMAT = 'DD/MM/YYYY [às] HH:mm';

/** Leitura pública de um documento, acessível em `/c/:slug/documentos/:id`. */
export function PublicDocumentDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const documentQuery = usePublicDocumentQuery(slug, id);

  if (documentQuery.isError) {
    return (
      <Result
        status="404"
        title="Documento não encontrado"
        subTitle="Ele pode ter sido removido ou tornado privado."
        extra={
          <Link to={`/c/${slug}/documentos`}>
            <Button type="primary">Ver todos os documentos</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeading
        title="Documento"
        actions={
          <Link to={`/c/${slug}/documentos`}>
            <Button icon={<ArrowLeft size={16} />}>Voltar</Button>
          </Link>
        }
      />

      {documentQuery.isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : null}

      {documentQuery.data ? (
        <S.DetailCard>
          <Tag style={{ width: 'fit-content' }}>{DOCUMENT_TYPE_LABELS[documentQuery.data.type]}</Tag>
          <h2 style={{ marginTop: 12 }}>{documentQuery.data.title}</h2>
          <S.Meta>
            Publicado em{' '}
            {dayjs(documentQuery.data.publishedAt ?? documentQuery.data.createdAt).format(
              DATE_FORMAT,
            )}
          </S.Meta>
          <S.DetailBody>{documentQuery.data.body}</S.DetailBody>
        </S.DetailCard>
      ) : null}
    </>
  );
}
