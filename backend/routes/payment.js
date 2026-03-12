const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const axios = require('axios');
const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const crypto = require('crypto');

// Initialize Stripe (use environment variables)
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// === PAYSTACK INTEGRATION ===

/**
 * Initialize Paystack payment
 */
router.post('/paystack/initialize', async (req, res) => {
  try {
    const { amount, email, userId, rideId, metadata } = req.body;

    if (!amount || !email || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: Math.round(amount * 100), // Convert to kobo
        email,
        metadata: {
          userId,
          rideId,
          ...metadata,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status) {
      const payment = new Payment({
        paymentId: `PAY_${Date.now()}`,
        userId,
        rideId: rideId || null,
        amount,
        paymentMethod: 'paystack',
        paystackReference: response.data.data.reference,
        paystackAccessCode: response.data.data.access_code,
        status: 'pending',
      });

      await payment.save();

      return res.json({
        success: true,
        message: 'Payment initialized successfully',
        data: {
          authorizationUrl: response.data.data.authorization_url,
          accessCode: response.data.data.access_code,
          reference: response.data.data.reference,
          paymentId: payment._id,
        },
      });
    }

    res.status(400).json({ message: 'Failed to initialize payment' });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
});

/**
 * Verify Paystack payment
 */
router.post('/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status && response.data.data.status === 'success') {
      const payment = await Payment.findOne({ paystackReference: reference });

      if (payment) {
        payment.status = 'completed';
        payment.completedAt = new Date();
        await payment.save();

        // If payment is for wallet, add credit
        if (payment.walletId) {
          const wallet = await Wallet.findByIdAndUpdate(
            payment.walletId,
            {
              $inc: { balance: payment.amount },
            },
            { new: true }
          );
        }

        return res.json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            paymentId: payment._id,
            status: payment.status,
            amount: payment.amount,
          },
        });
      }
    }

    res.status(400).json({ message: 'Payment verification failed' });
  } catch (error) {
    console.error('Paystack verification error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

/**
 * Paystack webhook for payment confirmation
 */
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = JSON.parse(req.body);

      if (event.event === 'charge.success') {
        const reference = event.data.reference;
        const payment = await Payment.findOne({ paystackReference: reference });

        if (payment) {
          payment.status = 'completed';
          payment.completedAt = new Date();
          await payment.save();

          // Update wallet if applicable
          if (payment.walletId) {
            await Wallet.findByIdAndUpdate(
              payment.walletId,
              { $inc: { balance: payment.amount } },
              { new: true }
            );
          }
        }
      }

      res.json({ success: true });
    } else {
      res.status(401).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// === STRIPE INTEGRATION ===

/**
 * Create Stripe payment intent
 */
router.post('/stripe/create-intent', async (req, res) => {
  try {
    const { amount, userId, rideId, description } = req.body;

    if (!amount || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        rideId: rideId || 'wallet_topup',
      },
      description,
    });

    const payment = new Payment({
      paymentId: `STR_${Date.now()}`,
      userId,
      rideId: rideId || null,
      amount,
      paymentMethod: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      status: 'processing',
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
        intentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error('Stripe intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
});

/**
 * Confirm Stripe payment
 */
router.post('/stripe/confirm', async (req, res) => {
  try {
    const { intentId, paymentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

    if (paymentIntent.status === 'succeeded') {
      let payment = await Payment.findById(paymentId);
      payment.status = 'completed';
      payment.completedAt = new Date();
      await payment.save();

      // Update wallet
      if (payment.walletId) {
        await Wallet.findByIdAndUpdate(
          payment.walletId,
          { $inc: { balance: payment.amount } },
          { new: true }
        );
      }

      res.json({
        success: true,
        message: 'Payment confirmed',
        data: { payment },
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    res.status(500).json({ message: 'Payment confirmation failed', error: error.message });
  }
});

/**
 * Get payment history for user
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
});

/**
 * Process refund
 */
router.post('/refund', async (req, res) => {
  try {
    const { paymentId, refundAmount, refundReason } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentMethod === 'stripe') {
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: Math.round((refundAmount || payment.amount) * 100),
      });

      payment.status = 'refunded';
      payment.refundAmount = refundAmount || payment.amount;
      payment.refundReason = refundReason;
      payment.refundProcessedAt = new Date();
      await payment.save();

      res.json({ success: true, message: 'Refund processed', data: refund });
    } else if (payment.paymentMethod === 'paystack') {
      // Paystack refund via API
      const response = await axios.post(
        'https://api.paystack.co/refund',
        {
          transaction: payment.paystackReference,
          amount: Math.round((refundAmount || payment.amount) * 100),
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      if (response.data.status) {
        payment.status = 'refunded';
        payment.refundAmount = refundAmount || payment.amount;
        payment.refundReason = refundReason;
        payment.refundProcessedAt = new Date();
        await payment.save();

        res.json({ success: true, message: 'Refund processed', data: response.data });
      }
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund processing failed', error: error.message });
  }
});

module.exports = router;
