import dotenv from "dotenv";
dotenv.config();
console.log("Stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "YES ✅" : "NO ❌");
import express from "express";
import cors from "cors";
import {connectDB} from "./src/config/db.js"
import authRoutes from "./src/routes/auth.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import listingRoutes from "./src/routes/listing.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
connectDB();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// temporary seed route
app.get('/seed', async (req, res) => {
  try {
    const Listing = (await import('./src/models/listing.model.js')).default;
    await Listing.deleteMany();
    await Listing.insertMany([
      {
        title: 'Luxury Sea View Suite',
        description: 'Beautiful suite with panoramic ocean views, private balcony and world-class amenities.',
        photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        pricePerNight: 8500, maxGuests: 2, city: 'Goa', country: 'India',
        amenities: ['WiFi', 'Pool', 'AC', 'Breakfast', 'Parking'], isAvailable: true,
      },
      {
        title: 'Cozy Mountain Cottage',
        description: 'Peaceful cottage nestled in the Himalayas with stunning valley views and fireplace.',
        photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800'],
        pricePerNight: 3200, maxGuests: 4, city: 'Manali', country: 'India',
        amenities: ['WiFi', 'Fireplace', 'Parking', 'Kitchen'], isAvailable: true,
      },
      {
        title: 'Heritage Haveli Stay',
        description: 'Stay in a restored 200-year-old haveli with royal Rajasthani decor and courtyard.',
        photos: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
        pricePerNight: 5500, maxGuests: 3, city: 'Jaipur', country: 'India',
        amenities: ['WiFi', 'AC', 'Breakfast', 'Pool'], isAvailable: true,
      },
      {
        title: 'Modern City Apartment',
        description: 'Sleek and stylish apartment in the heart of the city, walking distance to everything.',
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        pricePerNight: 2800, maxGuests: 2, city: 'Mumbai', country: 'India',
        amenities: ['WiFi', 'AC', 'Kitchen', 'Gym'], isAvailable: true,
      },
      {
        title: 'Backwater Houseboat',
        description: 'Drift along Kerala backwaters on a traditional rice boat with all-inclusive meals.',
        photos: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'],
        pricePerNight: 6200, maxGuests: 4, city: 'Alleppey', country: 'India',
        amenities: ['Meals Included', 'AC', 'Deck', 'WiFi'], isAvailable: true,
      },
      {
        title: 'Beachfront Villa',
        description: 'Private villa steps from the beach with your own pool and personal butler service.',
        photos: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
        pricePerNight: 12000, maxGuests: 6, city: 'Goa', country: 'India',
        amenities: ['WiFi', 'Private Pool', 'Butler', 'AC', 'Parking', 'Breakfast'], isAvailable: true,
      },
      {
        title: 'Treehouse Retreat',
        description: 'Unique treehouse experience surrounded by jungle with outdoor showers and stargazing.',
        photos: ['https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800'],
        pricePerNight: 4100, maxGuests: 2, city: 'Coorg', country: 'India',
        amenities: ['Breakfast', 'Nature Walks', 'WiFi'], isAvailable: true,
      },
      {
        title: 'Business Class Hotel Room',
        description: 'Premium hotel room with work desk, high-speed WiFi, gym and rooftop restaurant.',
        photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        pricePerNight: 3800, maxGuests: 2, city: 'Bangalore', country: 'India',
        amenities: ['WiFi', 'Gym', 'AC', 'Restaurant', 'Parking'], isAvailable: true,
      },
      {
        title: 'Desert Camp Tent',
        description: 'Glamping in the Thar desert with bonfire, camel rides and Rajasthani folk music.',
        photos: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
        pricePerNight: 2500, maxGuests: 2, city: 'Jaisalmer', country: 'India',
        amenities: ['Meals Included', 'Camel Ride', 'Bonfire', 'AC'], isAvailable: true,
      },
      {
        title: 'Lake View Resort Room',
        description: 'Serene resort room overlooking Dal Lake with shikara ride and Kashmiri breakfast.',
        photos: ['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800'],
        pricePerNight: 4800, maxGuests: 3, city: 'Srinagar', country: 'India',
        amenities: ['WiFi', 'Breakfast', 'AC', 'Lake View', 'Shikara Ride'], isAvailable: true,
      },
    ]);
    res.json({ message: '✅ 10 hotels seeded!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payment', paymentRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
