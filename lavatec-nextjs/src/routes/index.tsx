import { Routes, Route } from 'react-router-dom';
import FinanceiroPage from '../pages/admin/FinanceiroPage';
import FinancialDashboardPage from '../pages/admin/financeiro/FinancialDashboardPage';
import ContasReceberPage from '../pages/admin/financeiro/ContasReceberPage';
import ContasPagarPage from '../pages/admin/financeiro/ContasPagarPage';
import RelatoriosPage from '../pages/admin/financeiro/RelatoriosPage';
import ConciliacaoPage from '../pages/admin/financeiro/ConciliacaoPage';

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