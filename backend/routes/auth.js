const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');

// Initialize Twilio (configure with your credentials in .env)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to phone
const sendOTP = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your GoCab OTP is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhoneNumber,
      to: phone
    });
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

// Request OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      return res.status(400).json({ error: 'Phone and role are required' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({
        userId: uuidv4(),
        phone,
        role,
        otp,
        otpExpiresAt
      });
    } else {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
    }

    // In development, log OTP. In production, use Twilio
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${phone}: ${otp}`);
    } else {
      await sendOTP(phone, otp);
    }

    await user.save();
    res.json({ success: true, message: 'OTP sent successfully', phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP & Login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Clear OTP after verification
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Create wallet if doesn't exist
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = new Wallet({
        userId: user._id,
        balance: 0
      });
      await wallet.save();
    }

    res.json({
      success: true,
      token,
      user: {
        userId: user.userId,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
router.post('/update-profile', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.profilePhoto = req.body.profilePhoto || user.profilePhoto;

    // Driver-specific fields
    if (user.role === 'driver') {
      if (req.body.licenseNumber) user.licenseNumber = req.body.licenseNumber;
      if (req.body.vehicleNumber) user.vehicleNumber = req.body.vehicleNumber;
      if (req.body.vehicleDetails) user.vehicleDetails = req.body.vehicleDetails;
      if (req.body.bankAccount) user.bankAccount = req.body.bankAccount;
    }

    // Rider-specific fields
    if (user.role === 'rider') {
      if (req.body.savedAddresses) user.savedAddresses = req.body.savedAddresses;
      if (req.body.emergencyContacts) user.emergencyContacts = req.body.emergencyContacts;
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
