import express from 'express';
import { createCheckoutSession, verifyPaymentAndBook } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify-and-book', protect, verifyPaymentAndBook);

export default router;