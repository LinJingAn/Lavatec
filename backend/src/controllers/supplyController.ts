import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getSupplies = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM supplies WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY name LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);
    res.json({ supplies: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getSupplyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM supplies WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Supply not found', 404);
    }

    res.json({ supply: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createSupply = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      category,
      unit,
      current_stock = 0,
      min_stock_level = 0,
      max_stock_level,
      unit_cost,
      supplier_id,
      description,
    } = req.body;

    if (!name || !unit) {
      throw new AppError('Name and unit are required', 400);
    }

    const status = current_stock <= min_stock_level ? 'low_stock' : 'in_stock';

    const result = await pool.query(
      `INSERT INTO supplies (
        name, category, unit, current_stock, min_stock_level,
        max_stock_level, unit_cost, supplier_id, status, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        name,
        category,
        unit,
        current_stock,
        min_stock_level,
        max_stock_level,
        unit_cost,
        supplier_id,
        status,
        description,
      ]
    );

    res.status(201).json({ supply: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateSupply = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'name',
      'category',
      'unit',
      'current_stock',
      'min_stock_level',
      'max_stock_level',
      'unit_cost',
      'supplier_id',
      'description',
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

    if (updates.current_stock !== undefined) {
      const supplyResult = await pool.query('SELECT min_stock_level FROM supplies WHERE id = $1', [id]);
      const minLevel = supplyResult.rows[0]?.min_stock_level || 0;
      const status = updates.current_stock <= minLevel ? 'low_stock' : 'in_stock';
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE supplies SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Supply not found', 404);
    }

    res.json({ supply: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
