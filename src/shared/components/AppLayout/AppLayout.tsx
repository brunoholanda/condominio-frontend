import { Building2, ClipboardList, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { PrivacyNoticeLink } from '@/shared/components/PrivacyNotice/PrivacyNotice';
import * as S from './AppLayout.styles';

export function AppLayout() {
  const { isAuthenticated, session, logout } = useAuth();

  return (
    <S.Shell>
      <S.Header>
        <S.Brand>
          <S.BrandIcon aria-hidden>
            <Building2 size={24} />
          </S.BrandIcon>
          <div>
            <S.BrandTitle>Condomínio Porto Imperial</S.BrandTitle>
            <S.BrandSubtitle>Cadastro de moradores</S.BrandSubtitle>
          </div>
        </S.Brand>

        <S.Nav aria-label="Navegação principal">
          <S.NavItem to="/cadastro">
            <UserPlus size={16} aria-hidden />
            Novo cadastro
          </S.NavItem>

          {isAuthenticated ? (
            <>
              <S.NavItem to="/moradores">
                <ClipboardList size={16} aria-hidden />
                Moradores
              </S.NavItem>
              <S.UserName title={session?.user.email}>{session?.user.name}</S.UserName>
              <S.NavButton type="button" onClick={logout}>
                <LogOut size={16} aria-hidden />
                Sair
              </S.NavButton>
            </>
          ) : (
            <S.NavItem to="/login">
              <LogIn size={16} aria-hidden />
              Entrar
            </S.NavItem>
          )}
        </S.Nav>
      </S.Header>

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
