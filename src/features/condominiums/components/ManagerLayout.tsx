import { Drawer, Result, Spin } from 'antd';
import {
  Banknote,
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock3,
  ExternalLink,
  FileText,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Phone,
  QrCode,
  UserCog,
  UserPlus,
  UserRound,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Children, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { queries } from '@/styles/theme';
import { useCondominiumQuery } from '../hooks/use-condominiums';
import type { Condominium } from '../model/condominium.types';
import * as S from './ManagerLayout.styles';

/** Lê o condomínio carregado pelo `ManagerLayout`, disponível para toda a árvore de rotas. */
export function useManagerCondominium(): Condominium {
  return useOutletContext<Condominium>();
}

/** Porta de entrada do condomínio: porteiro vai para encomendas; demais para moradores. */
export function CondoHomeRedirect() {
  const condominium = useManagerCondominium();

  return (
    <Navigate
      to={condominium.myRole === 'DOORMAN' ? 'entregas' : 'moradores'}
      replace
    />
  );
}

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  const items = Children.toArray(children).filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <S.NavGroup>
      <S.NavGroupLabel>{label}</S.NavGroupLabel>
      <S.NavGroupItems>{items}</S.NavGroupItems>
    </S.NavGroup>
  );
}

function CondoNav({
  condominium,
  onNavigate,
}: {
  condominium: Condominium;
  onNavigate?: () => void;
}) {
  const role = condominium.myRole;
  const canManage = role === 'OWNER' || role === 'MANAGER';
  const isOwner = role === 'OWNER';
  const canSeeResidents = role === 'OWNER' || role === 'MANAGER' || role === 'OPERATOR';
  const canSeeDeliveries = role === 'OWNER' || role === 'MANAGER' || role === 'DOORMAN';
  const canSeeVisitors =
    role === 'OWNER' || role === 'MANAGER' || role === 'OPERATOR' || role === 'DOORMAN';
  const canSeeWorkOrders = role === 'OWNER' || role === 'MANAGER' || role === 'OPERATOR';
  const canShareQr = canSeeResidents;

  const linkProps = onNavigate ? { onClick: () => onNavigate() } : {};
  const base = `/app/condominios/${condominium.id}`;

  return (
    <>
      <NavSection label="Cadastro">
        {canSeeResidents ? (
          <S.SidebarItem to={`${base}/moradores`} {...linkProps}>
            <Users size={16} aria-hidden />
            Moradores
          </S.SidebarItem>
        ) : null}
        {canManage ? (
          <S.SidebarItem to={`${base}/dados`} {...linkProps}>
            <Building2 size={16} aria-hidden />
            Dados do condomínio
          </S.SidebarItem>
        ) : null}
      </NavSection>

      <NavSection label="Portaria">
        {canSeeDeliveries ? (
          <S.SidebarItem to={`${base}/entregas`} {...linkProps}>
            <Package size={16} aria-hidden />
            Encomendas
          </S.SidebarItem>
        ) : null}
        {canSeeVisitors ? (
          <S.SidebarItem to={`${base}/visitantes`} {...linkProps}>
            <UserPlus size={16} aria-hidden />
            Visitantes
          </S.SidebarItem>
        ) : null}
      </NavSection>

      <NavSection label="Operação">
        {canManage ? (
          <S.SidebarItem to={`${base}/areas`} {...linkProps}>
            <CalendarCheck size={16} aria-hidden />
            Áreas comuns
          </S.SidebarItem>
        ) : null}
      </NavSection>

      <NavSection label="RH">
        {canManage ? (
          <>
            <S.SidebarItem to={`${base}/funcionarios`} {...linkProps}>
              <UserRound size={16} aria-hidden />
              Funcionários
            </S.SidebarItem>
            <S.SidebarItem to={`${base}/ponto`} {...linkProps}>
              <Clock3 size={16} aria-hidden />
              Ponto
            </S.SidebarItem>
            <S.SidebarItem to={`${base}/faltas`} {...linkProps}>
              <ClipboardList size={16} aria-hidden />
              Faltas
            </S.SidebarItem>
          </>
        ) : null}
      </NavSection>

      <NavSection label="Financeiro">
        {canManage ? (
          <>
            <S.SidebarItem to={`${base}/financeiro`} {...linkProps}>
              <Wallet size={16} aria-hidden />
              Contas a pagar
            </S.SidebarItem>
            <S.SidebarItem to={`${base}/cobrancas`} {...linkProps}>
              <Banknote size={16} aria-hidden />
              Cobranças
            </S.SidebarItem>
          </>
        ) : null}
      </NavSection>

      <NavSection label="Comunicação">
        {canManage ? (
          <>
            <S.SidebarItem to={`${base}/documentos`} {...linkProps}>
              <FileText size={16} aria-hidden />
              Documentos
            </S.SidebarItem>
            <S.SidebarItem to={`${base}/sugestoes`} {...linkProps}>
              <MessageSquareText size={16} aria-hidden />
              Sugestões
            </S.SidebarItem>
            <S.SidebarItem to={`${base}/contatos`} {...linkProps}>
              <Phone size={16} aria-hidden />
              Contatos
            </S.SidebarItem>
          </>
        ) : null}
        {canShareQr ? (
          <S.SidebarItem to={`${base}/qr-codes`} {...linkProps}>
            <QrCode size={16} aria-hidden />
            Página pública
          </S.SidebarItem>
        ) : null}
        <S.SidebarLink
          href={`/c/${condominium.slug}`}
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
        >
          <ExternalLink size={16} aria-hidden />
          Ver página pública
        </S.SidebarLink>
      </NavSection>

      <NavSection label="Administração">
        {isOwner ? (
          <S.SidebarItem to={`${base}/equipe`} {...linkProps}>
            <UserCog size={16} aria-hidden />
            Equipe
          </S.SidebarItem>
        ) : null}
        {canSeeWorkOrders ? (
          <S.SidebarItem to={`${base}/chamados`} {...linkProps}>
            <Wrench size={16} aria-hidden />
            Chamados
          </S.SidebarItem>
        ) : null}
      </NavSection>
    </>
  );
}

