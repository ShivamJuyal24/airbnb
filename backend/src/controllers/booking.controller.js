import Booking from '../models/booking.model.js';
import listing from '../models/listing.model.js';

// create booking

export const createBooking = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, guests } = req.body;

        const listingDoc = await listing.findById(listingId);

        if (!listingDoc || !listingDoc.isAvailable) {
            return res.status(404).json({ message: 'Listing not available' });
        }

        const conflict = await Booking.findOne({
            listingId: listingId,
            status: { $ne: 'cancelled' },
            $or: [
                {
                    checkIn: { $lt: new Date(checkOut) },
                    checkOut: { $gt: new Date(checkIn) }
                }
            ]
        });

        if (conflict) {
            return res.status(400).json({
                message: "Already booked for these dates"
            });
        }

        const nights = Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        );

        const totalPrice = nights * listingDoc.pricePerNight;

        const booking = await Booking.create({
            guestId: req.user._id,
            listingId: listingId,
            checkIn,
            checkOut,
            guests,
            totalPrice
        });

        res.status(201).json(booking);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// get user bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking
            .find({ guestId: req.user._id })
            .populate('listingId', 'title city pricePerNight photos');

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//cancel booking 

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            guestId: req.user._id   
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: "booking cancelled", booking });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};