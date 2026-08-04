import { App, Button, Form, Input, Select, Skeleton, Tag } from 'antd';
import { Bug, LifeBuoy, Lightbulb, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useMyCondominiumsQuery } from '@/features/condominiums/hooks/use-condominiums';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { rules } from '@/shared/utils/form-rules';
import { useCreateTicketMutation, useMyTicketsQuery } from '../hooks/use-support';
import type { CreateTicketPayload, TicketCategory, TicketStatus } from '../model/support.types';
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  TICKET_STATUSES,
} from '../model/support.types';
import * as S from './SupportPages.styles';

interface TicketFormValues {
  category: TicketCategory;
  subject: string;
  body: string;
  condominiumId?: string;
}

interface SupportLocationState {
  prefSubject?: string;
  prefCategory?: TicketCategory;
}

const CATEGORY_HELP: Record<TicketCategory, string> = {
  PROBLEM: 'Algo não funcionou como esperado.',
  IMPROVEMENT: 'Ideia para tornar a plataforma melhor.',
};

interface CategoryPickerProps {
  value?: TicketCategory;
  onChange?: (value: TicketCategory) => void;
}

function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <S.CategoryGrid>
      {TICKET_CATEGORIES.map((option) => (
        <S.CategoryOption
          key={option}
          type="button"
          $active={value === option}
          onClick={() => onChange?.(option)}
        >
          {option === 'PROBLEM' ? (
            <Bug size={18} color="#0f2740" aria-hidden />
          ) : (
            <Lightbulb size={18} color="#0f2740" aria-hidden />
          )}
          <strong>{TICKET_CATEGORY_LABELS[option]}</strong>
          <span>{CATEGORY_HELP[option]}</span>
        </S.CategoryOption>
      ))}
    </S.CategoryGrid>
  );
}

