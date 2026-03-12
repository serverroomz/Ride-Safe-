const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const Referral = require('../models/Referral');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// === PROMO CODE ROUTES ===

/**
 * Create promo code (admin only)
 */
router.post('/promo/create', async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minRideAmount,
      usageLimit,
      applicableRideTypes,
      applicableCities,
      validFrom,
      validTo,
    } = req.body;

    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxDiscount,
      minRideAmount: minRideAmount || 0,
      usageLimit: usageLimit || 100,
      applicableRideTypes: applicableRideTypes || [],
      applicableCities: applicableCities || [],
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      isActive: true,
    });

    await promoCode.save();

    res.json({
      success: true,
      message: 'Promo code created successfully',
      data: promoCode,
    });
  } catch (error) {
    console.error('Promo code creation error:', error);
    res.status(500).json({ message: 'Failed to create promo code', error: error.message });
  }
});

/**
 * Validate promo code
 */
router.post('/promo/validate', async (req, res) => {
  try {
    const { code, amount, rideType, userId } = req.body;

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
    });

    if (!promoCode) {
      return res.status(400).json({
        valid: false,
        message: 'Promo code is invalid or expired',
      });
    }

    // Check minimum ride amount
    if (amount < promoCode.minRideAmount) {
      return res.status(400).json({
        valid: false,
        message: `Minimum ride amount of ${promoCode.minRideAmount} not met`,
      });
    }

    // Check usage limit
    if (promoCode.usageCount >= promoCode.usageLimit) {
      return res.status(400).json({
        valid: false,
        message: 'Promo code usage limit reached',
      });
    }

    // Check applicable ride types
    if (promoCode.applicableRideTypes.length > 0 && !promoCode.applicableRideTypes.includes(rideType)) {
      return res.status(400).json({
        valid: false,
        message: 'Promo code not applicable for this ride type',
      });
    }

    // Check if user has already used this code
    if (promoCode.usedBy.includes(userId)) {
      return res.status(400).json({
        valid: false,
        message: 'You have already used this promo code',
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (amount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount) {
        discount = Math.min(discount, promoCode.maxDiscount);
      }
    } else if (promoCode.discountType === 'fixed') {
      discount = promoCode.discountValue;
    }

    res.json({
      valid: true,
      message: 'Promo code is valid',
      data: {
        code: promoCode.code,
        description: promoCode.description,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        calculatedDiscount: Math.min(discount, amount),
        maxDiscount: promoCode.maxDiscount,
      },
    });
  } catch (error) {
    console.error('Promo code validation error:', error);
    res.status(500).json({ message: 'Failed to validate promo code', error: error.message });
  }
});

/**
 * Get all active promo codes
 */
router.get('/promo/active', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
    }).select('code description discountType discountValue validTo');

    res.json({
      success: true,
      data: promoCodes,
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ message: 'Failed to fetch promo codes' });
  }
});

/**
 * Deactivate promo code
 */
router.post('/promo/:codeId/deactivate', async (req, res) => {
  try {
    const { codeId } = req.params;

    const promoCode = await PromoCode.findByIdAndUpdate(
      codeId,
      { isActive: false },
      { new: true }
    );

    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    res.json({
      success: true,
      message: 'Promo code deactivated',
      data: promoCode,
    });
  } catch (error) {
    console.error('Promo code deactivation error:', error);
    res.status(500).json({ message: 'Failed to deactivate promo code' });
  }
});

// === REFERRAL ROUTES ===

/**
 * Generate referral code for user
 */
