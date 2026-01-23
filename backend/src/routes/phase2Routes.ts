import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { pagarmeService } from '../services/pagarmeService.js';
import { nfeService } from '../services/nfeService.js';
import { tefService } from '../services/tefService.js';
import { financialService } from '../services/financialService.js';
import { dashboardService } from '../services/dashboardService.js';
import { adminService } from '../services/adminService.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ==========================================
// PAGAR.ME ROUTES
// ==========================================

// Create payment (credit card)
router.post('/payments/credit-card', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, customer, card, billing, installments, invoiceId, orderId, metadata } = req.body;

    if (!amount || !customer || !card || !billing) {
      throw new AppError('Missing required fields: amount, customer, card, billing', 400);
    }

    const result = await pagarmeService.createCreditCardPayment({
      amount,
      customer,
      card,
      billing,
      installments,
      metadata: { ...metadata, invoiceId, orderId },
    });

    // Store transaction
    await pagarmeService.storeTransaction({
      invoiceId,
      orderId,
      customerId: customer.id,
      pagarmeId: result.id,
      status: result.status,
      amount,
      paymentMethod: 'credit_card',
      installments,
      cardBrand: result.charges?.[0]?.last_transaction?.brand,
      cardLastDigits: card.number.slice(-4),
      metadata,
    });

    res.json({ transaction: result });
  } catch (error) {
    next(error);
  }
});

// Create PIX payment
router.post('/payments/pix', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, customer, invoiceId, orderId, expiresIn, metadata } = req.body;

    if (!amount || !customer) {
      throw new AppError('Missing required fields: amount, customer', 400);
    }

    const result = await pagarmeService.createPixPayment({
      amount,
      customer,
      expiresIn,
      metadata: { ...metadata, invoiceId, orderId },
    });

    await pagarmeService.storeTransaction({
      invoiceId,
      orderId,
      customerId: customer.id,
      pagarmeId: result.id,
      status: result.status,
      amount,
      paymentMethod: 'pix',
      metadata,
    });

    res.json({ transaction: result });
  } catch (error) {
    next(error);
  }
});

// Create Boleto payment
router.post('/payments/boleto', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, customer, billing, dueAt, instructions, invoiceId, orderId, metadata } = req.body;

    if (!amount || !customer || !billing) {
      throw new AppError('Missing required fields: amount, customer, billing', 400);
    }

    const result = await pagarmeService.createBoletoPayment({
      amount,
      customer,
      billing,
      dueAt: dueAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      instructions,
      metadata: { ...metadata, invoiceId, orderId },
    });

    await pagarmeService.storeTransaction({
      invoiceId,
      orderId,
      customerId: customer.id,
      pagarmeId: result.id,
      status: result.status,
      amount,
      paymentMethod: 'boleto',
      boletoUrl: result.charges?.[0]?.last_transaction?.url,
      metadata,
    });

    res.json({ transaction: result });
  } catch (error) {
    next(error);
  }
});

// Pagar.me Webhook
router.post('/payments/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-hub-signature'] as string || '';
    await pagarmeService.processWebhook(req.body, signature);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// ==========================================
// NF-e ROUTES
// ==========================================

// Get fiscal config
router.get('/fiscal/config/:branchId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const config = await nfeService.getFiscalConfig(req.params.branchId);
    res.json({ config });
  } catch (error) {
    next(error);
  }
});

// Save fiscal config
router.post('/fiscal/config/:branchId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const config = await nfeService.saveFiscalConfig(req.params.branchId, req.body);
    res.json({ config });
  } catch (error) {
    next(error);
  }
});

