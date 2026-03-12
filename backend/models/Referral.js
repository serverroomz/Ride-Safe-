const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralCode: { type: String, unique: true, required: true, uppercase: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refereeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Referral rewards
  referrerReward: { type: Number, required: true }, // Amount referrer gets
  refereeReward: { type: Number, required: true }, // Sign-up bonus for referee
  referrerRewardType: {
    type: String,
    enum: ['wallet_credit', 'promo_code', 'percentage_discount'],
    default: 'wallet_credit'
  },
  refereeRewardType: {
    type: String,
    enum: ['wallet_credit', 'promo_code', 'percentage_discount'],
    default: 'wallet_credit'
  },
  
  // Referral criteria
  minRidesRequired: { type: Number, default: 1 },
  minAmountRequired: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'expired'],
    default: 'pending'
  },
  refereeSignupDate: Date,
  refereeFirstRideDate: Date,
  rewardClaimedDate: Date,
  
  // Tracking
  clickCount: { type: Number, default: 0 },
  signupCount: { type: Number, default: 0 },
  completedRides: { type: Number, default: 0 },
  totalRideAmount: { type: Number, default: 0 },
  
  // Validity
  validFrom: { type: Date, required: true },
  validTo: Date,
  
  createdAt: { type: Date, default: Date.now }
});

referralSchema.index({ referrerId: 1 });
referralSchema.index({ referralCode: 1 });
referralSchema.index({ status: 1 });

module.exports = mongoose.model('Referral', referralSchema);