router.post('/referral/generate', async (req, res) => {
  try {
    const { userId, referrerReward, refereeReward } = req.body;

    // Check if user already has an active referral code
    let referral = await Referral.findOne({
      referrerId: userId,
      status: { $in: ['pending', 'active'] },
    });

    if (referral) {
      return res.json({
        success: true,
        message: 'User already has an active referral code',
        data: {
          referralCode: referral.referralCode,
          referrerReward: referral.referrerReward,
          refereeReward: referral.refereeReward,
        },
      });
    }

    // Generate unique referral code
    const referralCode = `REF${Date.now()}${Math.random().toString(36).substring(7)}`.toUpperCase();

    referral = new Referral({
      referralCode,
      referrerId: userId,
      referrerReward: referrerReward || 500,
      refereeReward: refereeReward || 200,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      status: 'active',
    });

    await referral.save();

    res.json({
      success: true,
      message: 'Referral code generated successfully',
      data: {
        referralCode,
        referrerReward,
        refereeReward,
      },
    });
  } catch (error) {
    console.error('Referral code generation error:', error);
    res.status(500).json({ message: 'Failed to generate referral code', error: error.message });
  }
});

/**
 * Apply referral code (new user signup)
 */
router.post('/referral/apply', async (req, res) => {
  try {
    const { referralCode, refereeId } = req.body;

    const referral = await Referral.findOne({
      referralCode: referralCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
    });

    if (!referral) {
      return res.status(400).json({
        message: 'Invalid or expired referral code',
      });
    }

    // Check if referee already used a referral
    const existingReferral = await Referral.findOne({ refereeId });
    if (existingReferral) {
      return res.status(400).json({
        message: 'User has already used a referral code',
      });
    }

    // Update referral
    referral.refereeId = refereeId;
    referral.refereeSignupDate = new Date();
    referral.status = 'pending';
    referral.clickCount += 1;
    await referral.save();

    // Award referee immediate bonus
    const wallet = await Wallet.findOne({ userId: refereeId });
    if (wallet) {
      wallet.balance += referral.refereeReward;
      wallet.transactions.push({
        type: 'referral_bonus',
        amount: referral.refereeReward,
        description: `Referral bonus from code ${referralCode}`,
      });
      await wallet.save();
    }

    res.json({
      success: true,
      message: 'Referral code applied successfully',
      data: {
        refereeReward: referral.refereeReward,
        referralId: referral._id,
      },
    });
  } catch (error) {
    console.error('Referral application error:', error);
    res.status(500).json({ message: 'Failed to apply referral code', error: error.message });
  }
});

/**
 * Get referral statistics for user
 */
router.get('/referral/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const referral = await Referral.findOne({
      referrerId: userId,
      status: { $in: ['pending', 'active', 'completed'] },
    });

    if (!referral) {
      return res.json({
        success: true,
        data: {
          referralCode: null,
          referrals: 0,
          earnings: 0,
          message: 'No active referral program',
        },
      });
    }

    res.json({
      success: true,
      data: {
        referralCode: referral.referralCode,
        referrals: referral.signupCount,
        completedRides: referral.completedRides,
        totalReferred: referral.totalRideAmount,
        earnings: referral.signupCount * referral.referrerReward,
        status: referral.status,
      },
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ message: 'Failed to fetch referral stats' });
  }
});

/**
 * Complete referral (when referred user completes required rides)
 */
router.post('/referral/complete', async (req, res) => {
  try {
    const { referralId } = req.body;

    const referral = await Referral.findById(referralId);

    if (!referral || referral.completedRides < referral.minRidesRequired) {
      return res.status(400).json({
        message: 'Referral requirements not met',
      });
    }

    // Award referrer bonus
    const wallet = await Wallet.findOne({ userId: referral.referrerId });
    if (wallet) {
      wallet.balance += referral.referrerReward;
      wallet.transactions.push({
        type: 'referral_commission',
        amount: referral.referrerReward,
        description: `Referral commission from ${referral.refereeId}`,
      });
      await wallet.save();
    }

    // Mark referral as completed
    referral.status = 'completed';
    referral.rewardClaimedDate = new Date();
    await referral.save();

    res.json({
      success: true,
      message: 'Referral completed and reward credited',
      data: {
        referrerReward: referral.referrerReward,
      },
    });
  } catch (error) {
    console.error('Referral completion error:', error);
    res.status(500).json({ message: 'Failed to complete referral', error: error.message });
  }
});

module.exports = router;
