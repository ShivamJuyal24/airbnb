import express from 'express';
import { stripeWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// ⚠️ raw body needed for stripe signature verification
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);
export default router;