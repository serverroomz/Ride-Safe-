// Ride Fare Calculation Algorithm with Surge Pricing Support
const FareCalculation = require('../models/FareCalculation');
const SurgePricing = require('../models/SurgePricing');
const PromoCode = require('../models/PromoCode');

const RATES = {
  baseFare: 100, // 100 NGN base fare
  perKmRate: 50, // 50 NGN per km
  perMinuteRate: 2, // 2 NGN per minute
  platformCommissionPercent: 20, // 20% platform commission
  minimumFare: 200, // Minimum 200 NGN
};

const RIDE_TYPE_PREMIUM = {
  standard: 0,
  premium: 500, // 500 NGN extra
  shared: -100, // 100 NGN discount for shared rides
  diaspora: 1000, // 1000 NGN for long-distance diaspora rides
  escort: 1500, // 1500 NGN for safety features
};

const LOCATION_CHARGES = {
  airport: 2000, // 2000 NGN airport fee
  tollBody: 500, // 500 NGN toll charge
};

/**
 * Calculate ride fare with all modifiers
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Fare breakdown and total
 */
async function calculateFare(params) {
  const {
    distance, // in km
    estimatedTime, // in minutes
    pickupLat,
    pickupLng,
    dropLat,
    dropLng,
    rideType = 'standard',
    userId,
    city,
    promoCode = null,
    isAirportPickup = false,
    isAirportDropoff = false,
  } = params;

  try {
    // Step 1: Calculate base components
    const baseFare = RATES.baseFare;
    const distanceFare = distance * RATES.perKmRate;
    const timeFare = estimatedTime * RATES.perMinuteRate;
    const subtotal = baseFare + distanceFare + timeFare;

    // Step 2: Get surge pricing multiplier
    let surgePricingMultiplier = 1;
    let surgeAmount = 0;
    const surgePricing = await getSurgePricingMultiplier(city, pickupLat, pickupLng);
    if (surgePricing) {
      surgePricingMultiplier = surgePricing.multiplier;
      surgeAmount = subtotal * (surgePricingMultiplier - 1);
    }

    // Step 3: Apply ride type premium
    const rideTypePremium = RIDE_TYPE_PREMIUM[rideType] || 0;

    // Step 4: Add location charges
    let locationCharges = 0;
    if (isAirportPickup || isAirportDropoff) {
      locationCharges = LOCATION_CHARGES.airport;
    }

    // Step 5: Calculate subtotal with surge
    const subtotalWithSurge = subtotal + surgeAmount + locationCharges + rideTypePremium;

    // Step 6: Apply promo code discount
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = await applyPromoCode(promoCode, subtotalWithSurge, rideType, userId);
    }

    // Step 7: Calculate taxes (5% tax rate in Nigeria)
    const taxRate = 0.05;
    const taxAmount = (subtotalWithSurge - discountAmount) * taxRate;

    // Step 8: Calculate final amounts
    const totalBeforeCommission = subtotalWithSurge - discountAmount + taxAmount;
    const platformCommission = subtotalWithSurge * (RATES.platformCommissionPercent / 100);
    const driverEarnings = subtotalWithSurge - platformCommission;
    const totalFare = Math.max(totalBeforeCommission, RATES.minimumFare);

    // Step 9: Store calculation record
    const fareRecord = new FareCalculation({
      userId,
      baseFare,
      distanceKm: distance,
      distanceFare,
      estimatedTime,
      timeFare,
      surgePricingMultiplier,
      surgePricingAmount: surgeAmount,
      promoCodeDiscount: discountAmount,
      airportFee: locationCharges,
      rideTypePremium,
      subtotal: subtotalWithSurge,
      platformFee: platformCommission,
      driverEarnings,
      platformCommission,
      totalFare,
      rideType,
      city,
      breakdown: {
        base: baseFare,
        distance: distanceFare,
        time: timeFare,
        surge: surgeAmount,
        discounts: discountAmount,
        taxes: taxAmount,
        total: totalFare,
      },
    });

    await fareRecord.save();

    return {
      success: true,
      fare: {
        baseFare,
        distanceFare,
        timeFare,
        surgeMultiplier: surgePricingMultiplier,
        surgeAmount,
        rideTypePremium,
        locationCharges,
        discountAmount,
        taxAmount,
        subtotal: subtotalWithSurge,
        platformCommission,
        driverEarnings,
        totalFare,
      },
      breakdown: {
        base: baseFare,
        distance: distanceFare,
        time: timeFare,
        surge: surgeAmount,
        discounts: discountAmount,
        taxes: taxAmount,
        total: totalFare,
      },
    };
  } catch (error) {
    console.error('Fare calculation error:', error);
    return {
      success: false,
      message: 'Failed to calculate fare',
      error: error.message,
    };
  }
}

/**
 * Get surge pricing multiplier for a location
 */
async function getSurgePricingMultiplier(city, latitude, longitude) {
  try {
    const now = new Date();
    const surgePricing = await SurgePricing.findOne({
      city,
      isActive: true,
      effectiveFrom: { $lte: now },
      effectiveTo: { $gte: now },
    });

    return surgePricing;
  } catch (error) {
    console.error('Error fetching surge pricing:', error);
    return null;
  }
}

/**
 * Apply promo code discount
 */
async function applyPromoCode(code, amount, rideType, userId) {
  try {
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
    });

    if (!promoCode) {
      return 0;
    }

    // Check minimum ride amount
    if (amount < promoCode.minRideAmount) {
      return 0;
    }

    // Check usage limit
    if (promoCode.usageCount >= promoCode.usageLimit) {
      return 0;
    }

    // Check applicable ride types
    if (promoCode.applicableRideTypes.length > 0 && !promoCode.applicableRideTypes.includes(rideType)) {
      return 0;
    }

    // Check if user has already used this code
    if (promoCode.usedBy.includes(userId)) {
      return 0;
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

    return Math.min(discount, amount); // Discount cannot exceed ride amount
  } catch (error) {
    console.error('Error applying promo code:', error);
    return 0;
  }
}

/**
 * Calculate route distance and time using Google Maps API or similar
 */
async function calculateRouteDetails(pickupLat, pickupLng, dropLat, dropLng) {
  try {
    // This would integrate with Google Maps API or OSRM
    // For now, using simple Haversine formula for distance
    const distance = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);
    
    // Estimate time: average speed 40 km/h in traffic
    const estimatedTime = Math.ceil((distance / 40) * 60);

    return {
      distance,
      estimatedTime,
    };
  } catch (error) {
    console.error('Error calculating route details:', error);
    return null;
  }
}

/**
 * Haversine formula to calculate distance between two coordinates
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = {
  calculateFare,
  calculateRouteDetails,
  getSurgePricingMultiplier,
  applyPromoCode,
  calculateHaversineDistance,
};
