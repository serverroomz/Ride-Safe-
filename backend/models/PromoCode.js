const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: { type: Number, required: true },
  maxDiscount: Number,
  minRideAmount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  usageCount: { type: Number, default: 0 },
  applicableRideTypes: [{ type: String, enum: ['standard', 'premium', 'shared', 'diaspora', 'escort'] }],
  applicableCities: [String],
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralCode: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
