import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SectionProvider } from './contexts/SectionContext'
import { LocationProvider } from './contexts/LocationContext'
import { SidebarProvider } from './contexts/SidebarContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationDisplay } from './components/common/NotificationProvider'
import MainLayout from './components/Layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './views/auth/LoginPage'
import RegisterPage from './views/auth/RegisterPage'
import UnauthorizedPage from './views/UnauthorizedPage'
import ForgotPasswordPage from './views/auth/ForgotPasswordPage'
import ResetPasswordPage from './views/auth/ResetPasswordPage'
import VerifyEmailPage from './views/VerifyEmailPage'
import ResendVerificationPage from './views/ResendVerificationPage'
import WaitForVerificationPage from './views/WaitForVerificationPage'
import UserProfilePage from './views/UserProfilePage'
import UserPreferencesPage from './views/UserPreferencesPage'
import CompanySettingsPage from './views/CompanySettingsPage'
import DashboardOverviewPage from './views/DashboardOverviewPage'

// Admin pages
import UnidadesPage from './views/admin/UnidadesPage'
import ListUnidadesPage from './views/admin/ListUnidadesPage'
import AddUnidadPage from './views/admin/AddUnidadPage'
import EditUnidadPage from './views/admin/EditUnidadPage'
import UnidadesMapPage from './views/admin/UnidadesMapPage'
import TeamPage from './views/admin/TeamPage'
import TasksPage from './views/admin/TasksPage'
import PromotionsPage from './views/admin/PromotionsPage'
import AccountPage from './views/admin/AccountPage'
import HelpPage from './views/admin/HelpPage'
import FuncionariosPage from './views/admin/funcionarios/FuncionariosPage'
import NovoFuncionarioPage from './views/admin/funcionarios/NovoFuncionarioPage'
import FuncionarioDetalhesPage from './views/admin/funcionarios/FuncionarioDetalhesPage'
import EditarUsuarioPage from './views/admin/funcionarios/EditarUsuarioPage'
import { SupplyInventoryPage } from './views/admin/SupplyInventoryPage'

// Store pages
import StoreDashboardPage from './views/stores/DashboardPage'
import StoreOrdersPage from './views/stores/OrdersPage'
import StoreCustomersPage from './views/stores/CustomersPage'
import StoreMachinesPage from './views/stores/MachinesPage'
import StoreReportsPage from './views/stores/ReportsPage'
import OverviewPage from './views/stores/dashboard/OverviewPage'
import AnalyticsPage from './views/stores/dashboard/AnalyticsPage'
import PerformancePage from './views/stores/dashboard/PerformancePage'
import StoreOverviewPage from './views/stores/dashboard/OverviewPage'
import StoreRevenuePage from './views/stores/dashboard/RevenuePage'
import StoreReceivablesPage from './views/stores/dashboard/ReceivablesPage'
import StoreActiveOrdersPage from './views/stores/dashboard/ActiveOrdersPage'
import OperationalReportsPage from './views/stores/dashboard/OperationalReportsPage'
import FinancialReportsPage from './views/stores/dashboard/FinancialReportsPage'
import CustomerAnalyticsPage from './views/stores/dashboard/CustomerAnalyticsPage'
import CustomersPage from './views/stores/CustomersPage'
import AddCustomerPage from './views/stores/AddCustomerPage'
import CustomerDetailPage from './views/stores/CustomerDetailPage'
import EditCustomerPage from './views/stores/EditCustomerPage'
import CustomerCategoriesPage from './views/stores/CustomerCategoriesPage'
import CustomerNotesPage from './views/customer/CustomerNotesPage'
import CustomerCommunicationPage from './views/customer/CustomerCommunicationPage'
import PDVPage from './views/stores/PDVPage'
import OrderDetailPage from './views/stores/OrderDetailPage'
import AddOrderPage from './views/stores/AddOrderPage'
import PedidosAtivosPage from './views/stores/ActiveOrdersPage'
import PedidosConcluidosPage from './views/stores/CompletedOrdersPage'

// Marketing pages
import MarketingPage from './views/stores/marketing/MarketingPage'
import AutomatedFlowsPage from './views/stores/marketing/AutomatedFlowsPage'
import EmailTemplatesPage from './views/stores/marketing/EmailTemplatesPage'
import SMSTemplatesPage from './views/stores/marketing/SMSTemplatesPage'
import OrderNotificationsPage from './views/stores/marketing/OrderNotificationsPage'
import CustomerSegmentationPage from './views/stores/marketing/CustomerSegmentationPage'
import CampaignsPage from './views/stores/marketing/CampaignsPage'
import CommunicationHistoryPage from './views/stores/marketing/CommunicationHistoryPage'
import PushNotificationsPage from './views/stores/marketing/PushNotificationsPage'
import LoyaltyProgramPage from './views/stores/marketing/LoyaltyProgramPage'