// Emit NF-e/NFC-e from order
router.post('/fiscal/emit/:orderId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tipo = 'NFCE' } = req.body;
    const result = await nfeService.emitirFromOrder(req.params.orderId, tipo);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Cancel fiscal document
router.post('/fiscal/cancel/:documentId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { justificativa } = req.body;
    if (!justificativa || justificativa.length < 15) {
      throw new AppError('Justificativa must be at least 15 characters', 400);
    }
    const result = await nfeService.cancelar(req.params.documentId, justificativa, req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get fiscal documents
router.get('/fiscal/documents', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, orderId, status, tipo, startDate, endDate, limit = 50, offset = 0 } = req.query;
    const result = await nfeService.getDocuments({
      branchId: branchId as string,
      orderId: orderId as string,
      status: status as string,
      tipo: tipo as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// TEF ROUTES
// ==========================================

// Register terminal
router.post('/tef/terminals', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const terminal = await tefService.registerTerminal(req.body);
    res.json({ terminal });
  } catch (error) {
    next(error);
  }
});

// Get terminals for branch
router.get('/tef/terminals/:branchId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const terminals = await tefService.getTerminals(req.params.branchId);
    res.json({ terminals });
  } catch (error) {
    next(error);
  }
});

// Process TEF payment
router.post('/tef/pay', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { terminalId, amount, paymentType, installments, orderId, invoiceId } = req.body;

    if (!terminalId || !amount || !paymentType) {
      throw new AppError('Missing required fields: terminalId, amount, paymentType', 400);
    }

    const result = await tefService.processPayment({
      terminalId,
      amount,
      paymentType,
      installments,
      orderId,
      invoiceId,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Cancel TEF transaction
router.post('/tef/cancel/:transactionId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tefService.cancelTransaction(req.params.transactionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get TEF transactions
router.get('/tef/transactions', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { terminalId, branchId, orderId, status, startDate, endDate, limit = 50, offset = 0 } = req.query;
    const result = await tefService.getTransactions({
      terminalId: terminalId as string,
      branchId: branchId as string,
      orderId: orderId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get TEF daily summary
router.get('/tef/summary/:branchId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const summary = await tefService.getDailySummary(req.params.branchId, date);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// FINANCIAL ROUTES
// ==========================================

// Accounts Payable
router.post('/financial/payable', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await financialService.createAccountPayable(req.body, req.user?.id);
    res.status(201).json({ account });
  } catch (error) {
    next(error);
  }
});

router.get('/financial/payable', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, vendorId, status, startDate, endDate, category, limit = 50, offset = 0 } = req.query;
    const result = await financialService.getAccountsPayable({
      branchId: branchId as string,
      vendorId: vendorId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/financial/payable/:id/pay', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await financialService.payAccountPayable(req.params.id, req.body);
    res.json({ account });
  } catch (error) {
    next(error);
  }
});

// Accounts Receivable
router.post('/financial/receivable', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await financialService.createAccountReceivable(req.body, req.user?.id);
    res.status(201).json({ account });
  } catch (error) {
    next(error);
  }
});

router.get('/financial/receivable', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, customerId, status, startDate, endDate, category, limit = 50, offset = 0 } = req.query;
    const result = await financialService.getAccountsReceivable({
      branchId: branchId as string,
      customerId: customerId as string,
      status: status as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/financial/receivable/:id/receive', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await financialService.receivePayment(req.params.id, req.body);
    res.json({ account });
  } catch (error) {
    next(error);
  }
});

// Cash Flow
router.post('/financial/cashflow', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await financialService.createCashFlowTransaction(req.body, req.user?.id);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
});

router.get('/financial/cashflow', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, startDate, endDate, groupBy = 'day' } = req.query;
    const result = await financialService.getCashFlowReport({
      branchId: branchId as string,
      startDate: new Date(startDate as string || new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(endDate as string || Date.now()),
      groupBy: groupBy as 'day' | 'week' | 'month',
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Bank Accounts
router.post('/financial/bank-accounts', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await financialService.createBankAccount(req.body);
    res.status(201).json({ account });
  } catch (error) {
    next(error);
  }
});

router.get('/financial/bank-accounts/:branchId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const accounts = await financialService.getBankAccounts(req.params.branchId);
    res.json({ accounts });
  } catch (error) {
    next(error);
  }
});

// Categories
router.get('/financial/categories', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const categories = await financialService.getCategories(type as 'income' | 'expense');
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.post('/financial/categories', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await financialService.createCategory(req.body);
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// DASHBOARD / KPI ROUTES
// ==========================================

router.get('/dashboard/overview', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    const data = await dashboardService.getOverviewDashboard(
      branchId as string,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/financial', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    const data = await dashboardService.getFinancialDashboard(
      branchId as string,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/operational', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId } = req.query;
    const data = await dashboardService.getOperationalDashboard(branchId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/customers', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId } = req.query;
    const data = await dashboardService.getCustomerAnalytics(branchId as string);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/kpis', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId, period = 'month' } = req.query;
    const data = await dashboardService.getKPIs(branchId as string, period as 'today' | 'week' | 'month' | 'year');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// Roles
router.get('/admin/roles', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const roles = await adminService.getRoles();
    res.json({ roles });
  } catch (error) {
    next(error);
  }
});

router.post('/admin/roles', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const role = await adminService.createRole(req.body);
    res.status(201).json({ role });
  } catch (error) {
    next(error);
  }
});

router.put('/admin/roles/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const role = await adminService.updateRole(req.params.id, req.body);
    res.json({ role });
  } catch (error) {
    next(error);
  }
});

