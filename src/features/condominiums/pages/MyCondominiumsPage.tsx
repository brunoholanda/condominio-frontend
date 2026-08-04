import { App, Button, Dropdown, Input, Skeleton } from 'antd';
import { ChevronRight, LifeBuoy, Plus, Search, Shield, Ticket, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { findPlan } from '@/features/marketing/model/plans';
import { PlanUpgradeModal } from '@/shared/components/PlanUpgradeModal/PlanUpgradeModal';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { queries } from '@/styles/theme';
import { useMyCondominiumsQuery } from '../hooks/use-condominiums';
import { MEMBERSHIP_ROLE_LABELS } from '../model/condominium.types';
import * as S from './MyCondominiumsPage.styles';

function condoInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'C';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function firstName(fullName: string | undefined): string {
  const part = fullName?.trim().split(/\s+/)[0];
  return part || 'olá';
}

/** Lista os condomínios do usuário e dá entrada para criar um novo. */
export function MyCondominiumsPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { session } = useAuth();
  const isMobile = useMediaQuery(queries.downMd);
  const condominiumsQuery = useMyCondominiumsQuery();
  const condominiums = condominiumsQuery.data ?? [];
  const isSystemOwner = Boolean(session?.user.isSystemOwner);
  const plan = session?.user.plan ?? 'lite';
  const planName = findPlan(plan)?.name ?? 'Lite';
  const [query, setQuery] = useState('');
  const ownedCount = useMemo(
    () => condominiums.filter((condo) => condo.myRole === 'OWNER').length,
    [condominiums],
  );
  const hitCondoLimit =
    !isSystemOwner && (plan === 'lite' || plan === 'prime') && ownedCount >= 1;
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return condominiums;
    return condominiums.filter(
      (condo) =>
        condo.name.toLowerCase().includes(q) ||
        condo.slug.toLowerCase().includes(q) ||
        (condo.address?.toLowerCase().includes(q) ?? false),
    );
  }, [condominiums, query]);

  const goNewCondo = () => {
    if (hitCondoLimit) {
      setUpgradeOpen(true);
      return;
    }

    void navigate('/app/condominios/novo');
  };

  const adminMenu = {
    items: [
      {
        key: 'chamados',
        icon: <Ticket size={16} />,
        label: 'Chamados da plataforma',
        onClick: () => void navigate('/app/admin/chamados'),
      },
      {
        key: 'contas',
        icon: <Shield size={16} />,
        label: 'Contas / assinaturas',
        onClick: () => void navigate('/app/admin/contas'),
      },
    ],
  };

  const copyPublicHint = async (slug: string) => {
    const path = `/c/${slug}`;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      message.success('Link público copiado.');
    } catch {
      message.info(`Hub público: ${path}`);
    }
  };

  return (
    <S.Page>
      <S.Content>
        <S.Hero>
          <S.HeroCopy>
            <S.BrandMark>CondoGest</S.BrandMark>
            <S.Greeting>
              {isSystemOwner
                ? 'Condomínios da plataforma'
                : `Olá, ${firstName(session?.user.name)}`}
            </S.Greeting>
            <S.Lead>
              {isSystemOwner
                ? 'Acesso completo a todos os condomínios. Escolha um para gerenciar.'
                : 'Selecione um condomínio para continuar a gestão.'}
            </S.Lead>
            {!isSystemOwner ? (
              <S.PlanChip>
                Plano <strong>{planName}</strong>
                {hitCondoLimit ? ' · limite de 1 condomínio' : null}
              </S.PlanChip>
            ) : null}
          </S.HeroCopy>

          <S.HeroAside>
            <S.PrimaryCta>
              <Button type="primary" size="large" icon={<Plus size={18} />} onClick={goNewCondo}>
                Novo condomínio
              </Button>
            </S.PrimaryCta>
            <S.QuietLinks aria-label="Atalhos da conta">
              <S.QuietLink type="button" onClick={() => void navigate('/app/conta')}>
                <UserRound size={15} aria-hidden />
                Conta
              </S.QuietLink>
              <S.QuietLink type="button" onClick={() => void navigate('/app/suporte')}>
                <LifeBuoy size={15} aria-hidden />
                Suporte
              </S.QuietLink>
              {isSystemOwner ? (
                isMobile ? (
                  <Dropdown menu={adminMenu} trigger={['click']}>
                    <S.QuietLink type="button">
                      <Shield size={15} aria-hidden />
                      Admin
                    </S.QuietLink>
                  </Dropdown>
                ) : (
                  <>
                    <S.QuietLink
                      type="button"
                      onClick={() => void navigate('/app/admin/chamados')}
                    >
                      <Ticket size={15} aria-hidden />
                      Chamados
                    </S.QuietLink>
                    <S.QuietLink type="button" onClick={() => void navigate('/app/admin/contas')}>
                      <Shield size={15} aria-hidden />
                      Contas
                    </S.QuietLink>
                  </>
                )
              ) : null}
            </S.QuietLinks>
          </S.HeroAside>
        </S.Hero>

        {condominiumsQuery.isLoading ? (
          <S.SkeletonStack>
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </S.SkeletonStack>
        ) : null}

        {!condominiumsQuery.isLoading && condominiums.length === 0 ? (
          <S.Empty>
            <S.EmptyCopy>
              <S.EmptyTitle>Cadastre o primeiro condomínio</S.EmptyTitle>
              <S.EmptyText>
                Em poucos passos você define o prédio, as unidades e a localização — depois convida
                a equipe e compartilha o hub com os moradores.
              </S.EmptyText>
              <Button type="primary" size="large" icon={<Plus size={18} />} onClick={goNewCondo}>
                Começar cadastro
              </Button>
            </S.EmptyCopy>
            <S.EmptySteps>
              <S.EmptyStep>
                <S.StepIndex>1</S.StepIndex>
                <S.StepCopy>
                  <S.StepTitle>Identidade</S.StepTitle>
                  <S.StepText>Nome, link público e data de entrega.</S.StepText>
                </S.StepCopy>
              </S.EmptyStep>
              <S.EmptyStep>
                <S.StepIndex>2</S.StepIndex>
                <S.StepCopy>
                  <S.StepTitle>Unidades</S.StepTitle>
                  <S.StepText>Catálogo de apartamentos ou casas.</S.StepText>
                </S.StepCopy>
              </S.EmptyStep>
              <S.EmptyStep>
                <S.StepIndex>3</S.StepIndex>
                <S.StepCopy>
                  <S.StepTitle>Localização</S.StepTitle>
                  <S.StepText>Endereço e raio do ponto eletrônico.</S.StepText>
                </S.StepCopy>
              </S.EmptyStep>
            </S.EmptySteps>
          </S.Empty>
        ) : null}

        {condominiums.length > 0 ? (
          <S.Section>
            <S.Toolbar>
              <div>
                <S.SectionTitle>
                  {isSystemOwner ? 'Todos os condomínios' : 'Seus condomínios'}
                </S.SectionTitle>
                <S.SectionMeta>
                  {filtered.length === condominiums.length
                    ? `${condominiums.length} ${condominiums.length === 1 ? 'condomínio' : 'condomínios'}`
                    : `${filtered.length} de ${condominiums.length}`}
                </S.SectionMeta>
              </div>
              {condominiums.length >= 4 ? (
                <S.SearchWrap>
                  <Input
                    allowClear
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nome ou slug"
                    prefix={<Search size={15} aria-hidden />}
                    aria-label="Buscar condomínios"
                  />
                </S.SearchWrap>
              ) : null}
            </S.Toolbar>

            {filtered.length === 0 ? (
              <S.NoResults>Nenhum condomínio encontrado para “{query.trim()}”.</S.NoResults>
            ) : (
              <S.List>
                {filtered.map((condominium, index) => (
                  <S.CondoLink
                    key={condominium.id}
                    to={`/app/condominios/${condominium.id}`}
                    $delay={40 + index * 40}
                  >
                    <S.CondoTop>
                      <S.Monogram aria-hidden>{condoInitials(condominium.name)}</S.Monogram>
                      <S.RoleBadge>
                        {isSystemOwner
                          ? 'Sistema'
                          : condominium.myRole
                            ? MEMBERSHIP_ROLE_LABELS[condominium.myRole]
                            : 'Membro'}
                      </S.RoleBadge>
                    </S.CondoTop>
                    <S.CondoBody>
                      <S.CondoName>{condominium.name}</S.CondoName>
                      <S.CondoMeta>
                        <span>/c/{condominium.slug}</span>
                        <S.MetaDot aria-hidden />
                        <span>
                          {condominium.unitNumbers.length}{' '}
                          {condominium.unitNumbers.length === 1 ? 'unidade' : 'unidades'}
                        </span>
                      </S.CondoMeta>
                      {condominium.address ? (
                        <S.CondoAddress title={condominium.address}>
                          {condominium.address}
                        </S.CondoAddress>
                      ) : null}
                    </S.CondoBody>
                    <S.CondoFooter>
                      <S.EnterHint>
                        Abrir
                        <ChevronRight size={16} aria-hidden />
                      </S.EnterHint>
                    </S.CondoFooter>
                  </S.CondoLink>
                ))}

                <S.AddCondo
                  type="button"
                  onClick={goNewCondo}
                  $delay={40 + filtered.length * 40}
                >
                  <Plus size={22} aria-hidden />
                  {hitCondoLimit
                    ? 'Novo condomínio — plano Gestor'
                    : 'Cadastrar outro condomínio'}
                </S.AddCondo>
              </S.List>
            )}

            <S.Footnote>
              Hub público em <code>/c/slug</code>
              {condominiums[0] ? (
                <>
                  . Ex.:{' '}
                  <Link
                    to={`/c/${condominiums[0].slug}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey) return;
                      event.preventDefault();
                      void copyPublicHint(condominiums[0].slug);
                    }}
                  >
                    /c/{condominiums[0].slug}
                  </Link>{' '}
                  (clique para copiar)
                </>
              ) : null}
              .
            </S.Footnote>
          </S.Section>
        ) : null}
      </S.Content>

      <PlanUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        title="Limite do seu plano"
        description="Os planos Lite e Prime permitem gerenciar apenas 1 condomínio. Para cadastrar vários prédios, faça upgrade para o plano Gestor."
        upgradePlanId="gestor"
      />
    </S.Page>
  );
}
