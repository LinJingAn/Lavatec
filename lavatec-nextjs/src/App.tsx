import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SectionProvider } from './contexts/SectionContext'
import { LocationProvider } from './contexts/LocationContext'
import { SidebarProvider } from './contexts/SidebarContext'
import MainLayout from './components/Layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import UserProfilePage from './pages/UserProfilePage'
import UserPreferencesPage from './pages/UserPreferencesPage'
import CompanySettingsPage from './pages/CompanySettingsPage'
import DashboardOverviewPage from './pages/DashboardOverviewPage'

// Admin pages
import UnidadesPage from './pages/admin/UnidadesPage'
import ListUnidadesPage from './pages/admin/ListUnidadesPage'
import AddUnidadPage from './pages/admin/AddUnidadPage'
import EditUnidadPage from './pages/admin/EditUnidadPage'
import UnidadesMapPage from './pages/admin/UnidadesMapPage'
import TeamPage from './pages/admin/TeamPage'
import TasksPage from './pages/admin/TasksPage'
import PromotionsPage from './pages/admin/PromotionsPage'
import AccountPage from './pages/admin/AccountPage'
import HelpPage from './pages/admin/HelpPage'
import FuncionariosPage from './pages/admin/funcionarios/FuncionariosPage'
import NovoFuncionarioPage from './pages/admin/funcionarios/NovoFuncionarioPage'
import FuncionarioDetalhesPage from './pages/admin/funcionarios/FuncionarioDetalhesPage'
import EditarUsuarioPage from './pages/admin/funcionarios/EditarUsuarioPage'
import { SupplyInventoryPage } from './pages/admin/SupplyInventoryPage'

// Store pages
import StoreDashboardPage from './pages/stores/DashboardPage'
import StoreOrdersPage from './pages/stores/OrdersPage'
import StoreCustomersPage from './pages/stores/CustomersPage'
import StoreMachinesPage from './pages/stores/MachinesPage'
import StoreReportsPage from './pages/stores/ReportsPage'
import OverviewPage from './pages/stores/dashboard/OverviewPage'
import AnalyticsPage from './pages/stores/dashboard/AnalyticsPage'
import PerformancePage from './pages/stores/dashboard/PerformancePage'
import StoreOverviewPage from './pages/stores/dashboard/OverviewPage'
import StoreRevenuePage from './pages/stores/dashboard/RevenuePage'
import StoreReceivablesPage from './pages/stores/dashboard/ReceivablesPage'
import StoreActiveOrdersPage from './pages/stores/dashboard/ActiveOrdersPage'
import OperationalReportsPage from './pages/stores/dashboard/OperationalReportsPage'
import FinancialReportsPage from './pages/stores/dashboard/FinancialReportsPage'
import CustomerAnalyticsPage from './pages/stores/dashboard/CustomerAnalyticsPage'
import CustomersPage from './pages/stores/CustomersPage'
import AddCustomerPage from './pages/stores/AddCustomerPage'
import CustomerDetailPage from './pages/stores/CustomerDetailPage'
import EditCustomerPage from './pages/stores/EditCustomerPage'
import CustomerCategoriesPage from './pages/stores/CustomerCategoriesPage'
import CustomerNotesPage from './pages/customer/CustomerNotesPage'
import CustomerCommunicationPage from './pages/customer/CustomerCommunicationPage'
import PDVPage from './pages/stores/PDVPage'
import OrderDetailPage from './pages/stores/OrderDetailPage'
import AddOrderPage from './pages/stores/AddOrderPage'
import PedidosAtivosPage from './pages/stores/ActiveOrdersPage'
import PedidosConcluidosPage from './pages/stores/CompletedOrdersPage'