router.delete('/admin/roles/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteRole(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    next(error);
  }
});

// Permissions
router.get('/admin/permissions', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { grouped } = req.query;
    if (grouped === 'true') {
      const permissions = await adminService.getPermissionsByModule();
      res.json({ permissions });
    } else {
      const permissions = await adminService.getPermissions();
      res.json({ permissions });
    }
  } catch (error) {
    next(error);
  }
});

// User roles
router.post('/admin/users/:userId/roles', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { roleId, branchId } = req.body;
    await adminService.assignUserRole(req.params.userId, roleId, branchId);
    res.json({ message: 'Role assigned' });
  } catch (error) {
    next(error);
  }
});

router.delete('/admin/users/:userId/roles/:roleId', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await adminService.removeUserRole(req.params.userId, req.params.roleId);
    res.json({ message: 'Role removed' });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/users/:userId/permissions', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { branchId } = req.query;
    const permissions = await adminService.getUserPermissions(req.params.userId, branchId as string);
    res.json({ permissions });
  } catch (error) {
    next(error);
  }
});

// System config
router.get('/admin/config', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    if (category) {
      const config = await adminService.getConfigByCategory(category as string);
      res.json({ config });
    } else {
      const config = await adminService.getAllConfig();
      res.json({ config });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/admin/config', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { key, value, type, category, description } = req.body;
    await adminService.setConfig(key, value, { type, category, description, userId: req.user?.id });
    res.json({ message: 'Config saved' });
  } catch (error) {
    next(error);
  }
});

// Branches
router.get('/admin/branches', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { hierarchy } = req.query;
    if (hierarchy === 'true') {
      const branches = await adminService.getBranchesHierarchy();
      res.json({ branches });
    } else {
      const branches = await adminService.getUserBranches(req.user!.id);
      res.json({ branches });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/admin/branches', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const branch = await adminService.createBranch(req.body);
    res.status(201).json({ branch });
  } catch (error) {
    next(error);
  }
});

router.put('/admin/branches/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const branch = await adminService.updateBranch(req.params.id, req.body);
    res.json({ branch });
  } catch (error) {
    next(error);
  }
});

router.get('/admin/branches/:id/settings', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await adminService.getBranchSettings(req.params.id);
    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

router.put('/admin/branches/:id/settings', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await adminService.updateBranchSettings(req.params.id, req.body);
    res.json({ message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
});

// Audit logs
router.get('/admin/audit-logs', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, entityType, entityId, action, startDate, endDate, limit = 50, offset = 0 } = req.query;
    const result = await adminService.getAuditLogs({
      userId: userId as string,
      entityType: entityType as string,
      entityId: entityId as string,
      action: action as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: Number(limit),
      offset: Number(offset),
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
