import pool from '../config/database.js';

// TEF (Transferência Eletrônica de Fundos) Types
export interface TEFPaymentRequest {
  terminalId: string;
  amount: number; // in cents
  paymentType: 'credit' | 'debit' | 'voucher' | 'pix';
  installments?: number;
  orderId?: string;
  invoiceId?: string;
}

export interface TEFPaymentResponse {
  success: boolean;
  transactionId?: string;
  nsu?: string;
  authorizationCode?: string;
  cardBrand?: string;
  cardLastDigits?: string;
  receiptCustomer?: string;
  receiptMerchant?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface TEFTerminal {
  id: string;
  branchId: string;
  terminalId: string;
  provider: string;
  name: string;
  status: string;
  ipAddress?: string;
  port?: number;
}

// Mock TEF Provider for development
class MockTEFProvider {
  async initiatePayment(request: TEFPaymentRequest): Promise<TEFPaymentResponse> {
    // Simulate TEF transaction
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    const success = Math.random() > 0.1; // 90% success rate
    const nsu = String(Date.now()).slice(-12);
    const authCode = String(Math.floor(Math.random() * 999999)).padStart(6, '0');

    if (success) {
      console.log('💳 [MOCK TEF] Payment approved:', {
        amount: request.amount,
        type: request.paymentType,
        nsu,
      });

      return {
        success: true,
        transactionId: `TEF-${Date.now()}`,
        nsu,
        authorizationCode: authCode,
        cardBrand: ['VISA', 'MASTERCARD', 'ELO', 'AMEX'][Math.floor(Math.random() * 4)],
        cardLastDigits: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        receiptCustomer: this.generateReceipt('customer', request, nsu, authCode),
        receiptMerchant: this.generateReceipt('merchant', request, nsu, authCode),
      };
    } else {
      return {
        success: false,
        errorCode: 'DECLINED',
        errorMessage: 'Transação não autorizada pelo emissor',
      };
    }
  }

  async cancelTransaction(nsu: string): Promise<TEFPaymentResponse> {
    console.log('❌ [MOCK TEF] Transaction cancelled:', nsu);
    return {
      success: true,
      transactionId: `TEF-CANCEL-${Date.now()}`,
      nsu: String(Date.now()).slice(-12),
    };
  }

  async checkStatus(terminalId: string): Promise<{ online: boolean; lastPing: Date }> {
    return {
      online: true,
      lastPing: new Date(),
    };
  }

  private generateReceipt(type: 'customer' | 'merchant', request: TEFPaymentRequest, nsu: string, authCode: string): string {
    const header = type === 'customer' ? 'VIA CLIENTE' : 'VIA ESTABELECIMENTO';
    const amount = (request.amount / 100).toFixed(2);
    
    return `
========================================
              LAVATEC
            ${header}
========================================
DATA: ${new Date().toLocaleDateString('pt-BR')}
HORA: ${new Date().toLocaleTimeString('pt-BR')}

TIPO: ${request.paymentType.toUpperCase()}
${request.installments && request.installments > 1 ? `PARCELAS: ${request.installments}x` : 'À VISTA'}

VALOR: R$ ${amount}

NSU: ${nsu}
AUTORIZAÇÃO: ${authCode}

========================================
        TRANSAÇÃO APROVADA
========================================
    `.trim();
  }
}

// SiTef Integration (real TEF provider)
class SiTefProvider {
  private serverIp: string;
  private storeId: string;
  private terminalId: string;

  constructor() {
    this.serverIp = process.env.SITEF_SERVER_IP || '127.0.0.1';
    this.storeId = process.env.SITEF_STORE_ID || '00000000';
    this.terminalId = process.env.SITEF_TERMINAL_ID || '00000001';
  }

  async initiatePayment(request: TEFPaymentRequest): Promise<TEFPaymentResponse> {
    // In production, this would communicate with SiTef server
    // SiTef uses a proprietary protocol over TCP/IP
    console.log('💳 [SiTef] Initiating payment...');
    
    // For now, fall back to mock
    const mockProvider = new MockTEFProvider();
    return mockProvider.initiatePayment(request);
  }

  async cancelTransaction(nsu: string): Promise<TEFPaymentResponse> {
    const mockProvider = new MockTEFProvider();
    return mockProvider.cancelTransaction(nsu);
  }

  async checkStatus(terminalId: string): Promise<{ online: boolean; lastPing: Date }> {
    return { online: true, lastPing: new Date() };
  }
}

// Stone TEF Integration
class StoneTEFProvider {
  private stoneCode: string;

  constructor() {
    this.stoneCode = process.env.STONE_CODE || '';
  }

  async initiatePayment(request: TEFPaymentRequest): Promise<TEFPaymentResponse> {
    console.log('💳 [Stone TEF] Initiating payment...');
    
    // For now, fall back to mock
    const mockProvider = new MockTEFProvider();
    return mockProvider.initiatePayment(request);
  }

  async cancelTransaction(nsu: string): Promise<TEFPaymentResponse> {
    const mockProvider = new MockTEFProvider();
    return mockProvider.cancelTransaction(nsu);
  }

