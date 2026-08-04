import { Result, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { usePublicDocumentsQuery } from '../hooks/use-documents';
import { DOCUMENT_TYPE_LABELS } from '../model/document.types';
import * as S from './PublicDocumentsPage.styles';

const DATE_FORMAT = 'DD/MM/YYYY';

/** Lista pública de documentos, acessível em `/c/:slug/documentos`. */
export function PublicDocumentsPage() {
  const { slug } = useParams<{ slug: string }>();
  const condominiumQuery = usePublicCondominiumQuery(slug);
  const documentsQuery = usePublicDocumentsQuery(slug);

  if (condominiumQuery.isError) {
    return (
      <Result status="404" title="Condomínio não encontrado" subTitle="Verifique o endereço acessado." />
    );
  }

  const documents = documentsQuery.data ?? [];

  return (
    <>
      <PageHeading
        title="Documentos"
        description={
          condominiumQuery.data
            ? `Avisos, atas e convocações do ${condominiumQuery.data.name}.`
            : 'Avisos, atas e convocações do condomínio.'
        }
      />

      {documentsQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

      {!documentsQuery.isLoading && documents.length === 0 ? (
        <S.Empty>Nenhum documento publicado até o momento.</S.Empty>
      ) : null}

      <S.List>
        {documents.map((document) => (
          <S.Card key={document.id} to={`/c/${slug}/documentos/${document.id}`}>
            <Tag style={{ width: 'fit-content' }}>{DOCUMENT_TYPE_LABELS[document.type]}</Tag>
            <S.Title>{document.title}</S.Title>
            <S.Meta>
              Publicado em{' '}
              {dayjs(document.publishedAt ?? document.createdAt).format(DATE_FORMAT)}
            </S.Meta>
          </S.Card>
        ))}
      </S.List>
    </>
  );
}
