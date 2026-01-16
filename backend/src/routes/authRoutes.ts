import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  verifyEmail, 
  resendVerificationEmail 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;

