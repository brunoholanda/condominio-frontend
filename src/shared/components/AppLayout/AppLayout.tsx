import { Drawer } from 'antd';
import {
  Building2,
  LayoutGrid,
  LifeBuoy,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { PrivacyNoticeLink } from '@/shared/components/PrivacyNotice/PrivacyNotice';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { queries } from '@/styles/theme';
import * as S from './AppLayout.styles';

/** Formulário público de cadastro / portal do funcionário — visitantes só veem a marca no header. */
function isPublicServicePath(pathname: string): boolean {
  return (
    pathname === '/cadastro' ||
    Boolean(matchPath({ path: '/c/:slug/cadastro', end: true }, pathname)) ||
    Boolean(matchPath({ path: '/c/:slug/portal', end: true }, pathname)) ||
    Boolean(matchPath({ path: '/c/:slug/ponto', end: true }, pathname)) ||
    Boolean(matchPath({ path: '/c/:slug/reservas', end: true }, pathname))
  );
}
export function AppLayout() {
  const { isAuthenticated, session, logout } = useAuth();
  const isMobile = useMediaQuery(queries.downMd);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const hideGuestNav = isPublicServicePath(location.pathname) && !isAuthenticated;
  const showNav = isAuthenticated || !hideGuestNav;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = isAuthenticated ? (
    <>
      <S.NavItem to="/app" onClick={() => setMenuOpen(false)}>
        <LayoutGrid size={16} aria-hidden />
        Meus condomínios
      </S.NavItem>
      <S.NavItem to="/app/conta" onClick={() => setMenuOpen(false)}>
        <UserRound size={16} aria-hidden />
        Conta
      </S.NavItem>
      <S.NavItem to="/app/suporte" onClick={() => setMenuOpen(false)}>
        <LifeBuoy size={16} aria-hidden />
        Suporte
      </S.NavItem>
      <S.UserName title={session?.user.email}>{session?.user.name}</S.UserName>
      <S.NavButton
        type="button"
        onClick={() => {
          setMenuOpen(false);
          logout();
        }}
      >
        <LogOut size={16} aria-hidden />
        Sair
      </S.NavButton>
    </>
  ) : (
    <>
      <S.NavItem to="/registro" onClick={() => setMenuOpen(false)}>
        <UserPlus size={16} aria-hidden />
        Criar conta
      </S.NavItem>
      <S.NavItem to="/login" onClick={() => setMenuOpen(false)}>
        <LogIn size={16} aria-hidden />
        Entrar
      </S.NavItem>
    </>
  );

  return (
    <S.Shell>
      <S.Header>
        <S.BrandRow>
          {isMobile && showNav ? (
            <S.MenuButton
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </S.MenuButton>
          ) : null}
          <S.Brand>
            <S.BrandIcon aria-hidden>
              <Building2 size={24} />
            </S.BrandIcon>
            <div>
              <S.BrandTitle>CondoGest</S.BrandTitle>
              <S.BrandSubtitle>Gestão de condomínios</S.BrandSubtitle>
            </div>
          </S.Brand>
        </S.BrandRow>

        {!isMobile && showNav ? <S.Nav aria-label="Navegação principal">{navLinks}</S.Nav> : null}
      </S.Header>

      {showNav ? (
        <Drawer
          title={session?.user.name ?? 'Menu'}
          placement="left"
          open={isMobile && menuOpen}
          onClose={() => setMenuOpen(false)}
          width="min(320px, 100%)"
          styles={{ body: { paddingTop: 8 } }}
        >
          <S.DrawerNav aria-label="Navegação principal">{navLinks}</S.DrawerNav>
        </Drawer>
      ) : null}

      <S.Main>
        <Outlet />
      </S.Main>

      <S.Footer>
        <span>
          Os dados coletados são utilizados exclusivamente para o controle e a organização do
          condomínio, conforme a Lei 13.709/2018 (LGPD). Consulte o <PrivacyNoticeLink /> para saber
          quais são os seus direitos.
        </span>
        <S.Copyright>
          © {new Date().getFullYear()} Holanda Dev Software. Todos os direitos reservados.
        </S.Copyright>
      </S.Footer>
    </S.Shell>
  );
}
