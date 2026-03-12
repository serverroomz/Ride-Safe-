const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'stripe', 'wallet', 'cash'],
    required: true
  },
  // Paystack specific fields
  paystackReference: String,
  paystackAccessCode: String,
  
  // Stripe specific fields
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  stripeCardLast4: String,
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  failureReason: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  
  // Refund information
  refundAmount: { type: Number, default: 0 },
  refundReason: String,
  refundProcessedAt: Date,
  
  initiatedAt: { type: Date, default: Date.now },
  completedAt: Date,
  expiresAt: Date
});

// Add index for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ rideId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
