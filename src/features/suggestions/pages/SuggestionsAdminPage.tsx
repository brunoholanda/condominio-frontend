import { App, Button, Select, Skeleton, Tag } from 'antd';
import { useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { queries } from '@/styles/theme';
import {
  useMarkSuggestionReadMutation,
  useSuggestionsQuery,
} from '../hooks/use-suggestions';
import type { SuggestionStatus } from '../model/suggestion.types';
import { SUGGESTION_STATUS_LABELS } from '../model/suggestion.types';
import * as S from './SuggestionsPage.styles';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Lista de sugestões recebidas via página pública (unidade + CPF). */
export function SuggestionsAdminPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [status, setStatus] = useState<SuggestionStatus | undefined>();

  const suggestionsQuery = useSuggestionsQuery(condominium.id, status);
  const markRead = useMarkSuggestionReadMutation(condominium.id);

  const handleMarkRead = (id: string) => {
    markRead.mutate(id, {
      onSuccess: () => message.success('Sugestão marcada como lida.'),
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível atualizar a sugestão.',
        ),
    });
  };

  return (
    <>
      <PageHeading
        title="Sugestões"
        description="Mensagens enviadas pelos moradores na página pública, com compromisso de respeito e transparência."
      />

      <Select
        allowClear
        placeholder="Filtrar por status"
        style={{ width: isMobile ? '100%' : 200, marginBottom: 16 }}
        value={status}
        onChange={(value) => setStatus(value)}
        options={[
          { value: 'NEW', label: SUGGESTION_STATUS_LABELS.NEW },
          { value: 'READ', label: SUGGESTION_STATUS_LABELS.READ },
        ]}
      />

      {suggestionsQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : null}

      {suggestionsQuery.isError ? (
        <S.Empty>Não foi possível carregar as sugestões.</S.Empty>
      ) : null}

      {!suggestionsQuery.isLoading && !suggestionsQuery.isError ? (
        (suggestionsQuery.data?.length ?? 0) === 0 ? (
          <S.Empty>Nenhuma sugestão por enquanto.</S.Empty>
        ) : (
          <S.List>
            {suggestionsQuery.data?.map((item) => (
              <S.Row key={item.id}>
                <S.Meta>
                  <Tag color={item.status === 'NEW' ? 'blue' : 'default'}>
                    {SUGGESTION_STATUS_LABELS[item.status]}
                  </Tag>
                  <span>Unidade {item.unitNumber}</span>
                  <span>{item.authorName}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </S.Meta>
                <S.Body>{item.body}</S.Body>
                {item.status === 'NEW' ? (
                  <Button
                    type="link"
                    style={{ paddingLeft: 0, marginTop: 8 }}
                    loading={markRead.isPending}
                    onClick={() => handleMarkRead(item.id)}
                  >
                    Marcar como lida
                  </Button>
                ) : null}
              </S.Row>
            ))}
          </S.List>
        )
      ) : null}
    </>
  );
}
