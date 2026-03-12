const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bidId: { type: String, unique: true, required: true },
  rideId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidPrice: { type: Number, required: true },
  driverLocation: {
    latitude: Number,
    longitude: Number
  },
  estimatedArrivalTime: Number, // in seconds
  status: {
    type: String,
    enum: ['active', 'accepted', 'rejected', 'expired'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now, expires: 60 }, // auto-expire in 60 seconds
  acceptedAt: Date
});

module.exports = mongoose.model('Bid', bidSchema);
