import pool from '../config/database.js';

// Financial Types
export interface AccountPayable {
  id?: string;
  branchId?: string;
  vendorId?: string;
  description: string;
  category?: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  recurrenceType?: string;
  recurrenceEndDate?: Date;
}

export interface AccountReceivable {
  id?: string;
  branchId?: string;
  customerId?: string;
  invoiceId?: string;
  orderId?: string;
  description: string;
  category?: string;
  amount: number;
  dueDate: Date;
  receivedDate?: Date;
  status?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface CashFlowTransaction {
  id?: string;
  branchId?: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subcategory?: string;
  description: string;
  amount: number;
  transactionDate: Date;
  paymentMethod?: string;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

class FinancialService {
  // ==========================================
  // ACCOUNTS PAYABLE
  // ==========================================

  /**
   * Create an account payable entry
   */
  async createAccountPayable(data: AccountPayable, userId?: string): Promise<any> {
    const result = await pool.query(
      `INSERT INTO accounts_payable (
        branch_id, vendor_id, description, category, amount, due_date,
        payment_method, reference_number, notes, recurrence_type, recurrence_end_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.branchId, data.vendorId, data.description, data.category,
        data.amount, data.dueDate, data.paymentMethod, data.referenceNumber,
        data.notes, data.recurrenceType, data.recurrenceEndDate, userId,
      ]
    );

    // If recurring, create future entries
    if (data.recurrenceType && data.recurrenceType !== 'none' && data.recurrenceEndDate) {
      await this.createRecurringPayables(result.rows[0], data.recurrenceEndDate);
    }

    return result.rows[0];
  }

  /**
   * Get accounts payable with filters
   */
  async getAccountsPayable(params: {
    branchId?: string;
    vendorId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ accounts: any[]; total: number; summary: any }> {
    let query = `SELECT ap.*, v.name as vendor_name
                 FROM accounts_payable ap
                 LEFT JOIN vendors v ON v.id = ap.vendor_id
                 WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.branchId) {
      query += ` AND ap.branch_id = $${paramIndex++}`;
      queryParams.push(params.branchId);
    }

    if (params.vendorId) {
      query += ` AND ap.vendor_id = $${paramIndex++}`;
      queryParams.push(params.vendorId);
    }

    if (params.status) {
      query += ` AND ap.status = $${paramIndex++}`;
      queryParams.push(params.status);
    }

    if (params.startDate) {
      query += ` AND ap.due_date >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND ap.due_date <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    if (params.category) {
      query += ` AND ap.category = $${paramIndex++}`;
      queryParams.push(params.category);
    }

    // Get summary
    const summaryQuery = `
      SELECT 
        SUM(amount) as total,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as overdue,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid
      FROM (${query}) as subquery`;
    const summaryResult = await pool.query(summaryQuery, queryParams);

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as subquery`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY ap.due_date ASC`;
    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      queryParams.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      queryParams.push(params.offset);
    }

    const result = await pool.query(query, queryParams);

    return {
      accounts: result.rows,
      total,
      summary: summaryResult.rows[0],
    };
  }

  /**
   * Pay an account payable
   */
  async payAccountPayable(id: string, paymentData: {
    paymentDate: Date;
    paymentMethod: string;
    referenceNumber?: string;
    notes?: string;
  }): Promise<any> {
    const result = await pool.query(
      `UPDATE accounts_payable 
       SET status = 'paid', payment_date = $2, payment_method = $3, 
           reference_number = COALESCE($4, reference_number), 
           notes = COALESCE($5, notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, paymentData.paymentDate, paymentData.paymentMethod, paymentData.referenceNumber, paymentData.notes]
    );

    if (result.rows.length > 0) {
      // Record cash flow transaction
      await this.createCashFlowTransaction({
        branchId: result.rows[0].branch_id,
        type: 'expense',
        category: result.rows[0].category || 'Pagamentos',
        description: result.rows[0].description,
        amount: result.rows[0].amount,
        transactionDate: paymentData.paymentDate,
        paymentMethod: paymentData.paymentMethod,
        referenceId: id,
        referenceType: 'account_payable',
      });
    }

    return result.rows[0];
  }

  private async createRecurringPayables(original: any, endDate: Date): Promise<void> {
    const interval = this.getRecurrenceInterval(original.recurrence_type);
    let nextDate = new Date(original.due_date);
    
    while (nextDate <= endDate) {
      nextDate = new Date(nextDate.getTime() + interval);
      if (nextDate > endDate) break;

      await pool.query(
        `INSERT INTO accounts_payable (
          branch_id, vendor_id, description, category, amount, due_date,
          payment_method, notes, recurrence_type, parent_id, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          original.branch_id, original.vendor_id, original.description, original.category,
          original.amount, nextDate, original.payment_method, original.notes,
          original.recurrence_type, original.id, original.created_by,
        ]
      );
    }
  }

  private getRecurrenceInterval(type: string): number {
    const day = 24 * 60 * 60 * 1000;
    switch (type) {
      case 'weekly': return 7 * day;
      case 'monthly': return 30 * day;
      case 'quarterly': return 90 * day;
      case 'yearly': return 365 * day;
      default: return 30 * day;
    }
  }

  // ==========================================
  // ACCOUNTS RECEIVABLE
  // ==========================================

  /**
   * Create an account receivable entry
   */
  async createAccountReceivable(data: AccountReceivable, userId?: string): Promise<any> {
    const result = await pool.query(
      `INSERT INTO accounts_receivable (
        branch_id, customer_id, invoice_id, order_id, description, category,
        amount, due_date, payment_method, reference_number, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.branchId, data.customerId, data.invoiceId, data.orderId,
        data.description, data.category, data.amount, data.dueDate,
        data.paymentMethod, data.referenceNumber, data.notes, userId,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get accounts receivable with filters
   */
  async getAccountsReceivable(params: {
    branchId?: string;
    customerId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ accounts: any[]; total: number; summary: any }> {
    let query = `SELECT ar.*, c.name as customer_name, o.order_number
                 FROM accounts_receivable ar
                 LEFT JOIN customers c ON c.id = ar.customer_id
                 LEFT JOIN orders o ON o.id = ar.order_id
                 WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.branchId) {
      query += ` AND ar.branch_id = $${paramIndex++}`;
      queryParams.push(params.branchId);
    }

    if (params.customerId) {
      query += ` AND ar.customer_id = $${paramIndex++}`;
      queryParams.push(params.customerId);
    }

    if (params.status) {
      query += ` AND ar.status = $${paramIndex++}`;
      queryParams.push(params.status);
    }

    if (params.startDate) {
      query += ` AND ar.due_date >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND ar.due_date <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    // Get summary
    const summaryQuery = `
      SELECT 
        SUM(amount) as total,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as overdue,
        SUM(CASE WHEN status = 'received' THEN amount ELSE 0 END) as received
      FROM (${query}) as subquery`;
    const summaryResult = await pool.query(summaryQuery, queryParams);

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as subquery`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY ar.due_date ASC`;
    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      queryParams.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      queryParams.push(params.offset);
    }

    const result = await pool.query(query, queryParams);

    return {
      accounts: result.rows,
      total,
      summary: summaryResult.rows[0],
    };
  }

  /**
   * Receive payment for account receivable
   */
  async receivePayment(id: string, paymentData: {
    receivedDate: Date;
    paymentMethod: string;
    amount?: number;
    referenceNumber?: string;
    notes?: string;
  }): Promise<any> {
    const accountResult = await pool.query(`SELECT * FROM accounts_receivable WHERE id = $1`, [id]);
    if (accountResult.rows.length === 0) {
      throw new Error('Account receivable not found');
    }

    const account = accountResult.rows[0];
    const receivedAmount = paymentData.amount || account.amount;
    const newStatus = receivedAmount >= account.amount ? 'received' : 'partial';

    const result = await pool.query(
      `UPDATE accounts_receivable 
       SET status = $2, received_date = $3, payment_method = $4, 
           reference_number = COALESCE($5, reference_number), 
           notes = COALESCE($6, notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, newStatus, paymentData.receivedDate, paymentData.paymentMethod, paymentData.referenceNumber, paymentData.notes]
    );

    // Record cash flow transaction
    await this.createCashFlowTransaction({
      branchId: account.branch_id,
      type: 'income',
      category: account.category || 'Recebimentos',
      description: account.description,
      amount: receivedAmount,
      transactionDate: paymentData.receivedDate,
      paymentMethod: paymentData.paymentMethod,
      referenceId: id,
      referenceType: 'account_receivable',
    });

    return result.rows[0];
  }

  // ==========================================
  // CASH FLOW
  // ==========================================

  /**
   * Create cash flow transaction
   */
  async createCashFlowTransaction(data: CashFlowTransaction, userId?: string): Promise<any> {
    const result = await pool.query(
      `INSERT INTO cash_flow_transactions (
        branch_id, type, category, subcategory, description, amount,
        transaction_date, payment_method, reference_id, reference_type, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.branchId, data.type, data.category, data.subcategory, data.description,
        data.amount, data.transactionDate, data.paymentMethod,
        data.referenceId, data.referenceType, data.notes, userId,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get cash flow report
   */
  async getCashFlowReport(params: {
    branchId?: string;
    startDate: Date;
    endDate: Date;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<{
    transactions: any[];
    summary: {
      totalIncome: number;
      totalExpense: number;
      netCashFlow: number;
      byCategory: Record<string, number>;
    };
    chartData: any[];
  }> {
    let whereClause = `WHERE transaction_date >= $1 AND transaction_date <= $2`;
    const queryParams: any[] = [params.startDate, params.endDate];
    let paramIndex = 3;

    if (params.branchId) {
      whereClause += ` AND branch_id = $${paramIndex++}`;
      queryParams.push(params.branchId);
    }

    // Get all transactions
    const transactionsResult = await pool.query(
      `SELECT * FROM cash_flow_transactions ${whereClause} ORDER BY transaction_date DESC`,
      queryParams
    );

    // Get summary
    const summaryResult = await pool.query(
      `SELECT 
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
         category,
         type
       FROM cash_flow_transactions ${whereClause}
       GROUP BY category, type`,
      queryParams
    );

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory: Record<string, number> = {};

    for (const row of summaryResult.rows) {
      totalIncome += parseFloat(row.total_income || 0);
      totalExpense += parseFloat(row.total_expense || 0);

      const categoryKey = `${row.type}_${row.category}`;
      byCategory[categoryKey] = (byCategory[categoryKey] || 0) + 
        parseFloat(row.type === 'income' ? row.total_income : row.total_expense);
    }

    // Get chart data grouped by time period
    const dateFormat = params.groupBy === 'month' ? 'YYYY-MM' : 
                       params.groupBy === 'week' ? 'IYYY-IW' : 'YYYY-MM-DD';
    
    const chartResult = await pool.query(
      `SELECT 
         TO_CHAR(transaction_date, '${dateFormat}') as period,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
       FROM cash_flow_transactions ${whereClause}
       GROUP BY period
       ORDER BY period`,
      queryParams
    );

    return {
      transactions: transactionsResult.rows,
      summary: {
        totalIncome,
        totalExpense,
        netCashFlow: totalIncome - totalExpense,
        byCategory,
      },
      chartData: chartResult.rows.map(row => ({
        period: row.period,
        income: parseFloat(row.income || 0),
        expense: parseFloat(row.expense || 0),
        net: parseFloat(row.income || 0) - parseFloat(row.expense || 0),
      })),
    };
  }

  // ==========================================
  // BANK ACCOUNTS
  // ==========================================

  /**
   * Create bank account
   */
  async createBankAccount(data: {
    branchId: string;
    name: string;
    bankName?: string;
    accountNumber?: string;
    agency?: string;
    accountType?: string;
    initialBalance?: number;
    isDefault?: boolean;
  }): Promise<any> {
    const result = await pool.query(
      `INSERT INTO bank_accounts (
        branch_id, name, bank_name, account_number, agency,
        account_type, initial_balance, current_balance, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8)
      RETURNING *`,
      [
        data.branchId, data.name, data.bankName, data.accountNumber,
        data.agency, data.accountType, data.initialBalance || 0, data.isDefault || false,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get bank accounts
   */
  async getBankAccounts(branchId: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT * FROM bank_accounts WHERE branch_id = $1 AND is_active = true ORDER BY name`,
      [branchId]
    );
    return result.rows;
  }

  /**
   * Update bank account balance
   */
  async updateBankBalance(accountId: string, amount: number, type: 'add' | 'subtract'): Promise<any> {
    const operator = type === 'add' ? '+' : '-';
    const result = await pool.query(
      `UPDATE bank_accounts 
       SET current_balance = current_balance ${operator} $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [accountId, Math.abs(amount)]
    );
    return result.rows[0];
  }

  // ==========================================
  // FINANCIAL CATEGORIES
  // ==========================================

  /**
   * Get financial categories
   */
  async getCategories(type?: 'income' | 'expense'): Promise<any[]> {
    let query = `SELECT * FROM financial_categories WHERE is_active = true`;
    const params: any[] = [];

    if (type) {
      query += ` AND type = $1`;
      params.push(type);
    }

    query += ` ORDER BY name`;
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Create financial category
   */
  async createCategory(data: {
    name: string;
    type: 'income' | 'expense';
    parentId?: string;
    color?: string;
    icon?: string;
  }): Promise<any> {
    const result = await pool.query(
      `INSERT INTO financial_categories (name, type, parent_id, color, icon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, data.type, data.parentId, data.color, data.icon]
    );
    return result.rows[0];
  }

  // ==========================================
  // UPDATE OVERDUE STATUS
  // ==========================================

  /**
   * Update overdue status for accounts (run daily via cron)
   */
  async updateOverdueStatus(): Promise<{ payableUpdated: number; receivableUpdated: number }> {
    const today = new Date();

    const payableResult = await pool.query(
      `UPDATE accounts_payable 
       SET status = 'overdue', updated_at = CURRENT_TIMESTAMP
       WHERE status = 'pending' AND due_date < $1
       RETURNING id`,
      [today]
    );

    const receivableResult = await pool.query(
      `UPDATE accounts_receivable 
       SET status = 'overdue', updated_at = CURRENT_TIMESTAMP
       WHERE status = 'pending' AND due_date < $1
       RETURNING id`,
      [today]
    );

    return {
      payableUpdated: payableResult.rowCount || 0,
      receivableUpdated: receivableResult.rowCount || 0,
    };
  }
}

export const financialService = new FinancialService();
export default financialService;
