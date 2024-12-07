const multer = require('multer');
const path = require('path');

// Storage configuration for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/avatars')); // Path to save avatars
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique file name
  },
});

// Storage configuration for item images uploads
const itemImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/items')); // Path to save item images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique file name
  },
});

// File filter for avatars
const avatarFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed for avatars'), false);
  }
};

// // File filter for item images
const itemFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed for item images'), false);
  }
};

// Export different multer instances
module.exports = {
  uploadAvatar: multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for avatars
  }),
  uploadItemImages: multer({
    storage: itemImageStorage,
    fileFilter: itemFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for item images
  }),
};