  async checkStatus(terminalId: string): Promise<{ online: boolean; lastPing: Date }> {
    return { online: true, lastPing: new Date() };
  }
}

// Main TEF Service
class TEFService {
  private providers: Map<string, MockTEFProvider | SiTefProvider | StoneTEFProvider> = new Map();

  constructor() {
    // Initialize default mock provider
    this.providers.set('mock', new MockTEFProvider());
    this.providers.set('sitef', new SiTefProvider());
    this.providers.set('stone', new StoneTEFProvider());
  }

  private getProvider(providerName: string): MockTEFProvider | SiTefProvider | StoneTEFProvider {
    return this.providers.get(providerName.toLowerCase()) || this.providers.get('mock')!;
  }

  /**
   * Register a TEF terminal
   */
  async registerTerminal(params: {
    branchId: string;
    terminalId: string;
    provider: string;
    name: string;
    serialNumber?: string;
    model?: string;
    ipAddress?: string;
    port?: number;
  }): Promise<TEFTerminal> {
    const result = await pool.query(
      `INSERT INTO tef_terminals (
        branch_id, terminal_id, provider, name, serial_number, model, ip_address, port
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (branch_id, terminal_id) DO UPDATE SET
        provider = EXCLUDED.provider,
        name = EXCLUDED.name,
        serial_number = EXCLUDED.serial_number,
        model = EXCLUDED.model,
        ip_address = EXCLUDED.ip_address,
        port = EXCLUDED.port,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        params.branchId, params.terminalId, params.provider, params.name,
        params.serialNumber, params.model, params.ipAddress, params.port,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get terminals for a branch
   */
  async getTerminals(branchId: string): Promise<TEFTerminal[]> {
    const result = await pool.query(
      `SELECT * FROM tef_terminals WHERE branch_id = $1 AND status = 'active'`,
      [branchId]
    );
    return result.rows;
  }

  /**
   * Get terminal by ID
   */
  async getTerminal(terminalDbId: string): Promise<TEFTerminal | null> {
    const result = await pool.query(
      `SELECT * FROM tef_terminals WHERE id = $1`,
      [terminalDbId]
    );
    return result.rows[0] || null;
  }

  /**
   * Process a TEF payment
   */
  async processPayment(request: TEFPaymentRequest & { orderId?: string; invoiceId?: string }): Promise<TEFPaymentResponse & { transactionDbId?: string }> {
    // Get terminal info
    const terminalResult = await pool.query(
      `SELECT * FROM tef_terminals WHERE id = $1`,
      [request.terminalId]
    );

    if (terminalResult.rows.length === 0) {
      throw new Error('Terminal not found');
    }

    const terminal = terminalResult.rows[0];
    const provider = this.getProvider(terminal.provider);

    // Process payment via provider
    const response = await provider.initiatePayment(request);

    // Store transaction in database
    const transactionResult = await pool.query(
      `INSERT INTO tef_transactions (
        terminal_id, order_id, invoice_id, type, payment_type, amount,
        installments, status, nsu, authorization_code, card_brand,
        card_last_digits, receipt_customer, receipt_merchant,
        error_code, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        request.terminalId, request.orderId, request.invoiceId,
        'payment', request.paymentType, request.amount,
        request.installments || 1, response.success ? 'approved' : 'denied',
        response.nsu, response.authorizationCode, response.cardBrand,
        response.cardLastDigits, response.receiptCustomer, response.receiptMerchant,
        response.errorCode, response.errorMessage,
      ]
    );

    // If successful, update invoice/order payment status
    if (response.success) {
      if (request.invoiceId) {
        await pool.query(
          `UPDATE invoices 
           SET payment_status = 'paid', payment_method = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [request.invoiceId, `${request.paymentType}_tef`]
        );
      }

      if (request.orderId) {
        await pool.query(
          `UPDATE orders 
           SET payment_status = 'paid', payment_method = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [request.orderId, `${request.paymentType}_tef`]
        );
      }
    }

    return {
      ...response,
      transactionDbId: transactionResult.rows[0].id,
    };
  }

