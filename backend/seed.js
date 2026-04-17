import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './src/models/listing.model.js';

dotenv.config();

const hotels = [
  {
    title: 'Luxury Sea View Suite',
    description: 'Beautiful suite with panoramic ocean views, private balcony and world-class amenities.',
    photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    pricePerNight: 8500,
    maxGuests: 2,
    city: 'Goa',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Cozy Mountain Cottage',
    description: 'Peaceful cottage nestled in the Himalayas with stunning valley views and fireplace.',
    photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800'],
    pricePerNight: 3200,
    maxGuests: 4,
    city: 'Manali',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Heritage Haveli Stay',
    description: 'Stay in a restored 200-year-old haveli with royal Rajasthani decor and courtyard.',
    photos: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    pricePerNight: 5500,
    maxGuests: 3,
    city: 'Jaipur',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Modern City Apartment',
    description: 'Sleek and stylish apartment in the heart of the city, walking distance to everything.',
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    pricePerNight: 2800,
    maxGuests: 2,
    city: 'Mumbai',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Backwater Houseboat',
    description: 'Drift along Kerala backwaters on a traditional rice boat with all-inclusive meals.',
    photos: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'],
    pricePerNight: 6200,
    maxGuests: 4,
    city: 'Alleppey',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Beachfront Villa',
    description: 'Private villa steps from the beach with your own pool and personal butler service.',
    photos: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
    pricePerNight: 12000,
    maxGuests: 6,
    city: 'Goa',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Treehouse Retreat',
    description: 'Unique treehouse experience surrounded by jungle with outdoor showers and stargazing.',
    photos: ['https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800'],
    pricePerNight: 4100,
    maxGuests: 2,
    city: 'Coorg',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Business Class Hotel Room',
    description: 'Premium hotel room with work desk, high-speed WiFi, gym and rooftop restaurant.',
    photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    pricePerNight: 3800,
    maxGuests: 2,
    city: 'Bangalore',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Desert Camp Tent',
    description: 'Glamping in the Thar desert with bonfire, camel rides and Rajasthani folk music.',
    photos: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
    pricePerNight: 2500,
    maxGuests: 2,
    city: 'Jaisalmer',
    country: 'India',
    isAvailable: true,
  },
  {
    title: 'Lake View Resort Room',
    description: 'Serene resort room overlooking Dal Lake with shikara ride and Kashmiri breakfast.',
    photos: ['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800'],
    pricePerNight: 4800,
    maxGuests: 3,
    city: 'Srinagar',
    country: 'India',
    isAvailable: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Listing.deleteMany(); // clear old data
    console.log('Old listings cleared');

    await Listing.insertMany(hotels);
    console.log(`✅ ${hotels.length} hotels seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();