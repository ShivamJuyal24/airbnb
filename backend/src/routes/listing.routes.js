import express from 'express';
import Listing from '../models/listing.model.js';

const router = express.Router();

// Get all available listings (with optional city filter)
router.get('/', async (req, res) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.city) filter.city = new RegExp(req.query.city, 'i');
    const listings = await Listing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;