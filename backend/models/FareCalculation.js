const mongoose = require('mongoose');

const fareCalculationSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Distance and time
  baseFare: { type: Number, required: true },
  distanceKm: { type: Number, required: true },
  distanceFare: { type: Number, required: true },
  estimatedTime: { type: Number, required: true }, // in minutes
  timeFare: { type: Number, required: true },
  
  // Modifiers
  surgePricingMultiplier: { type: Number, default: 1 },
  surgePricingAmount: { type: Number, default: 0 },
  
  promoCodeDiscount: { type: Number, default: 0 },
  referralDiscount: { type: Number, default: 0 },
  
  // Location-based charges
  tollCharges: { type: Number, default: 0 },
  airportFee: { type: Number, default: 0 },
  
  // Ride type premium
  rideTypePremium: { type: Number, default: 0 }, // for premium/escort rides
  
  // Subtotal and extras
  subtotal: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  driverEarnings: { type: Number, required: true },
  platformCommission: { type: Number, required: true },
  
  // Final amount
  totalFare: { type: Number, required: true },
  paymentMethod: String,
  
  // Breakdown
  breakdown: {
    base: Number,
    distance: Number,
    time: Number,
    surge: Number,
    discounts: Number,
    taxes: Number,
    total: Number
  },
  
  // Ride details
  rideType: String,
  city: String,
  pickupLocation: String,
  dropLocation: String,
  
  // Algorithm version
  algorithmVersion: { type: String, default: '1.0' },
  
  // Timestamp
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FareCalculation', fareCalculationSchema);
