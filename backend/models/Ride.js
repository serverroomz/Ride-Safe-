const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rideId: { type: String, unique: true, required: true },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  dropLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  estimatedDistance: Number,
  estimatedFare: Number,
  actualFare: Number,
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  rideType: {
    type: String,
    enum: ['standard', 'premium', 'shared', 'diaspora', 'escort'],
    default: 'standard'
  },
  // Diaspora ride fields
  luggage: {
    type: String,
    enum: ['small', 'medium', 'large', 'none'],
    default: 'none'
  },
  isLongDistance: { type: Boolean, default: false },
  destinationCity: String,
  
  // Escort ride fields
  companionRequired: { type: Boolean, default: false },
  safetyFeatures: [String], // e.g., ['gps_tracking', 'emergency_button', 'ride_sharing']
  preferredGender: String,
  specialRequirements: String,
  
  // Common fields
  promoCodeUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' },
  discountAmount: { type: Number, default: 0 },
  surgePricingMultiplier: { type: Number, default: 1 },
  
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  startTime: Date,
  endTime: Date,
  rating: { type: Number, min: 1, max: 5 },
  review: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