/** Área do usuário: abrir chamado e acompanhar os próprios tickets. */
export function MySupportTicketsPage() {
  const { message } = App.useApp();
  const location = useLocation();
  const [form] = Form.useForm<TicketFormValues>();
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | undefined>();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const ticketsQuery = useMyTicketsQuery();
  const createTicket = useCreateTicketMutation();
  const condominiumsQuery = useMyCondominiumsQuery();
  const condominiums = condominiumsQuery.data ?? [];

  useEffect(() => {
    const state = (location.state ?? {}) as SupportLocationState;

    if (!state.prefSubject && !state.prefCategory) {
      return;
    }

    setFormOpen(true);
    form.setFieldsValue({
      category: state.prefCategory ?? 'IMPROVEMENT',
      subject: state.prefSubject ?? '',
    });
  }, [form, location.state]);

  const filteredTickets = useMemo(() => {
    const items = ticketsQuery.data ?? [];

    if (!statusFilter) {
      return items;
    }

    return items.filter((ticket) => ticket.status === statusFilter);
  }, [statusFilter, ticketsQuery.data]);

  const openCount =
    ticketsQuery.data?.filter((ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS')
      .length ?? 0;

  const handleSubmit = (values: TicketFormValues) => {
    const payload: CreateTicketPayload = {
      category: values.category,
      subject: values.subject.trim(),
      body: values.body.trim(),
      ...(values.condominiumId ? { condominiumId: values.condominiumId } : {}),
    };

    createTicket.mutate(payload, {
      onSuccess: () => {
        message.success('Chamado aberto. Nossa equipe foi avisada por e-mail.');
        form.resetFields();
        form.setFieldsValue({ category: 'PROBLEM' });
        setFormOpen(false);
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível abrir o chamado.',
        ),
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <S.Page>
      <PageHeading
        title="Suporte"
        description="Reporte problemas ou envie ideias. Acompanhe o status dos seus chamados aqui."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setFormOpen((open) => !open)}
          >
            {formOpen ? 'Fechar formulário' : 'Novo chamado'}
          </Button>
        }
      />

      <S.Intro>
        <S.IntroIcon aria-hidden>
          <LifeBuoy size={22} />
        </S.IntroIcon>
        <S.IntroText>
          <S.IntroTitle>
            {openCount > 0
              ? `${openCount} chamado(s) em andamento`
              : 'Estamos prontos para ajudar'}
          </S.IntroTitle>
          <S.IntroDesc>
            Descreva o contexto com clareza. Quanto mais detalhe, mais rápido conseguimos responder.
          </S.IntroDesc>
        </S.IntroText>
      </S.Intro>

      {formOpen ? (
        <S.FormCard>
          <S.FormTitle>Novo chamado</S.FormTitle>
          <S.FormHint>Escolha o tipo e conte o que aconteceu ou o que você gostaria de ver.</S.FormHint>

          <Form<TicketFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            disabled={createTicket.isPending}
            initialValues={{ category: 'PROBLEM' }}
          >
            <Form.Item name="category" label="Tipo" rules={[rules.required()]}>
              <CategoryPicker />
            </Form.Item>

            <Form.Item name="subject" label="Assunto" rules={[rules.required(), rules.text(5, 200)]}>
              <Input size="large" placeholder="Resumo do que aconteceu ou da ideia" />
            </Form.Item>

            <Form.Item
              name="body"
              label="Descrição"
              rules={[rules.required(), rules.text(10, 5000)]}
            >
              <Input.TextArea
                rows={5}
                placeholder="Detalhe passos, telas ou o resultado esperado. Quanto mais contexto, mais rápido resolvemos."
              />
            </Form.Item>

            {condominiums.length > 0 ? (
              <Form.Item name="condominiumId" label="Condomínio relacionado (opcional)">
                <Select
                  allowClear
                  size="large"
                  placeholder="Nenhum em específico"
                  options={condominiums.map((condo) => ({
                    value: condo.id,
                    label: condo.name,
                  }))}
                />
              </Form.Item>
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<LifeBuoy size={16} />}
              loading={createTicket.isPending}
            >
              Enviar chamado
            </Button>
          </Form>
        </S.FormCard>
      ) : null}

      <S.Section>
        <S.SectionHead>
          <div>
            <S.SectionTitle>Seus chamados</S.SectionTitle>
            <S.SectionDesc>
              {ticketsQuery.isLoading
                ? 'Carregando…'
                : `${ticketsQuery.data?.length ?? 0} registro(s)`}
            </S.SectionDesc>
          </div>
        </S.SectionHead>

        {(ticketsQuery.data?.length ?? 0) > 0 ? (
          <S.FilterBar>
            <Select
              allowClear
              placeholder="Filtrar por status"
              style={{ width: 220 }}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={TICKET_STATUSES.map((item) => ({
                value: item,
                label: TICKET_STATUS_LABELS[item],
              }))}
            />
          </S.FilterBar>
        ) : null}

        {ticketsQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

        {!ticketsQuery.isLoading && (ticketsQuery.data?.length ?? 0) === 0 ? (
          <S.Empty>
            <p>Você ainda não abriu nenhum chamado. Use “Novo chamado” para falar com a equipe.</p>
            <Button type="primary" icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
              Abrir primeiro chamado
            </Button>
          </S.Empty>
        ) : null}

        {!ticketsQuery.isLoading &&
        (ticketsQuery.data?.length ?? 0) > 0 &&
        filteredTickets.length === 0 ? (
          <S.Empty>
            <p>Nenhum chamado com esse status.</p>
            <Button onClick={() => setStatusFilter(undefined)}>Limpar filtro</Button>
          </S.Empty>
        ) : null}

        <S.List>
          {filteredTickets.map((ticket) => {
            const expanded = expandedIds.has(ticket.id);
            const longBody = ticket.body.length > 180;

            return (
              <S.Row key={ticket.id}>
                <S.Meta>
                  <Tag color={TICKET_STATUS_COLORS[ticket.status]}>
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </Tag>
                  <Tag>{TICKET_CATEGORY_LABELS[ticket.category]}</Tag>
                  <span>
                    {new Date(ticket.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </S.Meta>
                <S.Subject>{ticket.subject}</S.Subject>
                <S.Body>
                  {expanded || !longBody ? ticket.body : `${ticket.body.slice(0, 180).trim()}…`}
                </S.Body>
                {longBody ? (
                  <S.ToggleBody type="button" onClick={() => toggleExpanded(ticket.id)}>
                    {expanded ? 'Mostrar menos' : 'Ler completo'}
                  </S.ToggleBody>
                ) : null}
              </S.Row>
            );
          })}
        </S.List>
      </S.Section>
    </S.Page>
  );
}
