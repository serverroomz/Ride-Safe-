const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  balance: { type: Number, default: 0 },
  transactions: [{
    txId: String,
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: Number,
    description: String,
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
    timestamp: { type: Date, default: Date.now }
  }],
  paymentMethods: [{
    methodId: String,
    type: { type: String, enum: ['card', 'upi', 'bank'], required: true },
    isDefault: Boolean,
    lastUsed: Date,
    details: mongoose.Schema.Types.Mixed
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);
