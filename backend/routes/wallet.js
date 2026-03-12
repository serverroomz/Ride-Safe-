const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Ride = require('../models/Ride');
const { v4: uuidv4 } = require('uuid');

// Get wallet balance
router.get('/balance/:userId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({ balance: wallet.balance, wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add money to wallet
router.post('/add-money', async (req, res) => {
  try {
    const { userId, amount, paymentMethodId } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount or userId' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const txId = uuidv4();
    wallet.balance += amount;
    wallet.transactions.push({
      txId,
      type: 'credit',
      amount,
      description: 'Money added to wallet',
      timestamp: new Date()
    });

    await wallet.save();
    res.json({ success: true, newBalance: wallet.balance, txId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deduct fare after ride completion
router.post('/deduct-fare', async (req, res) => {
  try {
    const { userId, rideId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount or userId' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const txId = uuidv4();
    wallet.balance -= amount;
    wallet.transactions.push({
      txId,
      type: 'debit',
      amount,
      description: 'Fare payment',
      rideId,
      timestamp: new Date()
    });

    await wallet.save();
    res.json({ success: true, newBalance: wallet.balance, txId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history
router.get('/history/:userId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const transactions = wallet.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * limit, page * limit);

    res.json({ transactions, total: wallet.transactions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