// Service pages
import ServiceDetailPage from './views/services/ServiceDetailPage'
import ServicesListPage from './views/services/ServicesListPage'
import ServiceFormPage from './views/services/ServiceFormPage'
import AddServicePage from './views/services/AddServicePage'
import PricingMatrixPage from './views/services/PricingMatrixPage'
import PriceHistoryPage from './views/services/PriceHistoryPage'
import BulkPriceUpdatePage from './views/services/BulkPriceUpdatePage'
import PriceCalculatorPage from './views/services/PriceCalculatorPage'
import GarmentTypesPage from './views/services/GarmentTypesPage'
import GarmentCategoriesPage from './views/services/GarmentCategoriesPage'
import ServiceCategoriesPage from './views/services/ServiceCategoriesPage'
import TestPage from './views/services/TestPage'

// New Suppliers page
import SuppliersPage from './views/stores/suppliers/SuppliersPage'

// Logistics page
import { LogisticsPage } from './views/logistics/LogisticsPage';

// Self Service page
import SelfServicePage from './views/stores/SelfServicePage';

// Report pages
import SalesReportPage from './views/stores/reports/SalesReportPage';
import CustomerReportPage from './views/stores/reports/CustomerReportPage';
import MachineUsageReportPage from './views/stores/reports/MachineUsageReportPage';

import AIAgentChat from './components/AIAgent/AIAgentChat';

import MachinesOverviewPage from './views/stores/machines/MachinesOverviewPage';
import MachinesListPage from './views/stores/machines/MachinesListPage';

// Import financial pages
import FinanceiroPage from './views/admin/FinanceiroPage'
import FinancialDashboardPage from './views/admin/financeiro/FinancialDashboardPage'
import ContasReceberPage from './views/admin/financeiro/ContasReceberPage'
import ContasPagarPage from './views/admin/financeiro/ContasPagarPage'
import RelatoriosPage from './views/admin/financeiro/RelatoriosPage'
import ConciliacaoPage from './views/admin/financeiro/ConciliacaoPage'

// Import missing admin pages
import AssignedTasksPage from './views/admin/tasks/AssignedTasksPage'
import CompletedTasksPage from './views/admin/tasks/CompletedTasksPage'
import CreateTaskPage from './views/admin/tasks/CreateTaskPage'
import ActivePromotionsPage from './views/admin/promotions/ActivePromotionsPage'
import SecurityPage from './views/profile/SecurityPage'
import ProfilePreferencesPage from './views/profile/ProfilePreferencesPage'

