import { Spin } from 'antd';
import { matchPath, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { OperatorTermsGate } from './OperatorTermsGate';
import * as S from './ProtectedRoute.styles';

/**
 * Rotas autenticadas do morador (ex.: reservas) não passam pelo termo LGPD
 * de operador — esse aceite vale só para a área gestora com dados pessoais.
 */
function isResidentFacingPath(pathname: string): boolean {
  return Boolean(matchPath({ path: '/c/:slug/reservas', end: true }, pathname));
}

/** Blocks unauthenticated access and remembers where the user wanted to go. */
export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <S.Loading>
        <Spin size="large" description="Validando sessão..." />
      </S.Loading>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isResidentFacingPath(location.pathname)) {
    return <Outlet />;
  }

  return (
    <OperatorTermsGate>
      <Outlet />
    </OperatorTermsGate>
  );
}
