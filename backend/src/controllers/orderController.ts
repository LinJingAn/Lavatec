import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { smsService } from '../services/smsService.js';
import { emailService } from '../services/emailService.js';

const generateOrderNumber = (branchPrefix: string = 'LVT'): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${branchPrefix}-${dateStr}-${randomPart}`;
};

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, customerId, branchId, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT o.*, 
             c.name as customer_name, c.phone as customer_phone,
             b.name as branch_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN branches b ON o.branch_id = b.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    if (customerId) {
      paramCount++;
      query += ` AND o.customer_id = $${paramCount}`;
      params.push(customerId);
    }

    if (branchId) {
      paramCount++;
      query += ` AND o.branch_id = $${paramCount}`;
      params.push(branchId);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    const ordersWithItems = await Promise.all(
      result.rows.map(async (order) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    res.json({ orders: ordersWithItems });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT o.*, 
              c.name as customer_name, c.phone as customer_phone,
              b.name as branch_name
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN branches b ON o.branch_id = b.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    const timelineResult = await pool.query(
      'SELECT * FROM order_timeline_events WHERE order_id = $1 ORDER BY created_at ASC',
      [id]
    );

    res.json({
      ...order,
      items: itemsResult.rows,
      timelineEvents: timelineResult.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      branch_id,
      customer_id,
      promised_date,
      promised_time,
      items,
      notes,
      is_priority = false,
    } = req.body;

    if (!branch_id || !customer_id || !promised_date || !items || items.length === 0) {
      throw new AppError('Branch, customer, promised date, and items are required', 400);
    }

    const userId = req.userId!;
    const orderNumber = generateOrderNumber();

    let subtotal = 0;
    items.forEach((item: any) => {
      item.subtotal = item.quantity * item.unit_price;
      subtotal += item.subtotal;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const orderResult = await pool.query(
      `INSERT INTO orders (
        order_number, branch_id, customer_id, status, created_by,
        promised_date, promised_time, subtotal, tax, total,
        notes, is_priority, tracking_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        orderNumber,
        branch_id,
        customer_id,
        'new',
        userId,
        promised_date,
        promised_time,
        subtotal,
        tax,
        total,
        notes,
        is_priority,
        `TRK-${Date.now()}`,
      ]
    );

    const order = orderResult.rows[0];

    const orderItems = await Promise.all(
      items.map((item: any) =>
        pool.query(
          `INSERT INTO order_items (
            order_id, service_type_id, service_name, service_category,
            quantity, unit_price, subtotal, garment_type, special_instructions
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *`,
          [
            order.id,
            item.service_type_id,
            item.service_name,
            item.service_category,
            item.quantity,
            item.unit_price,
            item.subtotal,
            item.garment_type,
            item.special_instructions,
          ]
        )
      )
    );

    await pool.query(
      `INSERT INTO order_timeline_events (order_id, event_type, description, user_id)
       VALUES ($1, $2, $3, $4)`,
      [order.id, 'created', 'Order created', userId]
    );

    // Send notifications if enabled
    try {
      const customerResult = await pool.query(
        'SELECT name, phone, email FROM customers WHERE id = $1',
        [customer_id]
      );

      if (customerResult.rows.length > 0) {
        const customer = customerResult.rows[0];
        const orderData = await pool.query(
          'SELECT notification_channel, send_notifications FROM orders WHERE id = $1',
          [order.id]
        );
        const notificationSettings = orderData.rows[0] || { notification_channel: 'both', send_notifications: true };

        if (notificationSettings.send_notifications) {
          const channel = notificationSettings.notification_channel || 'both';
          const promisedDate = new Date(promised_date).toLocaleDateString('pt-BR');

          // Send SMS if channel is 'sms' or 'both'
          if ((channel === 'sms' || channel === 'both') && customer.phone) {
            try {
              await smsService.sendOrderConfirmationSMS(
                customer.phone,
                orderNumber,
                customer.name,
                promisedDate
              );
            } catch (smsError) {
              console.error('Failed to send SMS notification:', smsError);
              // Don't fail the order creation if SMS fails
            }
          }

          // Send Email if channel is 'email' or 'both'
          if ((channel === 'email' || channel === 'both') && customer.email) {
            try {
              await emailService.sendEmail({
                to: customer.email,
                subject: `Pedido ${orderNumber} criado com sucesso - Lavatec`,
                html: `
                  <h1>Pedido Criado com Sucesso!</h1>
                  <p>Olá ${customer.name},</p>
                  <p>Seu pedido <strong>${orderNumber}</strong> foi criado com sucesso.</p>
                  <p><strong>Data prometida:</strong> ${promisedDate}</p>
                  <p>Obrigado por escolher Lavatec!</p>
                `,
              });
            } catch (emailError) {
              console.error('Failed to send email notification:', emailError);
              // Don't fail the order creation if email fails
            }
          }
        }
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the order creation if notifications fail
    }

    res.status(201).json({
      order: { ...order, items: orderItems.map((r) => r.rows[0]) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'status',
      'promised_date',
      'promised_time',
      'completed_date',
      'delivered_date',
      'payment_status',
      'payment_method',
      'notes',
      'internal_notes',
      'is_priority',
      'is_flagged',
      'flag_reason',
      'assigned_staff_id',
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
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    if (updates.status) {
      await pool.query(
        `INSERT INTO order_timeline_events (order_id, event_type, description, user_id)
         VALUES ($1, $2, $3, $4)`,
        [id, 'status_changed', `Status changed to ${updates.status}`, req.userId]
      );

      // Send status update notifications
      try {
        const orderData = await pool.query(
          `SELECT o.*, c.name as customer_name, c.phone, c.email, b.name as branch_name
           FROM orders o
           LEFT JOIN customers c ON o.customer_id = c.id
           LEFT JOIN branches b ON o.branch_id = b.id
           WHERE o.id = $1`,
          [id]
        );

        if (orderData.rows.length > 0) {
          const order = orderData.rows[0];
          
          if (order.send_notifications) {
            const channel = order.notification_channel || 'both';

            // Send SMS notification
            if ((channel === 'sms' || channel === 'both') && order.phone) {
              try {
                await smsService.sendOrderStatusUpdateSMS(
                  order.phone,
                  order.order_number,
                  updates.status,
                  order.customer_name
                );

                // Special handling for 'ready' status
                if (updates.status === 'ready') {
                  await smsService.sendOrderReadySMS(
                    order.phone,
                    order.order_number,
                    order.customer_name,
                    order.branch_name
                  );
                }
              } catch (smsError) {
                console.error('Failed to send SMS status update:', smsError);
              }
            }

            // Send Email notification
            if ((channel === 'email' || channel === 'both') && order.email) {
              try {
                await emailService.sendEmail({
                  to: order.email,
                  subject: `Atualização do Pedido ${order.order_number} - Lavatec`,
                  html: `
                    <h1>Atualização do Pedido</h1>
                    <p>Olá ${order.customer_name},</p>
                    <p>O status do seu pedido <strong>${order.order_number}</strong> foi atualizado para: <strong>${updates.status}</strong></p>
                    ${updates.status === 'ready' ? '<p>Seu pedido está pronto para retirada!</p>' : ''}
                    <p>Acompanhe seu pedido em nosso sistema.</p>
                  `,
                });
              } catch (emailError) {
                console.error('Failed to send email status update:', emailError);
              }
            }
          }
        }
      } catch (notificationError) {
        console.error('Error sending status update notifications:', notificationError);
        // Don't fail the status update if notifications fail
      }
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

