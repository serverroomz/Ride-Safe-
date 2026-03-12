const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { v4: uuidv4 } = require('uuid');

// Create a new ride request
router.post('/request-ride', async (req, res) => {
  try {
    const {
      riderId,
      pickupLocation,
      dropLocation,
      estimatedDistance,
      estimatedFare,
      rideType
    } = req.body;

    if (!riderId || !pickupLocation || !dropLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rideId = uuidv4();

    const ride = new Ride({
      rideId,
      riderId,
      pickupLocation,
      dropLocation,
      estimatedDistance,
      estimatedFare,
      rideType: rideType || 'standard',
      status: 'requested',
      createdAt: new Date()
    });

    await ride.save();

    res.json({
      success: true,
      message: 'Ride request created. Waiting for driver bids.',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active rides (for riders)
router.get('/active/:userId', async (req, res) => {
  try {
    const rides = await Ride.find({
      riderId: req.params.userId,
      status: { $in: ['requested', 'accepted', 'in_progress'] }
    }).populate('driverId', 'fullName phone');

    res.json({ rides });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ride history
router.get('/history/:userId', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const rides = await Ride.find({
      $or: [
        { riderId: req.params.userId },
        { driverId: req.params.userId }
      ],
      status: { $in: ['completed', 'cancelled'] }
    })
      .populate('riderId', 'fullName phone')
      .populate('driverId', 'fullName phone rating')
      .sort({ endTime: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({ rides });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ride status
router.post('/update-status', async (req, res) => {
  try {
    const { rideId, status } = req.body;

    if (!['requested', 'accepted', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    ride.status = status;

    if (status === 'in_progress') {
      ride.startTime = new Date();
    } else if (status === 'completed') {
      ride.endTime = new Date();
    }

    await ride.save();
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete ride and process payment
router.post('/complete-ride', async (req, res) => {
  try {
    const { rideId, actualFare, paymentMethod } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    ride.actualFare = actualFare;
    ride.status = 'completed';
    ride.endTime = new Date();

    // Process payment
    if (paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ userId: ride.riderId });
      if (!wallet || wallet.balance < actualFare) {
        return res.status(400).json({ error: 'Insufficient wallet balance' });
      }

      wallet.balance -= actualFare;
      wallet.transactions.push({
        txId: uuidv4(),
        type: 'debit',
        amount: actualFare,
        description: 'Ride fare payment',
        rideId: ride._id,
        timestamp: new Date()
      });
      await wallet.save();
    }

    await ride.save();

    res.json({
      success: true,
      message: 'Ride completed',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate and review ride
router.post('/rate-ride', async (req, res) => {
  try {
    const { rideId, rating, review } = req.body;

    if (!rideId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    ride.rating = rating;
    ride.review = review;
    await ride.save();

    // Update driver rating
    if (ride.driverId) {
      const driver = await User.findById(ride.driverId);
      if (driver) {
        const allRides = await Ride.find({ driverId: driver._id, rating: { $exists: true } });
        const avgRating = allRides.reduce((sum, r) => sum + r.rating, 0) / allRides.length;
        driver.rating = avgRating;
        driver.totalRides = allRides.length;
        await driver.save();
      }
    }

    res.json({ success: true, message: 'Ride rated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;