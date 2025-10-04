const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const equipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Tractors', 'Irrigation', 'Seeds', 'Fertilizers', 'Tools', 'Other'],
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  seller: sellerSchema,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Equipment', equipmentSchema);
