import { Routes, Route } from 'react-router-dom';
import FinanceiroPage from '../views/admin/FinanceiroPage';
import FinancialDashboardPage from '../views/admin/financeiro/FinancialDashboardPage';
import ContasReceberPage from '../views/admin/financeiro/ContasReceberPage';
import ContasPagarPage from '../views/admin/financeiro/ContasPagarPage';
import RelatoriosPage from '../views/admin/financeiro/RelatoriosPage';
import ConciliacaoPage from '../views/admin/financeiro/ConciliacaoPage';

// ... existing imports ...

const AppRoutes = () => {
  return (
    <Routes>
      {/* ... existing routes ... */}
      
      {/* Financial Module Routes */}
      <Route path="/admin/financeiro" element={<FinanceiroPage />} />
      <Route path="/admin/financeiro/dashboard" element={<FinancialDashboardPage />} />
      <Route path="/admin/financeiro/contas-receber" element={<ContasReceberPage />} />
      <Route path="/admin/financeiro/contas-pagar" element={<ContasPagarPage />} />
      <Route path="/admin/financeiro/relatorios" element={<RelatoriosPage />} />
      <Route path="/admin/financeiro/conciliacao" element={<ConciliacaoPage />} />
      
      {/* ... existing routes ... */}
    </Routes>
  );
};

export default AppRoutes; 