import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPromotions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM promotions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);
    res.json({ promotions: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getPromotionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM promotions WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Promotion not found', 404);
    }

    res.json({ promotion: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      discount_type,
      discount_value,
      trigger,
      coupon_code,
      rules,
      max_usage_count,
      max_usage_per_customer,
      minimum_order_value,
      start_date,
      end_date,
      status = 'active',
      applicable_customer_types,
      excluded_services,
      stackable = false,
    } = req.body;

    if (!name || !discount_type || !discount_value || !trigger || !start_date) {
      throw new AppError('Name, discount type, discount value, trigger, and start date are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO promotions (
        name, description, discount_type, discount_value, trigger, coupon_code,
        rules, max_usage_count, max_usage_per_customer, minimum_order_value,
        start_date, end_date, status, applicable_customer_types,
        excluded_services, stackable
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        name,
        description,
        discount_type,
        discount_value,
        trigger,
        coupon_code,
        JSON.stringify(rules || []),
        max_usage_count,
        max_usage_per_customer,
        minimum_order_value,
        start_date,
        end_date,
        status,
        applicable_customer_types || [],
        excluded_services || [],
        stackable,
      ]
    );

    res.status(201).json({ promotion: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updatePromotion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'name',
      'description',
      'status',
      'end_date',
      'max_usage_count',
      'max_usage_per_customer',
    ];

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
      `UPDATE promotions SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Promotion not found', 404);
    }

    res.json({ promotion: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