/** Casca da área de gestão de um condomínio: topo + menu lateral + conteúdo. */
export function ManagerLayout() {
  const { condominiumId } = useParams<{ condominiumId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, logout } = useAuth();
  const condominiumQuery = useCondominiumQuery(condominiumId);
  const isMobile = useMediaQuery(queries.downMd);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (condominiumQuery.isLoading) {
    return (
      <S.Loading>
        <Spin size="large" />
      </S.Loading>
    );
  }

  if (condominiumQuery.isError || !condominiumQuery.data) {
    return (
      <Result
        status="error"
        title="Não foi possível abrir este condomínio"
        subTitle="Verifique se o endereço está correto ou se você ainda tem acesso a ele."
        extra={
          <a
            href="/app"
            onClick={(event) => {
              event.preventDefault();
              void navigate('/app');
            }}
          >
            Voltar para meus condomínios
          </a>
        }
      />
    );
  }

  const condominium = condominiumQuery.data;
  const closeMenu = () => setMenuOpen(false);

  return (
    <S.Shell>
      <S.Topbar>
        <S.Brand>
          {isMobile ? (
            <S.MenuButton
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} aria-hidden />
            </S.MenuButton>
          ) : null}
          <S.BrandIcon aria-hidden>
            <Building2 size={20} />
          </S.BrandIcon>
          <div style={{ minWidth: 0 }}>
            <S.BrandTitle title={condominium.name}>{condominium.name}</S.BrandTitle>
            {!isMobile ? <S.BrandSubtitle>{session?.user.name}</S.BrandSubtitle> : null}
          </div>
        </S.Brand>

        <S.TopActions>
          <NotificationBell condominiumId={condominium.id} />
          {!isMobile ? (
            <S.TopLink
              href="/app"
              onClick={(event) => {
                event.preventDefault();
                void navigate('/app');
              }}
            >
              Meus condomínios
            </S.TopLink>
          ) : (
            <S.IconButton
              type="button"
              aria-label="Meus condomínios"
              title="Meus condomínios"
              onClick={() => void navigate('/app')}
            >
              <Building2 size={16} aria-hidden />
            </S.IconButton>
          )}
          <S.IconButton type="button" onClick={logout} aria-label="Sair">
            <LogOut size={16} aria-hidden />
            {isMobile ? null : 'Sair'}
          </S.IconButton>
        </S.TopActions>
      </S.Topbar>

      <S.Body>
        {!isMobile ? (
          <S.Sidebar aria-label="Navegação do condomínio">
            <CondoNav condominium={condominium} />
          </S.Sidebar>
        ) : null}

        <S.Content>
          <Outlet context={condominium} />
        </S.Content>
      </S.Body>

      <Drawer
        title={session?.user.name ?? condominium.name}
        placement="left"
        open={isMobile && menuOpen}
        onClose={closeMenu}
        width="min(320px, 88vw)"
        styles={{ body: { padding: 12 } }}
      >
        <S.DrawerNav aria-label="Navegação do condomínio">
          <NavSection label="Geral">
            <S.SidebarItem
              to="/app"
              onClick={() => {
                closeMenu();
              }}
            >
              <Building2 size={16} aria-hidden />
              Meus condomínios
            </S.SidebarItem>
          </NavSection>
          <CondoNav condominium={condominium} onNavigate={closeMenu} />
        </S.DrawerNav>
      </Drawer>
    </S.Shell>
  );
}
