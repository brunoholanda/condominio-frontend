import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ResidentFormPage } from '@/features/residents/pages/ResidentFormPage';
import { ResidentsListPage } from '@/features/residents/pages/ResidentsListPage';
import { AppLayout } from '@/shared/components/AppLayout/AppLayout';
import { NotFoundPage } from '@/shared/components/NotFoundPage/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/cadastro" replace />} />
        <Route path="cadastro" element={<ResidentFormPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="moradores" element={<ResidentsListPage />} />
          <Route path="moradores/:id" element={<ResidentFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
