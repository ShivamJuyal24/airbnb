import Stripe from 'stripe';
import Listing from '../models/listing.model.js';
import Booking from '../models/booking.model.js';

export const createCheckoutSession = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ defined here
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isAvailable)
      return res.status(404).json({ message: 'Listing not available' });

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0)
      return res.status(400).json({ message: 'Invalid dates' });

    const totalPrice = nights * listing.pricePerNight;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: listing.title,
              description: `${nights} night(s) in ${listing.city} | ${new Date(checkIn).toDateString()} → ${new Date(checkOut).toDateString()}`,
              images: listing.photos.length ? [listing.photos[0]] : [],
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        listingId,
        guestId: req.user._id.toString(),
        checkIn,
        checkOut,
        guests: String(guests),       // ✅ added
        totalPrice: String(totalPrice),
      },
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/hotels/${listingId}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPaymentAndBook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ defined here too
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid')
      return res.status(400).json({ message: 'Payment not completed' });

    const existing = await Booking.findOne({ stripeSessionId: sessionId });
    if (existing)
      return res.json({ message: 'Booking already created', booking: existing });

    const { listingId, guestId, checkIn, checkOut, guests, totalPrice } = session.metadata;

    const conflict = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }],
    });
    if (conflict)
      return res.status(400).json({ message: 'Dates no longer available' });

    const booking = await Booking.create({
      guest: guestId,
      listing: listingId,
      checkIn,
      checkOut,
      guests: Number(guests),         // ✅ added
      totalPrice: Number(totalPrice),
      status: 'confirmed',
      paymentStatus: 'paid',
      stripeSessionId: sessionId,
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};