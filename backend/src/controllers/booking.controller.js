import Booking from '../models/booking.model.js';
import Listing from '../models/listing.model.js';

export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listingDoc = await Listing.findById(listingId);
    if (!listingDoc || !listingDoc.isAvailable)
      return res.status(404).json({ message: 'Listing not available' });

    const conflict = await Booking.findOne({
      listing: listingId,           // ✅ was listingId, now listing
      status: { $ne: 'cancelled' },
      $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }],
    });
    if (conflict)
      return res.status(400).json({ message: 'Already booked for these dates' });

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * listingDoc.pricePerNight;

    const booking = await Booking.create({
      guest: req.user._id,          // ✅ was guestId, now guest
      listing: listingId,           // ✅ was listingId, now listing
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking
      .find({ guest: req.user._id })              // ✅ was guestId, now guest
      .populate('listing', 'title city pricePerNight photos'); // ✅ was listingId, now listing

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      guest: req.user._id,          // ✅ was guestId, now guest
    });
    if (!booking)
      return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};