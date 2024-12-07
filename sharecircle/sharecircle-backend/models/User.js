const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '/upload/avatars/default-avatar.png' }, // Include avatar inside the schema object
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt
);

module.exports = mongoose.model('User', UserSchema);

