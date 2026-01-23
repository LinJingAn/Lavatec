import { Response, NextFunction } from 'express';
import pool from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { whatsappService } from '../services/whatsappService.js';

/**
 * Send WhatsApp message to a customer
 */
export const sendWhatsAppMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, phone, message, mediaUrl } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    let phoneNumber = phone;
    let customerName = 'Cliente';

    // If customer_id is provided, get phone from customer
    if (customer_id) {
      const customerResult = await pool.query(
        'SELECT phone, name FROM customers WHERE id = $1',
        [customer_id]
      );

      if (customerResult.rows.length === 0) {
        throw new AppError('Customer not found', 404);
      }

      phoneNumber = phoneNumber || customerResult.rows[0].phone;
      customerName = customerResult.rows[0].name;
    }

    if (!phoneNumber) {
      throw new AppError('Phone number is required', 400);
    }

    await whatsappService.sendMessage({
      to: phoneNumber,
      message,
      mediaUrl,
    });

    // Log communication
    if (customer_id) {
      await pool.query(
        `INSERT INTO customer_communication_logs 
         (customer_id, channel, direction, subject, content, created_by)
         VALUES ($1, 'whatsapp', 'outbound', 'WhatsApp Message', $2, $3)`,
        [customer_id, message, req.user?.id]
      );
    }

    res.json({ message: 'WhatsApp message sent successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Send WhatsApp message to multiple customers (bulk)
 */
export const sendBulkWhatsAppMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_ids, message, mediaUrl } = req.body;

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    if (!customer_ids || !Array.isArray(customer_ids) || customer_ids.length === 0) {
      throw new AppError('customer_ids array is required', 400);
    }

    // Get customers
    const customersResult = await pool.query(
      'SELECT id, phone, name FROM customers WHERE id = ANY($1) AND phone IS NOT NULL',
      [customer_ids]
    );

    if (customersResult.rows.length === 0) {
      throw new AppError('No valid customers found with phone numbers', 404);
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as { customerId: string; error: string }[],
    };

    // Send messages to each customer
    for (const customer of customersResult.rows) {
      try {
        await whatsappService.sendMessage({
          to: customer.phone,
          message: message.replace('{{nome}}', customer.name).replace('{{name}}', customer.name),
          mediaUrl,
        });

        // Log communication
        await pool.query(
          `INSERT INTO customer_communication_logs 
           (customer_id, channel, direction, subject, content, created_by)
           VALUES ($1, 'whatsapp', 'outbound', 'Bulk WhatsApp Message', $2, $3)`,
          [customer.id, message, req.user?.id]
        );

        results.sent++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          customerId: customer.id,
          error: error.message,
        });
      }
    }

    res.json({
      message: `Bulk WhatsApp: ${results.sent} sent, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send order notification via WhatsApp
 */
export const sendOrderNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { order_id, notification_type } = req.body;

    if (!order_id) {
      throw new AppError('order_id is required', 400);
    }

    if (!notification_type) {
      throw new AppError('notification_type is required', 400);
    }

    // Get order with customer info
    const orderResult = await pool.query(
      `SELECT o.*, c.name as customer_name, c.phone as customer_phone, b.name as branch_name, b.address as branch_address
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       LEFT JOIN branches b ON b.id = o.branch_id
       WHERE o.id = $1`,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    const order = orderResult.rows[0];

    if (!order.customer_phone) {
      throw new AppError('Customer does not have a phone number', 400);
    }

    // Send appropriate notification based on type
    switch (notification_type) {
      case 'confirmation':
        await whatsappService.sendOrderConfirmation(
          order.customer_phone,
          order.order_number,
          order.customer_name,
          new Date(order.promised_date).toLocaleDateString('pt-BR'),
          parseFloat(order.total).toFixed(2)
        );
        break;

      case 'status_update':
        await whatsappService.sendOrderStatusUpdate(
          order.customer_phone,
          order.order_number,
          order.status,
          order.customer_name
        );
        break;

      case 'ready':
        await whatsappService.sendOrderReady(
          order.customer_phone,
          order.order_number,
          order.customer_name,
          order.branch_name,
          order.branch_address
        );
        break;

      default:
        throw new AppError(`Invalid notification_type: ${notification_type}`, 400);
    }

    // Log the notification
    await pool.query(
      `INSERT INTO customer_communication_logs 
       (customer_id, channel, direction, subject, content, created_by)
       VALUES ($1, 'whatsapp', 'outbound', $2, $3, $4)`,
      [
        order.customer_id,
        `Order ${notification_type} - #${order.order_number}`,
        `WhatsApp notification: ${notification_type}`,
        req.user?.id,
      ]
    );

    res.json({ message: `WhatsApp ${notification_type} notification sent successfully` });
  } catch (error) {
    next(error);
  }
};

/**
 * Send delivery notification via WhatsApp
 */
