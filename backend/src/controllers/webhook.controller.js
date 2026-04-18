import Stripe from 'stripe';
import Booking from '../models/booking.model.js';



export const stripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // must be raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { listingId, guestId, checkIn, checkOut,totalPrice } = session.metadata;

    // Check for conflict before creating
    const conflict = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }],
    });

    if (!conflict) {
      await Booking.create({
        guest: guestId,
        listing: listingId,
        checkIn,
        checkOut,
        totalPrice: Number(totalPrice),
        status: 'confirmed',         // auto confirmed after payment
        paymentStatus: 'paid',
        stripeSessionId: session.id,
      });
    }
  }

  res.json({ received: true });
};