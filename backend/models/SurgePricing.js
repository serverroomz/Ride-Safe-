const mongoose = require('mongoose');

const surgePricingSchema = new mongoose.Schema({
  // Location information
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, default: 5 }, // in km
  
  // Surge multiplier
  multiplier: { type: Number, required: true, min: 1, max: 5 },
  reason: {
    type: String,
    enum: ['peak_hours', 'weather', 'events', 'low_driver_availability', 'manual_adjustment'],
    required: true
  },
  
  // Demand and supply
  activeRideRequests: { type: Number, default: 0 },
  availableDrivers: { type: Number, default: 0 },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium'
  },
  
  // Time information
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date, required: true },
  daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0 = Sunday, 6 = Saturday
  timeSlotStart: String, // HH:MM format
  timeSlotEnd: String,   // HH:MM format
  
  // Applicable ride types
  applicableRideTypes: [String],
  
  // Status
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  
  // Metrics
  estimatedRevenue: Number,
  actualRevenue: Number,
  requestsProcessed: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

surgePricingSchema.index({ city: 1, effectiveFrom: 1 });
surgePricingSchema.index({ isActive: 1 });

module.exports = mongoose.model('SurgePricing', surgePricingSchema);