// Import missing store pages
import RegularCustomersPage from './views/stores/customers/RegularCustomersPage'
import HeavyCustomersPage from './views/stores/customers/HeavyCustomersPage'
import PDVHistoryPage from './views/stores/pdv/PDVHistoryPage'
import LandingPage from './views/LandingPage'

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThemeProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <NotificationProvider>
            <SectionProvider>
              <LocationProvider>
                <SidebarProvider>
                  <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/resend-verification" element={<ResendVerificationPage />} />
                  <Route path="/wait-for-verification" element={<WaitForVerificationPage />} />
                  
                  {/* Protected routes with MainLayout */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      {/* Dashboard home redirect */}
                      <Route path="/dashboard-home" element={<Navigate to="/stores/dashboard/overview" replace />} />
                      
                      {/* Admin Dashboard redirects */}
                      <Route path="/admin" element={<Navigate to="/admin/financeiro/dashboard" replace />} />
                      <Route path="/dashboard" element={<Navigate to="/stores/dashboard/overview" replace />} />
                      
                      {/* POS/PDV Route */}
                      <Route path="/stores/pdv" element={<PDVPage />} />
                      <Route path="/stores/pdv/history" element={<PDVHistoryPage />} />
                      <Route path="/stores/pdv/settings" element={<div>Configurações do PDV</div>} />
                      
                      {/* Price Management Routes - Placed before other service routes to ensure they match first */}
                      <Route path="/services/test" element={<TestPage />} />
                      <Route path="/services/pricing" element={<PricingMatrixPage />} />
                      <Route path="/services/pricing/history" element={<PriceHistoryPage />} />
                      <Route path="/services/pricing/bulk-update" element={<BulkPriceUpdatePage />} />
                      <Route path="/services/pricing/calculator" element={<PriceCalculatorPage />} />
                      <Route path="/services/categories" element={<ServiceCategoriesPage />} />
                      <Route path="/services/garment-types" element={<GarmentTypesPage />} />
                      <Route path="/services/garment-categories" element={<GarmentCategoriesPage />} />

                      {/* Legacy routes */}
                      <Route path="/dashboard/revenue" element={<div>Página de Receita</div>} />
                      <Route path="/dashboard/receivables" element={<div>Página de Contas a Receber</div>} />
                      
                      {/* Admin section routes */}
                      <Route path="/unidades" element={<UnidadesPage />} />
                      <Route path="/unidades/list" element={<ListUnidadesPage />} />
                      <Route path="/unidades/add" element={<AddUnidadPage />} />
                      <Route path="/unidades/edit/:id" element={<EditUnidadPage />} />
                      <Route path="/unidades/map" element={<UnidadesMapPage />} />
                      <Route path="/admin/unidades" element={<UnidadesPage />} />
                      <Route path="/admin/team" element={<FuncionariosPage />} />
                      <Route path="/team" element={<TeamPage />} />
                      <Route path="/funcionarios" element={<FuncionariosPage />} />
                      <Route path="/funcionarios/novo" element={<NovoFuncionarioPage />} />
                      <Route path="/funcionarios/:id" element={<FuncionarioDetalhesPage />} />
                      <Route path="/funcionarios/:id/editar" element={<EditarUsuarioPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/promotions" element={<PromotionsPage />} />
                      <Route path="/account" element={<Navigate to="/profile" replace />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/admin/supplies" element={<SupplyInventoryPage />} />
                      
                      {/* Missing admin task routes */}
                      <Route path="/tasks/assigned" element={<AssignedTasksPage />} />
                      <Route path="/tasks/completed" element={<CompletedTasksPage />} />
                      <Route path="/tasks/create" element={<CreateTaskPage />} />
                      
                      {/* Missing admin promotion routes */}
                      <Route path="/promotions/active" element={<ActivePromotionsPage />} />
                      
                      {/* Old routes to keep for compatibility */}
                      <Route path="/orders" element={<div>Página de Pedidos</div>} />
                      <Route path="/customers" element={<div>Página de Clientes</div>} />
                      <Route path="/customers/subscriptions" element={<div>Página de Assinaturas</div>} />
                      <Route path="/machines" element={<div>Página de Máquinas</div>} />
                      <Route path="/reports/top-items" element={<div>Itens Mais Vendidos</div>} />
                      <Route path="/reports/top-sections" element={<div>Seções Mais Vendidas</div>} />
                      <Route path="/reports/team-hours" element={<div>Horas da Equipe</div>} />
                      <Route path="/reports/team-performance" element={<div>Desempenho da Equipe</div>} />
                      <Route path="/reports/driver-stats" element={<div>Estatísticas de Motoristas</div>} />
                      <Route path="/reports/popular-times" element={<div>Horários Populares</div>} />
                      <Route path="/reports/business-accounts" element={<div>Contas Empresariais</div>} />
                      <Route path="/reports/advertising" element={<div>Publicidade</div>} />
                      <Route path="/reports/processed-weight" element={<div>Peso Processado</div>} />
                      
                      {/* User routes */}
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/profile/security" element={<SecurityPage />} />
                      <Route path="/profile/preferences" element={<ProfilePreferencesPage />} />
                      <Route path="/preferences" element={<UserPreferencesPage />} />
                      
                      {/* Admin company settings */}
                      <Route path="/company" element={<CompanySettingsPage />} />
                      
                      {/* My Stores routes */}
                      <Route path="/stores/dashboard" element={<StoreDashboardPage />} />
                      <Route path="/stores/dashboard/overview" element={<StoreOverviewPage />} />
                      <Route path="/stores/dashboard/analytics" element={<AnalyticsPage />} />
                      <Route path="/stores/dashboard/performance" element={<PerformancePage />} />
                      <Route path="/stores/dashboard/operational" element={<OperationalReportsPage />} />
                      <Route path="/stores/dashboard/financial" element={<FinancialReportsPage />} />
                      <Route path="/stores/dashboard/customer-analytics" element={<CustomerAnalyticsPage />} />
                      <Route path="/stores/orders" element={<StoreOrdersPage />} />
                      <Route path="/stores/orders/active" element={<PedidosAtivosPage />} />
                      <Route path="/stores/orders/completed" element={<PedidosConcluidosPage />} />
                      <Route path="/stores/orders/new" element={<AddOrderPage />} />
                      <Route path="/stores/orders/:orderId" element={<OrderDetailPage />} />
                      <Route path="/stores/customers" element={<CustomersPage />} />
                      <Route path="/stores/customers/add" element={<AddCustomerPage />} />
                      <Route path="/stores/customers/categories" element={<CustomerCategoriesPage />} />
                      <Route path="/stores/customers/regular" element={<RegularCustomersPage />} />
                      <Route path="/stores/customers/heavy" element={<HeavyCustomersPage />} />
                      <Route path="/stores/customers/occasional" element={<CustomersPage />} />
                      <Route path="/stores/customers/rare" element={<CustomersPage />} />
                      <Route path="/stores/customers/:categoryId" element={<CustomersPage />} />
                      <Route path="/stores/customers/view/:customerId" element={<CustomerDetailPage />} />
                      <Route path="/stores/customers/edit/:customerId" element={<EditCustomerPage />} />
                      <Route path="/stores/machines" element={<MachinesOverviewPage />} />
                      <Route path="/stores/machines/list" element={<MachinesListPage />} />
                      <Route path="/stores/machines/maintenance" element={<div>Manutenção de Máquinas</div>} />
                      <Route path="/stores/machines/schedule" element={<div>Agendamento de Máquinas</div>} />
                      <Route path="/stores/machines/reports" element={<div>Relatórios de Máquinas</div>} />
                      <Route path="/stores/suppliers" element={<SuppliersPage />} />
                      <Route path="/stores/reports" element={<StoreReportsPage />} />
                      <Route path="/stores/reports/sales" element={<SalesReportPage />} />
                      <Route path="/stores/reports/customers" element={<CustomerReportPage />} />
                      <Route path="/stores/reports/machines" element={<MachineUsageReportPage />} />
                      <Route path="/stores/self-service" element={<SelfServicePage />} />
                      <Route path="/stores/self-service/machines" element={<div>Máquinas Auto Serviço</div>} />
                      <Route path="/stores/self-service/transactions" element={<div>Transações Auto Serviço</div>} />
                      <Route path="/stores/self-service/settings" element={<div>Configurações Auto Serviço</div>} />
                      
                      {/* Marketing routes */}
                      <Route path="/stores/marketing" element={<MarketingPage />} />
                      <Route path="/stores/marketing/automated-flows" element={<AutomatedFlowsPage />} />
                      <Route path="/stores/marketing/campaigns" element={<CampaignsPage />} />
                      <Route path="/stores/marketing/email-templates" element={<EmailTemplatesPage />} />
                      <Route path="/stores/marketing/sms-templates" element={<SMSTemplatesPage />} />
                      <Route path="/stores/marketing/order-notifications" element={<OrderNotificationsPage />} />
                      <Route path="/stores/marketing/customer-segmentation" element={<CustomerSegmentationPage />} />
                      <Route path="/stores/marketing/communication-history" element={<CommunicationHistoryPage />} />
                      <Route path="/stores/marketing/push-notifications" element={<PushNotificationsPage />} />
                      <Route path="/stores/marketing/loyalty" element={<LoyaltyProgramPage />} />
                      
                      {/* Regular stores route */}
                      <Route path="/stores" element={<Navigate to="/stores/dashboard" replace />} />

                      {/* Service Routes */}
                      <Route path="/services/add" element={<AddServicePage />} />
                      <Route path="/services/new" element={<ServiceFormPage />} />
                      <Route path="/services/:serviceId/edit" element={<ServiceFormPage />} />
                      <Route path="/services/:serviceId/price-variants" element={<div>Variantes de Preço</div>} />
                      <Route path="/services/:serviceId/price-variants/add" element={<div>Adicionar Variante de Preço</div>} />
                      <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                      <Route path="/services" element={<ServicesListPage />} />
                      
                      {/* Customer Routes */}
                      <Route path="/store/:storeId/customers" element={<CustomersPage />} />
                      <Route path="/store/:storeId/customers/add" element={<AddCustomerPage />} />
                      <Route path="/store/:storeId/customers/edit/:customerId" element={<EditCustomerPage />} />
                      <Route path="/store/:storeId/customers/categories" element={<CustomerCategoriesPage />} />
                      <Route path="/customers/:customerId/notes" element={<CustomerNotesPage />} />
                      <Route path="/customers/:customerId/communication" element={<CustomerCommunicationPage />} />

                      {/* Logistics route */}
                      <Route path="/stores/logistics/*" element={<LogisticsPage />} />

                      {/* Financeiro/Financial routes */}
                      <Route path="/admin/financeiro" element={<FinanceiroPage />} />
                      <Route path="/admin/financeiro/dashboard" element={<FinancialDashboardPage />} />
                      <Route path="/admin/financeiro/contas-receber" element={<ContasReceberPage />} />
                      <Route path="/admin/financeiro/contas-pagar" element={<ContasPagarPage />} />
                      <Route path="/admin/financeiro/relatorios" element={<RelatoriosPage />} />
                      <Route path="/admin/financeiro/conciliacao" element={<ConciliacaoPage />} />
                    </Route>
                  </Route>
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <NotificationDisplay />
                  <AIAgentChat />
                </SidebarProvider>
              </LocationProvider>
            </SectionProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
