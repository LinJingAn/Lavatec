import { Router } from 'express';
import {
  getSupplies,
  getSupplyById,
  createSupply,
  updateSupply,
} from '../controllers/supplyController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSupplies);
router.get('/:id', getSupplyById);
router.post('/', createSupply);
router.put('/:id', updateSupply);

export default router;

