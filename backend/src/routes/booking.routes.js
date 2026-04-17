import express from 'express';
import {createBooking, getMyBookings, cancelBooking} from '../controllers/booking.controller.js';

import {protect} from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/',createBooking);
router.get('/my', getMyBookings);
router.patch('/:id/cancel', cancelBooking);
export default router;