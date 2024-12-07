const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }], // Array of image URLs
    createdAt: { type: Date, default: Date.now },
    availableUntil: { type: Date },
  });
  
  ItemSchema.index({ location: '2dsphere' });
  
module.exports = mongoose.model('Item', ItemSchema);
