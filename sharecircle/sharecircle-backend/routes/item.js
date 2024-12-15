const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/items')); // Store in the 'uploads/items' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique file name
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept only image files
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Route for creating a new item
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  let { name, description, category, availableUntil, location } = req.body;
  const owner = req.user.id;

  // Parse location if it's sent as a string
  if (typeof location === 'string') {
    try {
      location = JSON.parse(location);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid location format' });
    }
  }

  // Validate required fields
  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }

  // Handle uploaded images
  const imagePaths = req.files.map((file) => `/uploads/items/${file.filename}`);

  try {
    const newItem = new Item({
      name,
      description,
      category,
      availableUntil,
      owner,
      location,
      images: imagePaths, // Save the image paths
    });

    const savedItem = await newItem.save(); // Save the item to the database

    // Respond with the saved item
    res.status(201).json({
      message: 'Item created successfully',
      item: {
        _id: savedItem._id,
        name: savedItem.name,
        description: savedItem.description,
        category: savedItem.category,
        availableUntil: savedItem.availableUntil,
        owner: savedItem.owner,
        location: savedItem.location,
        images: savedItem.images, // Include the images in the response
        createdAt: savedItem.createdAt,
        updatedAt: savedItem.updatedAt,
      },
    });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Error creating item', details: err.message });
  }
});

// Search Items
router.get('/search', async (req, res) => {
  const { query } = req.query; // Extract the search query from the request

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Find items whose name matches the query (case-insensitive)
    const items = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json(items); // Respond with the matched items
  } catch (err) {
    console.error('Error searching items:', err);
    res.status(500).json({ error: 'Error searching items', details: err.message });
  }
});

// Get items based on geolocation
router.get('/', async (req, res) => {
  let { longitude, latitude, radius } = req.query;

  if (!longitude || !latitude || !radius) {
    return res.status(400).json({ error: 'Longitude, latitude, and radius are required' });
  }

  try {
    longitude = parseFloat(longitude);
    latitude = parseFloat(latitude);
    radius = parseFloat(radius);

    const items = await Item.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radius / 6378.1] },
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Error fetching items', details: err.message });
  }
});

// Get recent items with pagination
router.get('/recent', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10
  const skip = parseInt(req.query.skip) || 0; // Default skip to 0

  try {
    const recentItems = await Item.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json(recentItems);
  } catch (error) {
    console.error('Error fetching recent items:', error);
    res.status(500).json({ error: 'Failed to fetch recent items' });
  }
});

// Seed items
router.post('/seed', async (req, res) => {
  const seedItems = [
    {
      name: '8 ft roll-up Bamboo Shade',
      description: "It's a bit worn, but still works fine.",
      category: 'Offer',
      location: { type: 'Point', coordinates: [-122.256, 37.777] },
      owner: '6752c4ee6ddb41a598dbe51e',
      images: ['/uploads/items/sample1.avif', '/uploads/items/sample2.webp'], // Example image URLs
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'IKEA Desk',
      description: 'Sturdy black IKEA desk.',
      category: 'Offer',
      location: { type: 'Point', coordinates: [-122.256, 37.777] },
      owner: '6752c4ee6ddb41a598dbe51e',
      images: ['/uploads/items/sample3.jpeg'], // Single image
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  try {
    const createdItems = await Item.insertMany(seedItems);
    res.status(201).json({ message: 'Seed items created successfully', items: createdItems });
  } catch (error) {
    console.error('Error seeding items:', error);
    res.status(500).json({ error: 'Failed to seed items', details: error.message });
  }
});

// Get items by user ID
router.get('/user/:userId', auth, async (req, res) => {
  const { userId } = req.params;

  console.log('Fetching items for user:', userId);

  try {
    const items = await Item.find({ owner: userId }).sort({ createdAt: -1 });
    console.log('Fetched items:', items);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items by user:', error);
    res.status(500).json({ error: 'Failed to fetch items by user' });
  }
});



module.exports = router;






