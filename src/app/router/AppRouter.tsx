import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { CommonAreasPage } from '@/features/common-areas/pages/CommonAreasPage';
import { ResidentBookingsPage } from '@/features/common-areas/pages/ResidentBookingsPage';
import { CondoHomeRedirect, ManagerLayout } from '@/features/condominiums/components/ManagerLayout';
import { CreateCondominiumPage } from '@/features/condominiums/pages/CreateCondominiumPage';
import { MembersAdminPage } from '@/features/condominiums/pages/MembersAdminPage';
import { MyCondominiumsPage } from '@/features/condominiums/pages/MyCondominiumsPage';
import { PublicCondoHubPage } from '@/features/condominiums/pages/PublicCondoHubPage';
import { PublicQrCodesPage } from '@/features/condominiums/pages/PublicQrCodesPage';
import { ContactsAdminPage } from '@/features/directory/pages/ContactsAdminPage';
import { DeliveriesPage } from '@/features/deliveries/pages/DeliveriesPage';
import { PublicDeliverySignPage } from '@/features/deliveries/pages/PublicDeliverySignPage';
import { DocumentsAdminPage } from '@/features/documents/pages/DocumentsAdminPage';
import { PublicDocumentDetailPage } from '@/features/documents/pages/PublicDocumentDetailPage';
import { PublicDocumentsPage } from '@/features/documents/pages/PublicDocumentsPage';
import { ChargesPage } from '@/features/charges/pages/ChargesPage';
import { FinancePage } from '@/features/finance/pages/FinancePage';
import { TransparencyPayableDetailPage } from '@/features/finance/pages/TransparencyPayableDetailPage';
import { TransparencyPortalPage } from '@/features/finance/pages/TransparencyPortalPage';
import { LandingPage } from '@/features/marketing/pages/LandingPage';
import { ResidentFormPage } from '@/features/residents/pages/ResidentFormPage';
import { ResidentsListPage } from '@/features/residents/pages/ResidentsListPage';
import { PublicSuggestionsPage } from '@/features/suggestions/pages/PublicSuggestionsPage';
import { SuggestionsAdminPage } from '@/features/suggestions/pages/SuggestionsAdminPage';
import { PlatformAccountsPage } from '@/features/platform-admin/pages/PlatformAccountsPage';
import { AdminSupportTicketsPage } from '@/features/support/pages/AdminSupportTicketsPage';
import { MySupportTicketsPage } from '@/features/support/pages/MySupportTicketsPage';
import { MyAccountPage } from '@/features/account/pages/MyAccountPage';
import { DataInventoryPage } from '@/features/privacy/pages/DataInventoryPage';
import { EmployeesListPage } from '@/features/staff/pages/EmployeesListPage';
import { EmployeeFormPage } from '@/features/staff/pages/EmployeeFormPage';
import { PunchesAdminPage } from '@/features/staff/pages/PunchesAdminPage';
import { AbsencesAdminPage } from '@/features/staff/pages/AbsencesAdminPage';
import { StaffPortalPage } from '@/features/staff/pages/StaffPortalPage';
import { TimeClockPage } from '@/features/staff/pages/TimeClockPage';
import { CondoSettingsPage } from '@/features/condominiums/pages/CondoSettingsPage';
import { VisitorsPage } from '@/features/visitors/pages/VisitorsPage';
import { WorkOrdersPage } from '@/features/work-orders/pages/WorkOrdersPage';
import { AppLayout } from '@/shared/components/AppLayout/AppLayout';
import { NotFoundPage } from '@/shared/components/NotFoundPage/NotFoundPage';

/** Nome legado, mantido só para o link curto `/cadastro` continuar funcionando. */
const LEGACY_SLUG = 'porto-imperial';

/** Home pública de captação; quem já entrou vai para a área logada. */
function HomeRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <LandingPage />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route index element={<HomeRoute />} />

      {/* Área gestora de um condomínio: layout próprio (sem o chrome global). */}
      <Route element={<ProtectedRoute />}>
        <Route path="app/condominios/:condominiumId" element={<ManagerLayout />}>
          <Route index element={<CondoHomeRedirect />} />
          <Route path="moradores" element={<ResidentsListPage />} />
          <Route path="moradores/:id" element={<ResidentFormPage />} />
          <Route path="entregas" element={<DeliveriesPage />} />
          <Route path="visitantes" element={<VisitorsPage />} />
          <Route path="chamados" element={<WorkOrdersPage />} />
          <Route path="qr-codes" element={<PublicQrCodesPage />} />
          <Route path="financeiro" element={<FinancePage />} />
          <Route path="cobrancas" element={<ChargesPage />} />
          <Route path="areas" element={<CommonAreasPage />} />
          <Route path="documentos" element={<DocumentsAdminPage />} />
          <Route path="sugestoes" element={<SuggestionsAdminPage />} />
          <Route path="contatos" element={<ContactsAdminPage />} />
          <Route path="equipe" element={<MembersAdminPage />} />
          <Route path="funcionarios" element={<EmployeesListPage />} />
          <Route path="funcionarios/:id" element={<EmployeeFormPage />} />
          <Route path="ponto" element={<PunchesAdminPage />} />
          <Route path="faltas" element={<AbsencesAdminPage />} />
          <Route path="dados" element={<CondoSettingsPage />} />
          <Route path="localizacao" element={<Navigate to="../dados" replace />} />
        </Route>
      </Route>

      <Route element={<AppLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />

        <Route path="assinar-entrega/:token" element={<PublicDeliverySignPage />} />

        <Route path="c/:slug" element={<PublicCondoHubPage />} />
        <Route path="c/:slug/cadastro" element={<ResidentFormPage />} />
        <Route path="c/:slug/documentos" element={<PublicDocumentsPage />} />
        <Route path="c/:slug/documentos/:id" element={<PublicDocumentDetailPage />} />
        <Route path="c/:slug/transparencia" element={<TransparencyPortalPage />} />
        <Route path="c/:slug/transparencia/:payableId" element={<TransparencyPayableDetailPage />} />
        <Route path="c/:slug/sugestoes" element={<PublicSuggestionsPage />} />
        <Route path="c/:slug/reservas" element={<ResidentBookingsPage />} />
        <Route path="c/:slug/portal" element={<StaffPortalPage />} />
        <Route path="c/:slug/ponto" element={<TimeClockPage />} />
        <Route path="cadastro" element={<Navigate to={`/c/${LEGACY_SLUG}/cadastro`} replace />} />
        <Route path="moradores" element={<Navigate to="/app" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<MyCondominiumsPage />} />
          <Route path="app/conta" element={<MyAccountPage />} />
          <Route path="app/conta/inventario-lgpd" element={<DataInventoryPage />} />
          <Route path="app/suporte" element={<MySupportTicketsPage />} />
          <Route path="app/admin/contas" element={<PlatformAccountsPage />} />
          <Route path="app/admin/chamados" element={<AdminSupportTicketsPage />} />
          <Route path="app/condominios/novo" element={<CreateCondominiumPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
