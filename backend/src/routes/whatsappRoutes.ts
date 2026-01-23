import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  sendWhatsAppMessage,
  sendBulkWhatsAppMessage,
  sendOrderNotification,
  sendDeliveryNotification,
  sendPromotionalMessage,
  sendReactivationMessage,
} from '../controllers/whatsappController.js';

const router = Router();

// All WhatsApp routes require authentication
router.use(authenticate);

// Send single message
router.post('/send', sendWhatsAppMessage);

// Send bulk messages
router.post('/bulk', sendBulkWhatsAppMessage);

// Order notifications
router.post('/order-notification', sendOrderNotification);

// Delivery notifications
router.post('/delivery-notification', sendDeliveryNotification);

// Promotional messages
router.post('/promotional', sendPromotionalMessage);

// Customer reactivation campaign
router.post('/reactivation', sendReactivationMessage);

export default router;
