import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { createPaymentSession, getPaymentSession, markPaymentSessionPaid } from '../controllers/paymentController.js';

const router = Router();

// Step 1 (current): generate a hosted link and track status internally.
// Step 2 (future): replace provider fields with pagar.me references and update via webhooks.

// Create sessions (staff only)
router.post('/', authenticate, createPaymentSession);

// View session (used by the hosted payment link page)
router.get('/:id', getPaymentSession);

// Mark as paid (staff only - until real gateway webhooks are added)
router.post('/:id/mark-paid', authenticate, markPaymentSessionPaid);

export default router;
