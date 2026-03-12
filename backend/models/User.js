const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  fullName: String,
  role: {
    type: String,
    enum: ['rider', 'driver', 'admin'],
    required: true
  },
  password: String,
  otp: String,
  otpExpiresAt: Date,
  profilePhoto: String,
  
  // Driver specific fields
  licenseNumber: String,
  licenseExpiry: Date,
  vehicleNumber: String,
  vehicleDetails: {
    make: String,
    model: String,
    color: String,
    year: Number
  },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  totalRides: { type: Number, default: 0 },
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  
  // Rider specific fields
  savedAddresses: [{
    label: String, // 'home', 'work', etc.
    latitude: Number,
    longitude: Number,
    address: String
  }],
  emergencyContacts: [{
    name: String,
    phone: String
  }],
  
  // Location tracking
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },
  isOnline: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Preferences
  language: { type: String, default: 'en' },
  notificationPreferences: {
    pushNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
