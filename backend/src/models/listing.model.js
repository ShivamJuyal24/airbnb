import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    description:   { type: String, required: true },
    photos:        [{ type: String }],
    pricePerNight: { type: Number, required: true },
    city:          { type: String, required: true },
    country:       { type: String, required: true },
    isAvailable:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Listing', listingSchema);