// Marketing pages
import MarketingPage from './pages/stores/marketing/MarketingPage'
import AutomatedFlowsPage from './pages/stores/marketing/AutomatedFlowsPage'
import EmailTemplatesPage from './pages/stores/marketing/EmailTemplatesPage'
import SMSTemplatesPage from './pages/stores/marketing/SMSTemplatesPage'
import OrderNotificationsPage from './pages/stores/marketing/OrderNotificationsPage'
import CustomerSegmentationPage from './pages/stores/marketing/CustomerSegmentationPage'
import CampaignsPage from './pages/stores/marketing/CampaignsPage'
import CommunicationHistoryPage from './pages/stores/marketing/CommunicationHistoryPage'
import PushNotificationsPage from './pages/stores/marketing/PushNotificationsPage'
import LoyaltyProgramPage from './pages/stores/marketing/LoyaltyProgramPage'

// Service pages
import ServiceDetailPage from './pages/services/ServiceDetailPage'
import ServicesListPage from './pages/services/ServicesListPage'
import ServiceFormPage from './pages/services/ServiceFormPage'
import AddServicePage from './pages/services/AddServicePage'
import PricingMatrixPage from './pages/services/PricingMatrixPage'
import PriceHistoryPage from './pages/services/PriceHistoryPage'
import BulkPriceUpdatePage from './pages/services/BulkPriceUpdatePage'
import PriceCalculatorPage from './pages/services/PriceCalculatorPage'
import GarmentTypesPage from './pages/services/GarmentTypesPage'
import GarmentCategoriesPage from './pages/services/GarmentCategoriesPage'
import ServiceCategoriesPage from './pages/services/ServiceCategoriesPage'
import TestPage from './pages/services/TestPage'

// New Suppliers page
import SuppliersPage from './pages/stores/suppliers/SuppliersPage'

// Logistics page
import { LogisticsPage } from './pages/logistics/LogisticsPage';

// Self Service page
import SelfServicePage from './pages/stores/SelfServicePage';

// Report pages
import SalesReportPage from './pages/stores/reports/SalesReportPage';
import CustomerReportPage from './pages/stores/reports/CustomerReportPage';
import MachineUsageReportPage from './pages/stores/reports/MachineUsageReportPage';

import AIAgentChat from './components/AIAgent/AIAgentChat';

import MachinesOverviewPage from './pages/stores/machines/MachinesOverviewPage';
import MachinesListPage from './pages/stores/machines/MachinesListPage';

// Import financial pages
import FinanceiroPage from './pages/admin/FinanceiroPage'
import FinancialDashboardPage from './pages/admin/financeiro/FinancialDashboardPage'
import ContasReceberPage from './pages/admin/financeiro/ContasReceberPage'
import ContasPagarPage from './pages/admin/financeiro/ContasPagarPage'
import RelatoriosPage from './pages/admin/financeiro/RelatoriosPage'
import ConciliacaoPage from './pages/admin/financeiro/ConciliacaoPage'

// Import missing admin pages
import AssignedTasksPage from './pages/admin/tasks/AssignedTasksPage'
import CompletedTasksPage from './pages/admin/tasks/CompletedTasksPage'
import CreateTaskPage from './pages/admin/tasks/CreateTaskPage'
import ActivePromotionsPage from './pages/admin/promotions/ActivePromotionsPage'
import SecurityPage from './pages/profile/SecurityPage'
import ProfilePreferencesPage from './pages/profile/ProfilePreferencesPage'

// Import missing store pages
import RegularCustomersPage from './pages/stores/customers/RegularCustomersPage'
import HeavyCustomersPage from './pages/stores/customers/HeavyCustomersPage'
import PDVHistoryPage from './pages/stores/pdv/PDVHistoryPage'

import AdminPage from './pages/AdminPage'
import MainDashboard from './pages/MainDashboard'
import StoreDashboard from './pages/StoreDashboard'

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <SectionProvider>
            <LocationProvider>
              <SidebarProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Protected routes with MainLayout */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      {/* Root redirect */}
                      <Route path="/" element={<Navigate to="/stores/dashboard/overview" replace />} />
                      
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
                <AIAgentChat />
              </SidebarProvider>
            </LocationProvider>
          </SectionProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