export const sendDeliveryNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { delivery_id, notification_type } = req.body;

    if (!delivery_id) {
      throw new AppError('delivery_id is required', 400);
    }

    // Get delivery with order and customer info
    const deliveryResult = await pool.query(
      `SELECT d.*, o.order_number, c.name as customer_name, c.phone as customer_phone,
              dd.name as driver_name
       FROM deliveries d
       JOIN orders o ON o.id = d.order_id
       JOIN customers c ON c.id = d.customer_id
       LEFT JOIN delivery_drivers dd ON dd.id = d.driver_id
       WHERE d.id = $1`,
      [delivery_id]
    );

    if (deliveryResult.rows.length === 0) {
      throw new AppError('Delivery not found', 404);
    }

    const delivery = deliveryResult.rows[0];

    if (!delivery.customer_phone) {
      throw new AppError('Customer does not have a phone number', 400);
    }

    // Send appropriate notification
    switch (notification_type || delivery.status) {
      case 'out_for_delivery':
      case 'dispatched':
        await whatsappService.sendDeliveryNotification(
          delivery.customer_phone,
          delivery.order_number,
          delivery.customer_name,
          delivery.driver_name || 'Entregador',
          delivery.estimated_delivery_time
            ? new Date(delivery.estimated_delivery_time).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined
        );
        break;

      case 'delivered':
        await whatsappService.sendDeliveryCompleted(
          delivery.customer_phone,
          delivery.order_number,
          delivery.customer_name
        );
        break;

      default:
        throw new AppError(`Invalid notification type or status: ${notification_type || delivery.status}`, 400);
    }

    res.json({ message: 'Delivery WhatsApp notification sent successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Send promotional WhatsApp message
 */
export const sendPromotionalMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_ids, promotion_id, custom_message } = req.body;

    if (!customer_ids || !Array.isArray(customer_ids) || customer_ids.length === 0) {
      throw new AppError('customer_ids array is required', 400);
    }

    let promotionTitle = 'Promoção Especial';
    let promotionDescription = custom_message || '';
    let couponCode: string | undefined;
    let expiryDate: string | undefined;

    // If promotion_id provided, get promotion details
    if (promotion_id) {
      const promotionResult = await pool.query(
        'SELECT * FROM promotions WHERE id = $1',
        [promotion_id]
      );

      if (promotionResult.rows.length === 0) {
        throw new AppError('Promotion not found', 404);
      }

      const promotion = promotionResult.rows[0];
      promotionTitle = promotion.name;
      promotionDescription = promotion.description || '';
      couponCode = promotion.coupon_code;
      expiryDate = promotion.end_date
        ? new Date(promotion.end_date).toLocaleDateString('pt-BR')
        : undefined;
    }

    // Get customers
    const customersResult = await pool.query(
      'SELECT id, phone, name FROM customers WHERE id = ANY($1) AND phone IS NOT NULL',
      [customer_ids]
    );

    const results = { sent: 0, failed: 0 };

    for (const customer of customersResult.rows) {
      try {
        await whatsappService.sendPromotion(
          customer.phone,
          customer.name,
          promotionTitle,
          promotionDescription,
          couponCode,
          expiryDate
        );
        results.sent++;

        // Log communication
        await pool.query(
          `INSERT INTO customer_communication_logs 
           (customer_id, channel, direction, subject, content, created_by)
           VALUES ($1, 'whatsapp', 'outbound', $2, $3, $4)`,
          [customer.id, `Promotion: ${promotionTitle}`, promotionDescription, req.user?.id]
        );
      } catch {
        results.failed++;
      }
    }

    res.json({
      message: `Promotional messages: ${results.sent} sent, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send customer reactivation message
 */
export const sendReactivationMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { days_inactive = 30, special_offer, limit = 100 } = req.body;

    // Find inactive customers
    const customersResult = await pool.query(
      `SELECT id, phone, name, last_visit
       FROM customers
       WHERE phone IS NOT NULL
         AND is_active = true
         AND (last_visit IS NULL OR last_visit < NOW() - INTERVAL '1 day' * $1)
       ORDER BY last_visit ASC NULLS FIRST
       LIMIT $2`,
      [days_inactive, limit]
    );

    if (customersResult.rows.length === 0) {
      res.json({ message: 'No inactive customers found', results: { sent: 0, failed: 0 } });
      return;
    }

    const results = { sent: 0, failed: 0 };

    for (const customer of customersResult.rows) {
      try {
        const lastVisitDays = customer.last_visit
          ? Math.floor((Date.now() - new Date(customer.last_visit).getTime()) / (1000 * 60 * 60 * 24))
          : days_inactive;

        await whatsappService.sendReactivation(
          customer.phone,
          customer.name,
          lastVisitDays,
          special_offer
        );
        results.sent++;

        // Log communication
        await pool.query(
          `INSERT INTO customer_communication_logs 
           (customer_id, channel, direction, subject, content, created_by)
           VALUES ($1, 'whatsapp', 'outbound', 'Reactivation Campaign', $2, $3)`,
          [customer.id, `Inactive for ${lastVisitDays} days`, req.user?.id]
        );
      } catch {
        results.failed++;
      }
    }

    res.json({
      message: `Reactivation messages: ${results.sent} sent, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    next(error);
  }
};
