import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getCustomers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, category, isActive, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (isActive !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      params.push(isActive === 'true');
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM customers');

    res.json({
      customers: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );

    if (customerResult.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    const customer = customerResult.rows[0];

    const [addresses, preferences, notes, communicationLogs] = await Promise.all([
      pool.query('SELECT * FROM customer_addresses WHERE customer_id = $1', [id]),
      pool.query('SELECT * FROM customer_washing_preferences WHERE customer_id = $1', [id]),
      pool.query('SELECT * FROM customer_notes WHERE customer_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM customer_communication_logs WHERE customer_id = $1 ORDER BY created_at DESC', [id]),
    ]);

    res.json({
      ...customer,
      addresses: addresses.rows,
      washingPreferences: preferences.rows[0] || null,
      notes: notes.rows,
      communicationLogs: communicationLogs.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
      category = 'regular',
      birthdate,
      gender,
      tax_id,
      referred_by,
    } = req.body;

    if (!name || !phone) {
      throw new AppError('Name and phone are required', 400);
    }

    const result = await pool.query(
      `INSERT INTO customers (
        name, email, phone, address, city, state, zip_code, category,
        birthdate, gender, tax_id, referred_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [name, email, phone, address, city, state, zip_code, category, birthdate, gender, tax_id, referred_by]
    );

    res.status(201).json({ customer: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'name', 'email', 'phone', 'address', 'city', 'state', 'zip_code',
      'category', 'birthdate', 'gender', 'tax_id', 'referred_by',
      'loyalty_points', 'profile_image_url', 'is_active'
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
      `UPDATE customers SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    res.json({ customer: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Customer not found', 404);
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

