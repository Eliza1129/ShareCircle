const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const upload = require('../middleware/multer');
require('dotenv').config();


// Register a new user
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('Register route hit');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, email, passwordHash: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email or username already exists' });
      }
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user', details: error.message });
    }
  }
);

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     // Ensure avatar path is complete
     const avatar = `${req.protocol}://${req.get('host')}${user.avatar}`;
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user', details: error.message });
  }
});

// Get all users
router.get('/user-data', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Upload Avatar Route
router.post('/:id/upload-avatar', upload.uploadAvatar.single('avatar'), async (req, res) => {
  console.log('File uploaded:', req.file);

  const userId = req.params.id;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's avatar
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Avatar updated successfully', avatar: user.avatar });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Server error. Could not update avatar.' });
  }
});

module.exports = router;

