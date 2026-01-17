import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { smsService } from '../services/smsService.js';

/**
 * Send SMS to a customer
 */
export const sendSMS = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, phone, message } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    let phoneNumber = phone;

    // If customer_id is provided, get phone from customer
    if (customer_id && !phone) {
      const customerResult = await pool.query(
        'SELECT phone, name FROM customers WHERE id = $1',
        [customer_id]
      );

      if (customerResult.rows.length === 0) {
        throw new AppError('Customer not found', 404);
      }

      phoneNumber = customerResult.rows[0].phone;
    }

    if (!phoneNumber) {
      throw new AppError('Phone number is required', 400);
    }

    await smsService.sendSMS({
      to: phoneNumber,
      message,
    });

    res.json({ message: 'SMS sent successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Send SMS to multiple customers
 */
export const sendBulkSMS = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_ids, message } = req.body;

    if (!customer_ids || !Array.isArray(customer_ids) || customer_ids.length === 0) {
      throw new AppError('Customer IDs array is required', 400);
    }

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    const customersResult = await pool.query(
      `SELECT id, name, phone FROM customers WHERE id = ANY($1::uuid[])`,
      [customer_ids]
    );

    const results = await Promise.allSettled(
      customersResult.rows.map((customer) =>
        smsService.sendSMS({
          to: customer.phone,
          message: customer.name ? `Olá ${customer.name}! ${message}` : message,
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    res.json({
      message: `SMS sent to ${successful} customers`,
      successful,
      failed,
      total: customer_ids.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send promotional SMS to customers by category
 */
export const sendPromotionalSMS = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, message } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    let query = 'SELECT id, name, phone FROM customers WHERE is_active = true';
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    const customersResult = await pool.query(query, params);

    const results = await Promise.allSettled(
      customersResult.rows.map((customer) =>
        smsService.sendPromotionalSMS(customer.phone, message, customer.name)
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    res.json({
      message: `Promotional SMS sent to ${successful} customers`,
      successful,
      failed,
      total: customersResult.rows.length,
    });
  } catch (error) {
    next(error);
  }
};
