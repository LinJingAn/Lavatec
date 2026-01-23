import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runPhase2Migration() {
  console.log('🚀 Starting Phase 2 migration...');
  
  try {
    // Read the Phase 2 migration SQL file
    const migrationPath = join(__dirname, 'migrations', 'phase2_migration.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Execute the migration
    await pool.query(migrationSQL);

    console.log('✅ Phase 2 migration completed successfully!');
    console.log('');
    console.log('📦 New features added:');
    console.log('   - Módulo Financeiro (Accounts Payable/Receivable, Cash Flow)');
    console.log('   - Módulo Administrativo (Roles, Permissions, Multi-branch)');
    console.log('   - Pagar.me Payment Gateway Integration');
    console.log('   - NF-e/NFC-e Fiscal Integration');
    console.log('   - TEF Physical Card Machine Integration');
    console.log('   - Dashboards & KPIs');
    console.log('');
    console.log('🔧 API Endpoints added:');
    console.log('   POST /api/payments/credit-card - Credit card payment');
    console.log('   POST /api/payments/pix - PIX payment');
    console.log('   POST /api/payments/boleto - Boleto payment');
    console.log('   POST /api/payments/webhook - Pagar.me webhook');
    console.log('');
    console.log('   GET/POST /api/fiscal/config/:branchId - Fiscal configuration');
    console.log('   POST /api/fiscal/emit/:orderId - Emit NF-e/NFC-e');
    console.log('   POST /api/fiscal/cancel/:documentId - Cancel fiscal document');
    console.log('   GET /api/fiscal/documents - List fiscal documents');
    console.log('');
    console.log('   POST /api/tef/terminals - Register TEF terminal');
    console.log('   GET /api/tef/terminals/:branchId - Get terminals');
    console.log('   POST /api/tef/pay - Process TEF payment');
    console.log('   POST /api/tef/cancel/:transactionId - Cancel TEF transaction');
    console.log('');
    console.log('   GET/POST /api/financial/payable - Accounts payable');
    console.log('   GET/POST /api/financial/receivable - Accounts receivable');
    console.log('   GET/POST /api/financial/cashflow - Cash flow');
    console.log('');
    console.log('   GET /api/dashboard/overview - Overview dashboard');
    console.log('   GET /api/dashboard/financial - Financial dashboard');
    console.log('   GET /api/dashboard/operational - Operational dashboard');
    console.log('   GET /api/dashboard/customers - Customer analytics');
    console.log('   GET /api/dashboard/kpis - KPI summary');
    console.log('');
    console.log('   GET/POST /api/admin/roles - Role management');
    console.log('   GET /api/admin/permissions - Permission list');
    console.log('   GET/POST /api/admin/config - System configuration');
    console.log('   GET/POST /api/admin/branches - Branch management');
    console.log('   GET /api/admin/audit-logs - Audit logs');
    console.log('');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Phase 2 migration failed:', error.message);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    process.exit(1);
  }
}

runPhase2Migration();
