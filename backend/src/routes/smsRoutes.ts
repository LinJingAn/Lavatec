import { Router } from 'express';
import { sendSMS, sendBulkSMS, sendPromotionalSMS } from '../controllers/smsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All SMS routes require authentication
router.use(authenticate);

// Send SMS to a single customer
router.post('/send', sendSMS);

// Send SMS to multiple customers
router.post('/send/bulk', sendBulkSMS);

// Send promotional SMS
router.post('/send/promotional', sendPromotionalSMS);

export default router;
