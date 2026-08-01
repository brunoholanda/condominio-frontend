import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { OperatorTermsGate } from './OperatorTermsGate';
import * as S from './ProtectedRoute.styles';

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

  return (
    <OperatorTermsGate>
      <Outlet />
    </OperatorTermsGate>
  );
}
