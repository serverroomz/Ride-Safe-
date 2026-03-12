const express = require('express');
const router = express.Router();
const KYC = require('../models/KYC');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kyc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  },
});

/**
 * Submit KYC for driver or rider
 */
router.post('/submit', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'documentFrontImage', maxCount: 1 },
  { name: 'documentBackImage', maxCount: 1 },
  { name: 'registrationCertificateImage', maxCount: 1 },
  { name: 'insuranceDocumentImage', maxCount: 1 },
  { name: 'vehicleInspectionCertificate', maxCount: 1 },
  { name: 'driversLicenseImage', maxCount: 1 },
  { name: 'addressProofDocument', maxCount: 1 },
]), async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      documentType,
      documentNumber,
      documentExpiryDate,
      vehicleRegistrationNumber,
      vehicleType,
      vehicleColor,
      vehicleModel,
      vehicleManufacturingYear,
      driversLicenseNumber,
      driversLicenseExpiryDate,
      address,
      city,
      state,
      zipCode,
      bankName,
      accountNumber,
      accountHolderName,
      bankCode,
      userType = 'driver',
      agreedToTerms,
    } = req.body;

    // Check if KYC already exists
    let kyc = await KYC.findOne({ userId });
    
    if (kyc && kyc.verificationStatus === 'verified') {
      return res.status(400).json({ 
        message: 'KYC already verified for this user' 
      });
    }

    // Build file paths
    const fileData = {
      profilePhoto: req.files?.profilePhoto?.[0]?.path,
      documentFrontImage: req.files?.documentFrontImage?.[0]?.path,
      documentBackImage: req.files?.documentBackImage?.[0]?.path,
      registrationCertificateImage: req.files?.registrationCertificateImage?.[0]?.path,
      insuranceDocumentImage: req.files?.insuranceDocumentImage?.[0]?.path,
      vehicleInspectionCertificate: req.files?.vehicleInspectionCertificate?.[0]?.path,
      driversLicenseImage: req.files?.driversLicenseImage?.[0]?.path,
      addressProofDocument: req.files?.addressProofDocument?.[0]?.path,
    };

    const kycData = {
      userId,
      userType,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      documentType,
      documentNumber,
      documentExpiryDate,
      address,
      city,
      state,
      zipCode,
      bankName,
      accountNumber,
      accountHolderName,
      bankCode,
      agreedToTerms: agreedToTerms === 'true',
      termsAgreedDate: new Date(),
      verificationStatus: 'pending_review',
      ...fileData,
    };

    // Driver-specific fields
    if (userType === 'driver') {
      kycData.vehicleRegistrationNumber = vehicleRegistrationNumber;
      kycData.vehicleType = vehicleType;
      kycData.vehicleColor = vehicleColor;
      kycData.vehicleModel = vehicleModel;
      kycData.vehicleManufacturingYear = vehicleManufacturingYear;
      kycData.driversLicenseNumber = driversLicenseNumber;
      kycData.driversLicenseExpiryDate = driversLicenseExpiryDate;
    }

    if (kyc) {
      // Update existing KYC
      Object.assign(kyc, kycData);
      await kyc.save();
    } else {
      // Create new KYC
      kyc = new KYC(kycData);
      await kyc.save();
    }

    // Update user document if needed
    await User.findByIdAndUpdate(userId, {
      kycStatus: 'pending',
      kycSubmittedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'KYC submitted successfully and pending review',
      data: {
        kycId: kyc._id,
        status: kyc.verificationStatus,
      },
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ 
      message: 'KYC submission failed', 
      error: error.message 
    });
  }
});

/**
 * Get KYC status for user
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const kyc = await KYC.findOne({ userId }).select(
      'verificationStatus rejectionReason verificationDate userType'
    );

    if (!kyc) {
      return res.json({
        success: true,
        data: {
          status: 'not_started',
          message: 'KYC not yet submitted',
        },
      });
    }

    res.json({
      success: true,
      data: {
        status: kyc.verificationStatus,
        rejectionReason: kyc.rejectionReason,
        verificationDate: kyc.verificationDate,
        userType: kyc.userType,
      },
    });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    res.status(500).json({ message: 'Failed to fetch KYC status' });
  }
});

/**
 * Get pending KYC submissions (admin only)
 */
router.get('/pending', async (req, res) => {
  try {
    const pendingKYCs = await KYC.find({ verificationStatus: 'pending_review' })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: pendingKYCs.length,
      data: pendingKYCs,
    });
  } catch (error) {
    console.error('Error fetching pending KYCs:', error);
    res.status(500).json({ message: 'Failed to fetch pending KYCs' });
  }
});

/**
 * Approve KYC (admin only)
 */
router.post('/approve/:kycId', async (req, res) => {
  try {
    const { kycId } = req.params;
    const { verifiedBy, notes } = req.body;

    const kyc = await KYC.findByIdAndUpdate(
      kycId,
      {
        verificationStatus: 'verified',
        verifiedBy,
        verificationDate: new Date(),
        verificationNotes: notes,
      },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    // Update user status
    await User.findByIdAndUpdate(kyc.userId, {
      kycStatus: 'verified',
      verified: true,
    });

    res.json({
      success: true,
      message: 'KYC approved successfully',
      data: kyc,
    });
  } catch (error) {
    console.error('KYC approval error:', error);
    res.status(500).json({ message: 'KYC approval failed', error: error.message });
  }
});

/**
 * Reject KYC (admin only)
 */
router.post('/reject/:kycId', async (req, res) => {
  try {
    const { kycId } = req.params;
    const { rejectionReason, verifiedBy } = req.body;

    const kyc = await KYC.findByIdAndUpdate(
      kycId,
      {
        verificationStatus: 'rejected',
        rejectionReason,
        verifiedBy,
      },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    // Update user status
    await User.findByIdAndUpdate(kyc.userId, {
      kycStatus: 'rejected',
      verified: false,
    });

    res.json({
      success: true,
      message: 'KYC rejected',
      data: kyc,
    });
  } catch (error) {
    console.error('KYC rejection error:', error);
    res.status(500).json({ message: 'KYC rejection failed', error: error.message });
  }
});

/**
 * Update KYC status
 */
router.patch('/update/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const kyc = await KYC.findOneAndUpdate(
      { userId },
      { $set: updates, updatedAt: new Date() },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    res.json({
      success: true,
      message: 'KYC updated successfully',
      data: kyc,
    });
  } catch (error) {
    console.error('KYC update error:', error);
    res.status(500).json({ message: 'KYC update failed', error: error.message });
  }
});

module.exports = router;