  /**
   * Cancel a TEF transaction
   */
  async cancelTransaction(transactionId: string): Promise<TEFPaymentResponse> {
    // Get original transaction
    const transactionResult = await pool.query(
      `SELECT t.*, tt.provider FROM tef_transactions t
       JOIN tef_terminals tt ON tt.id = t.terminal_id
       WHERE t.id = $1`,
      [transactionId]
    );

    if (transactionResult.rows.length === 0) {
      throw new Error('Transaction not found');
    }

    const transaction = transactionResult.rows[0];

    if (transaction.status !== 'approved') {
      throw new Error('Only approved transactions can be cancelled');
    }

    const provider = this.getProvider(transaction.provider);
    const response = await provider.cancelTransaction(transaction.nsu);

    if (response.success) {
      // Update original transaction
      await pool.query(
        `UPDATE tef_transactions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [transactionId]
      );

      // Store cancellation transaction
      await pool.query(
        `INSERT INTO tef_transactions (
          terminal_id, order_id, invoice_id, type, payment_type, amount,
          installments, status, nsu, authorization_code
        ) VALUES ($1, $2, $3, 'cancellation', $4, $5, $6, 'approved', $7, $8)`,
        [
          transaction.terminal_id, transaction.order_id, transaction.invoice_id,
          transaction.payment_type, transaction.amount, transaction.installments,
          response.nsu, response.authorizationCode,
        ]
      );
    }

    return response;
  }

  /**
   * Get transaction history
   */
  async getTransactions(params: {
    terminalId?: string;
    branchId?: string;
    orderId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: any[]; total: number }> {
    let query = `SELECT t.*, tt.name as terminal_name, tt.terminal_id as terminal_code
                 FROM tef_transactions t
                 JOIN tef_terminals tt ON tt.id = t.terminal_id
                 WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.terminalId) {
      query += ` AND t.terminal_id = $${paramIndex++}`;
      queryParams.push(params.terminalId);
    }

    if (params.branchId) {
      query += ` AND tt.branch_id = $${paramIndex++}`;
      queryParams.push(params.branchId);
    }

    if (params.orderId) {
      query += ` AND t.order_id = $${paramIndex++}`;
      queryParams.push(params.orderId);
    }

    if (params.status) {
      query += ` AND t.status = $${paramIndex++}`;
      queryParams.push(params.status);
    }

    if (params.startDate) {
      query += ` AND t.transaction_date >= $${paramIndex++}`;
      queryParams.push(params.startDate);
    }

    if (params.endDate) {
      query += ` AND t.transaction_date <= $${paramIndex++}`;
      queryParams.push(params.endDate);
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as subquery`,
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY t.transaction_date DESC`;
    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      queryParams.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      queryParams.push(params.offset);
    }

    const result = await pool.query(query, queryParams);

    return { transactions: result.rows, total };
  }

  /**
   * Check terminal status
   */
  async checkTerminalStatus(terminalDbId: string): Promise<{ online: boolean; lastPing: Date }> {
    const terminal = await this.getTerminal(terminalDbId);
    if (!terminal) {
      throw new Error('Terminal not found');
    }

    const provider = this.getProvider(terminal.provider);
    const status = await provider.checkStatus(terminal.terminalId);

    // Update last ping
    await pool.query(
      `UPDATE tef_terminals SET last_ping = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [terminalDbId, status.lastPing]
    );

    return status;
  }

  /**
   * Get daily TEF summary
   */
  async getDailySummary(branchId: string, date: Date): Promise<{
    totalTransactions: number;
    totalAmount: number;
    approvedTransactions: number;
    approvedAmount: number;
    deniedTransactions: number;
    byPaymentType: Record<string, { count: number; amount: number }>;
    byCardBrand: Record<string, { count: number; amount: number }>;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_transactions,
         SUM(amount) as total_amount,
         COUNT(*) FILTER (WHERE status = 'approved') as approved_transactions,
         SUM(amount) FILTER (WHERE status = 'approved') as approved_amount,
         COUNT(*) FILTER (WHERE status = 'denied') as denied_transactions,
         payment_type,
         card_brand
       FROM tef_transactions t
       JOIN tef_terminals tt ON tt.id = t.terminal_id
       WHERE tt.branch_id = $1
         AND t.transaction_date >= $2
         AND t.transaction_date <= $3
         AND t.type = 'payment'
       GROUP BY payment_type, card_brand`,
      [branchId, startOfDay, endOfDay]
    );

    const summary = {
      totalTransactions: 0,
      totalAmount: 0,
      approvedTransactions: 0,
      approvedAmount: 0,
      deniedTransactions: 0,
      byPaymentType: {} as Record<string, { count: number; amount: number }>,
      byCardBrand: {} as Record<string, { count: number; amount: number }>,
    };

    for (const row of result.rows) {
      summary.totalTransactions += parseInt(row.total_transactions);
      summary.totalAmount += parseInt(row.total_amount || 0);
      summary.approvedTransactions += parseInt(row.approved_transactions);
      summary.approvedAmount += parseInt(row.approved_amount || 0);
      summary.deniedTransactions += parseInt(row.denied_transactions);

      if (row.payment_type) {
        if (!summary.byPaymentType[row.payment_type]) {
          summary.byPaymentType[row.payment_type] = { count: 0, amount: 0 };
        }
        summary.byPaymentType[row.payment_type].count += parseInt(row.approved_transactions);
        summary.byPaymentType[row.payment_type].amount += parseInt(row.approved_amount || 0);
      }

      if (row.card_brand) {
        if (!summary.byCardBrand[row.card_brand]) {
          summary.byCardBrand[row.card_brand] = { count: 0, amount: 0 };
        }
        summary.byCardBrand[row.card_brand].count += parseInt(row.approved_transactions);
        summary.byCardBrand[row.card_brand].amount += parseInt(row.approved_amount || 0);
      }
    }

    return summary;
  }
}

export const tefService = new TEFService();
export default tefService;
