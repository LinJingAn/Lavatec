const fs = require('fs');
const path = require('path');

// List of pages that need the dynamic export
const pagesToUpdate = [
  'src/pages/admin/AddUnidadPage.tsx',
  'src/pages/admin/EditUnidadPage.tsx',
  'src/pages/admin/FinanceiroPage.tsx',
  'src/pages/admin/ListUnidadesPage.tsx',
  'src/pages/admin/UnidadesMapPage.tsx',
  'src/pages/admin/UnidadesPage.tsx',
  'src/pages/admin/configuracoes/SystemConfigPage.tsx',
  'src/pages/admin/configuracoes/UserAccessControlPage.tsx',
  'src/pages/admin/financeiro/ConciliacaoPage.tsx',
  'src/pages/admin/financeiro/ContasPagarPage.tsx',
  'src/pages/admin/financeiro/ContasReceberPage.tsx',
  'src/pages/admin/financeiro/FinancialDashboardPage.tsx',
  'src/pages/admin/financeiro/RelatoriosPage.tsx',
  'src/pages/admin/funcionarios/BeneficiosPage.tsx',
  'src/pages/admin/funcionarios/CriarUsuarioPage.tsx',
  'src/pages/admin/funcionarios/EditarUsuarioPage.tsx',
  'src/pages/admin/funcionarios/FolhaPagamentoPage.tsx',
  'src/pages/admin/funcionarios/FuncionarioDetalhesPage.tsx',
  'src/pages/admin/funcionarios/FuncionariosPage.tsx',
  'src/pages/admin/funcionarios/GerenciarFuncionariosPage.tsx',
  'src/pages/admin/funcionarios/HorariosPage.tsx',
  'src/pages/admin/funcionarios/ListaFuncionariosPage.tsx',
  'src/pages/admin/funcionarios/NovoFuncionarioPage.tsx',
  'src/pages/admin/funcionarios/TreinamentoPage.tsx',
  'src/pages/admin/funcionarios/UsuariosPage.tsx',
  'src/pages/admin/funcionarios/VisualizarUsuarioPage.tsx',
  'src/pages/customer/CustomerCommunicationPage.tsx',
  'src/pages/customer/CustomerNotesPage.tsx',
  'src/pages/services/AddServicePage.tsx',
  'src/pages/services/BulkPriceUpdatePage.tsx',
  'src/pages/services/GarmentCategoriesPage.tsx',
  'src/pages/services/GarmentTypesPage.tsx',
  'src/pages/services/PriceVariantsPage.tsx',
  'src/pages/services/ServiceCategoriesPage.tsx',
  'src/pages/services/ServiceDetailPage.tsx',
  'src/pages/services/ServiceFormPage.tsx',
  'src/pages/services/TestPage.tsx',
  'src/pages/stores/ActiveOrdersPage.tsx',
  'src/pages/stores/AddCustomerPage.tsx',
  'src/pages/stores/AddOrderPage.tsx',
  'src/pages/stores/CompletedOrdersPage.tsx',
  'src/pages/stores/CustomerCategoriesPage.tsx',
  'src/pages/stores/CustomerDetailPage.tsx',
  'src/pages/stores/CustomerDetailsPage.tsx',
  'src/pages/stores/CustomersPage.tsx',
  'src/pages/stores/DashboardPage.tsx',
  'src/pages/stores/EditCustomerPage.tsx',
  'src/pages/stores/OrderDetailPage.tsx',
  'src/pages/stores/OrdersPage.tsx',
  'src/pages/stores/PDVPage.tsx',
  'src/pages/stores/SelfServicePage.tsx',
  'src/pages/stores/dashboard/AnalyticsPage.tsx',
  'src/pages/stores/marketing/AutomatedCampaignsPage.tsx',
  'src/pages/stores/marketing/AutomatedFlowsPage.tsx',
  'src/pages/stores/marketing/CustomerSegmentationPage.tsx',
  'src/pages/stores/marketing/EmailPage.tsx',
  'src/pages/stores/marketing/EmailTemplatesPage.tsx',
  'src/pages/stores/marketing/LoyaltyProgramPage.tsx',
  'src/pages/stores/marketing/MarketingPage.tsx',
  'src/pages/stores/marketing/OrderNotificationsPage.tsx',
  'src/pages/stores/marketing/PushNotificationsPage.tsx',
  'src/pages/stores/marketing/SMSPage.tsx',
  'src/pages/stores/marketing/SMSTemplatesPage.tsx',
];

const comment = '// Disable static generation - this page uses React Router and/or Auth context\nexport const dynamic = \'force-dynamic\';\n\n';

pagesToUpdate.forEach((pagePath) => {
  const fullPath = path.join(__dirname, pagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${pagePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has the export
  if (content.includes('export const dynamic')) {
    console.log(`Skipping ${pagePath} - already has dynamic export`);
    return;
  }

  // Find the first type/interface/const/function definition after imports
  // Look for patterns like: "const ComponentName", "function ComponentName", "type TypeName", "interface InterfaceName"
  const lines = content.split('\n');
  let insertIndex = -1;
  
  // Find the last import statement
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex === -1) {
    console.log(`Skipping ${pagePath} - no imports found`);
    return;
  }

  // Find the first non-empty, non-comment line after imports
  for (let i = lastImportIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('//') && !line.startsWith('/*')) {
      insertIndex = i;
      break;
    }
  }

  if (insertIndex === -1) {
    console.log(`Skipping ${pagePath} - couldn't find insertion point`);
    return;
  }

  // Insert the export
  lines.splice(insertIndex, 0, comment.trim());
  const newContent = lines.join('\n');
  
  fs.writeFileSync(fullPath, newContent, 'utf8');
  console.log(`Updated ${pagePath}`);
});

console.log('Done!');
