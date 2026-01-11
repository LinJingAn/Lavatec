import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const generateTrackingNumber = (): string => {
  const prefix = 'DEL';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const getDeliveries = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, orderId, customerId, driverId, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT d.*, 
             o.order_number,
             c.name as customer_name,
             dr.name as driver_name
      FROM deliveries d
      LEFT JOIN orders o ON d.order_id = o.id
      LEFT JOIN customers c ON d.customer_id = c.id
      LEFT JOIN delivery_drivers dr ON d.driver_id = dr.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND d.status = $${paramCount}`;
      params.push(status);
    }

    if (orderId) {
      paramCount++;
      query += ` AND d.order_id = $${paramCount}`;
      params.push(orderId);
    }

    if (customerId) {
      paramCount++;
      query += ` AND d.customer_id = $${paramCount}`;
      params.push(customerId);
    }

    if (driverId) {
      paramCount++;
      query += ` AND d.driver_id = $${paramCount}`;
      params.push(driverId);
    }

    query += ` ORDER BY d.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);
    res.json({ deliveries: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Delivery not found', 404);
    }

    res.json({ delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createDelivery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      order_id,
      customer_id,
      method,
      scheduled_date,
      time_slot_start,
      time_slot_end,
      address_id,
      items,
      special_instructions,
    } = req.body;

    if (!order_id || !customer_id || !method || !scheduled_date) {
      throw new AppError('Order, customer, method, and scheduled date are required', 400);
    }

    const trackingNumber = generateTrackingNumber();

    const result = await pool.query(
      `INSERT INTO deliveries (
        order_id, customer_id, method, status, scheduled_date,
        time_slot_start, time_slot_end, address_id, tracking_number,
        items, special_instructions, status_history
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        order_id,
        customer_id,
        method,
        'pending',
        scheduled_date,
        time_slot_start,
        time_slot_end,
        address_id,
        trackingNumber,
        JSON.stringify(items || []),
        special_instructions,
        JSON.stringify([{ status: 'pending', timestamp: new Date() }]),
      ]
    );

    res.status(201).json({ delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      throw new AppError('Status is required', 400);
    }

    const deliveryResult = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    if (deliveryResult.rows.length === 0) {
      throw new AppError('Delivery not found', 404);
    }

    const delivery = deliveryResult.rows[0];
    const statusHistory = Array.isArray(delivery.status_history)
      ? delivery.status_history
      : JSON.parse(delivery.status_history || '[]');

    statusHistory.push({
      status,
      timestamp: new Date(),
      notes,
    });

    const result = await pool.query(
      `UPDATE deliveries 
       SET status = $1, status_history = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, JSON.stringify(statusHistory), id]
    );

    res.json({ delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const assignDriver = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;

    if (!driver_id) {
      throw new AppError('Driver ID is required', 400);
    }

    const result = await pool.query(
      `UPDATE deliveries 
       SET driver_id = $1, status = 'assigned', updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [driver_id, id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Delivery not found', 404);
    }

    res.json({ delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
