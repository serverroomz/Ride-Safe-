const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Ride = require('../models/Ride');
const { v4: uuidv4 } = require('uuid');

// Get active ride (waiting for bids)
router.get('/ride/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('riderId', 'phone fullName');

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Get associated bids
    const bids = await Bid.find({ rideId: req.params.rideId, status: 'active' })
      .populate('driverId', 'fullName rating totalRides');

    res.json({ ride, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit bid as driver
router.post('/submit-bid', async (req, res) => {
  try {
    const { rideId, driverId, bidPrice, driverLocation, estimatedArrivalTime } = req.body;

    if (!rideId || !driverId || !bidPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ error: 'Ride is no longer available for bidding' });
    }

    const bid = new Bid({
      bidId: uuidv4(),
      rideId,
      driverId,
      bidPrice,
      driverLocation,
      estimatedArrivalTime,
      status: 'active'
    });

    await bid.save();

    res.json({
      success: true,
      message: 'Bid submitted successfully',
      bid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bids on a ride
router.get('/bids/:rideId', async (req, res) => {
  try {
    const bids = await Bid.find({ rideId: req.params.rideId })
      .populate('driverId', 'fullName rating totalRides')
      .sort({ bidPrice: 1 }); // Sort by price ascending

    res.json({ bids, count: bids.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a bid (rider accepts driver)
router.post('/accept-bid', async (req, res) => {
  try {
    const { bidId, rideId } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Update bid status
    bid.status = 'accepted';
    bid.acceptedAt = new Date();
    await bid.save();

    // Update ride
    ride.driverId = bid.driverId;
    ride.bidId = bidId;
    ride.estimatedFare = bid.bidPrice;
    ride.status = 'accepted';
    await ride.save();

    // Mark other bids as rejected
    await Bid.updateMany(
      { rideId, _id: { $ne: bidId } },
      { status: 'rejected' }
    );

    res.json({
      success: true,
      message: 'Bid accepted. Driver assigned.',
      ride
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Driver rejects a ride
router.post('/reject-ride', async (req, res) => {
  try {
    const { bidId } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    bid.status = 'rejected';
    await bid.save();

    res.json({ success: true, message: 'Ride rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
