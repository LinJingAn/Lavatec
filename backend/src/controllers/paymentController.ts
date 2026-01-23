import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const getFrontendBaseUrl = (): string => {
  // Used only to generate hosted payment links for Step 1.
  // In production, set FRONTEND_URL (e.g., https://app.example.com).
  return process.env.FRONTEND_URL || 'http://localhost:3000';
};

export const createPaymentSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { invoice_id, amount, currency = 'BRL', provider = 'manual', expires_in_hours = 72, metadata = {} } = req.body;

    if (!invoice_id) {
      throw new AppError('invoice_id is required', 400);
    }

    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoice_id]);
    if (invoiceResult.rows.length === 0) {
      throw new AppError('Invoice not found', 404);
    }

    const invoice = invoiceResult.rows[0];
    const invoiceBalance = parseFloat(invoice.balance ?? invoice.total);
    const sessionAmount = amount ? parseFloat(amount) : invoiceBalance;

    if (!Number.isFinite(sessionAmount) || sessionAmount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }

    const expiresAt = new Date(Date.now() + Number(expires_in_hours) * 60 * 60 * 1000);
    const insertResult = await pool.query(
      `INSERT INTO payment_sessions (
         invoice_id, order_id, customer_id, provider, status, amount, currency, payment_url, expires_at, metadata
       ) VALUES (
         $1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9
       ) RETURNING *`,
      [
        invoice_id,
        invoice.order_id,
        invoice.customer_id,
        provider,
        sessionAmount,
        currency,
        'TEMP',
        expiresAt,
        metadata,
      ]
    );

    const session = insertResult.rows[0];
    const paymentUrl = `${getFrontendBaseUrl()}/pay/${session.id}`;

    const updated = await pool.query(
      `UPDATE payment_sessions
       SET payment_url = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [paymentUrl, session.id]
    );

    res.status(201).json({ payment_session: updated.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const getPaymentSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ps.*, i.invoice_number, i.status as invoice_status, i.balance as invoice_balance
       FROM payment_sessions ps
       JOIN invoices i ON i.id = ps.invoice_id
       WHERE ps.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Payment session not found', 404);
    }

    res.json({ payment_session: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const markPaymentSessionPaid = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reference, notes, payment_method = 'online_link', amount } = req.body;

    const sessionResult = await pool.query('SELECT * FROM payment_sessions WHERE id = $1', [id]);
    if (sessionResult.rows.length === 0) {
      throw new AppError('Payment session not found', 404);
    }

    const session = sessionResult.rows[0];
    if (session.status === 'paid') {
      res.json({ message: 'Payment session already marked as paid' });
      return;
    }

    const invoiceId = session.invoice_id;
    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
    if (invoiceResult.rows.length === 0) {
      throw new AppError('Invoice not found', 404);
    }

    const invoice = invoiceResult.rows[0];
    const payAmount = amount ? parseFloat(amount) : parseFloat(session.amount);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }

    const newPaidAmount = parseFloat(invoice.paid_amount) + payAmount;
    const newBalance = parseFloat(invoice.total) - newPaidAmount;
    const newStatus = newBalance <= 0 ? 'paid' : newPaidAmount > 0 ? 'partially_paid' : invoice.status;

    await pool.query(
      `INSERT INTO invoice_payments (
         invoice_id, amount, payment_method, payment_date, reference, notes
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [invoiceId, payAmount, payment_method, new Date(), reference, notes]
    );

    await pool.query(
      `UPDATE invoices
       SET paid_amount = $1, balance = $2, status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [newPaidAmount, newBalance, newStatus, invoiceId]
    );

    await pool.query(
      `UPDATE payment_sessions
       SET status = 'paid', provider_reference = COALESCE($1, provider_reference), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [reference, id]
    );

    res.json({ message: 'Payment marked as paid', invoice_status: newStatus, invoice_balance: newBalance });
  } catch (error) {
    next(error);
  }
};
