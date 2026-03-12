const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  userType: { type: String, enum: ['driver', 'rider'], default: 'driver' },
  
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  gender: String,
  profilePhoto: String,
  
  // Document Information
  documentType: {
    type: String,
    enum: ['national_id', 'passport', 'drivers_license', 'voters_card'],
    required: true
  },
  documentNumber: { type: String, required: true },
  documentFrontImage: String,
  documentBackImage: String,
  documentExpiryDate: Date,
  
  // Vehicle Information (for drivers)
  vehicleRegistrationNumber: String,
  vehicleType: String,
  vehicleColor: String,
  vehicleModel: String,
  vehicleManufacturingYear: Number,
  registrationCertificateImage: String,
  insuranceDocumentImage: String,
  vehicleInspectionCertificate: String,
  
  // Driver's License Information
  driversLicenseNumber: String,
  driversLicenseExpiryDate: Date,
  driversLicenseImage: String,
  
  // Address Information
  address: String,
  city: String,
  state: String,
  zipCode: String,
  addressProofDocument: String,
  
  // Bank Information
  bankName: String,
  accountNumber: String,
  accountHolderName: String,
  bankCode: String,
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['not_started', 'pending_review', 'verified', 'rejected', 'expired'],
    default: 'not_started'
  },
  rejectionReason: String,
  verificationNotes: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationDate: Date,
  
  // Additional Fields
  backgroundCheckPassed: { type: Boolean, default: false },
  backgroundCheckDate: Date,
  backgroundCheckProvider: String,
  
  agreedToTerms: { type: Boolean, default: false },
  termsAgreedDate: Date,
  
  // TSC (Traffic Safety Certificate) for drivers
  tscCertificate: String,
  tscExpiryDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: Date
});

kycSchema.index({ userId: 1 });
kycSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('KYC', kycSchema);
