import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const generateInvoiceNumber = (): string => {
  return `INV-${Date.now()}`;
};

export const getInvoices = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, customerId, orderId, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT i.*, 
             c.name as customer_name, c.email as customer_email,
             o.order_number
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN orders o ON i.order_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND i.status = $${paramCount}`;
      params.push(status);
    }

    if (customerId) {
      paramCount++;
      query += ` AND i.customer_id = $${paramCount}`;
      params.push(customerId);
    }

    if (orderId) {
      paramCount++;
      query += ` AND i.order_id = $${paramCount}`;
      params.push(orderId);
    }

    query += ` ORDER BY i.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    const invoicesWithDetails = await Promise.all(
      result.rows.map(async (invoice) => {
        const [itemsResult, paymentsResult] = await Promise.all([
          pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [invoice.id]),
          pool.query('SELECT * FROM invoice_payments WHERE invoice_id = $1 ORDER BY payment_date DESC', [invoice.id]),
        ]);
        return {
          ...invoice,
          items: itemsResult.rows,
          payments: paymentsResult.rows,
        };
      })
    );

    res.json({ invoices: invoicesWithDetails });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);

    if (invoiceResult.rows.length === 0) {
      throw new AppError('Invoice not found', 404);
    }

    const invoice = invoiceResult.rows[0];

    const [itemsResult, paymentsResult] = await Promise.all([
      pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]),
      pool.query('SELECT * FROM invoice_payments WHERE invoice_id = $1 ORDER BY payment_date DESC', [id]),
    ]);

    res.json({
      ...invoice,
      items: itemsResult.rows,
      payments: paymentsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      order_id,
      customer_id,
      items,
      due_date,
      payment_terms,
      currency = 'USD',
      company_name,
      company_address,
      company_tax_id,
    } = req.body;

    if (!order_id || !customer_id || !items || items.length === 0 || !due_date) {
      throw new AppError('Order, customer, items, and due date are required', 400);
    }

    const invoiceNumber = generateInvoiceNumber();

    let subtotal = 0;
    let tax = 0;
    items.forEach((item: any) => {
      item.subtotal = item.quantity * item.unit_price;
      item.tax = item.subtotal * 0.1;
      item.total = item.subtotal + item.tax;
      subtotal += item.subtotal;
      tax += item.tax;
    });

    const total = subtotal + tax;
    const balance = total;

    const now = new Date();
    const fiscalYear = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const accountingPeriod = `${fiscalYear}-${month}`;

    const invoiceResult = await pool.query(
      `INSERT INTO invoices (
        invoice_number, order_id, customer_id, status,
        subtotal, tax, total, paid_amount, balance,
        due_date, payment_terms, currency,
        fiscal_year, accounting_period, tax_category, reconciliation_status,
        company_name, company_address, company_tax_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        invoiceNumber,
        order_id,
        customer_id,
        'draft',
        subtotal,
        tax,
        total,
        0,
        balance,
        due_date,
        payment_terms,
        currency,
        fiscalYear,
        accountingPeriod,
        'standard',
        'pending',
        company_name,
        company_address,
        company_tax_id,
      ]
    );

    const invoice = invoiceResult.rows[0];

    const invoiceItems = await Promise.all(
      items.map((item: any) =>
        pool.query(
          `INSERT INTO invoice_items (
            invoice_id, description, quantity, unit_price,
            subtotal, tax, total, order_id, order_item_id,
            account_code, tax_code
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *`,
          [
            invoice.id,
            item.description,
            item.quantity,
            item.unit_price,
            item.subtotal,
            item.tax,
            item.total,
            item.order_id,
            item.order_item_id,
            item.account_code || '4000',
            item.tax_code || 'T1',
          ]
        )
      )
    );

    res.status(201).json({
      invoice: { ...invoice, items: invoiceItems.map((r) => r.rows[0]) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['status', 'notes', 'payment_terms', 'due_date'];

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        paramCount++;
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE invoices SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Invoice not found', 404);
    }

    res.json({ invoice: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const addPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, payment_method, payment_date, reference, notes } = req.body;

    if (!amount || !payment_method || !payment_date) {
      throw new AppError('Amount, payment method, and payment date are required', 400);
    }

    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invoiceResult.rows.length === 0) {
      throw new AppError('Invoice not found', 404);
    }

    const invoice = invoiceResult.rows[0];
    const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(amount);
    const newBalance = parseFloat(invoice.total) - newPaidAmount;

    await pool.query(
      `INSERT INTO invoice_payments (
        invoice_id, amount, payment_method, payment_date, reference, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, amount, payment_method, payment_date, reference, notes]
    );

    const newStatus =
      newBalance <= 0 ? 'paid' : newPaidAmount > 0 ? 'partially_paid' : invoice.status;

    await pool.query(
      `UPDATE invoices 
       SET paid_amount = $1, balance = $2, status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [newPaidAmount, newBalance, newStatus, id]
    );

    res.json({ message: 'Payment added successfully' });
  } catch (error) {
    next(error);
  }
};
