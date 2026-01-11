import { Router } from 'express';
import {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDeliveryStatus,
  assignDriver,
} from '../controllers/deliveryController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.post('/', createDelivery);
router.put('/:id/status', updateDeliveryStatus);
router.put('/:id/assign', assignDriver);

export default router;

