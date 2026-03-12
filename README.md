# GoCab - Uber-Style Taxi Platform

Complete taxi sharing platform with rider app, driver app, admin dashboard, and backend API with driver bidding system.

## 🎯 Features Implemented

### ✅ Core Features
- **Rider Mobile App** (React Native) - Full-featured rider application
- **Driver Mobile App** (React Native) - Driver matching and earnings tracking
- **Admin Dashboard** (React) - Complete management interface
- **Node.js Backend API** - RESTful API with real-time Socket.IO support
- **Driver Bidding System** - inDrive style auction-based rides
- **Live Driver Tracking** - Socket.IO real-time location updates
- **Firebase Notifications** - Push notifications for riders and drivers
- **Wallet System** - User wallet with transaction history
- **OTP Login** - Phone-based authentication
- **Maps Integration** - Google Maps / OpenStreetMap ready

### Database Models
- **User** - Comprehensive user schema with roles (rider/driver/admin)
- **Ride** - Ride tracking with status and fare management
- **Bid** - Driver bidding on rides
- **Wallet** - Balance tracking and transaction history

## 📁 Project Structure

```
gocab-taxi-platform/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Ride.js          # Ride schema
│   │   ├── Bid.js           # Bidding schema
│   │   └── Wallet.js        # Wallet schema
│   ├── routes/
│   │   ├── auth.js          # Authentication (OTP, login)
│   │   ├── ride.js          # Ride management
│   │   ├── wallet.js        # Wallet transactions
│   │   └── bidding.js       # Driver bidding
│   ├── config/
│   │   └── firebase.js      # Firebase setup
│   ├── server.js            # Main server with Socket.IO
│   ├── package.json
│   └── .env.example
│
├── rider-app/               # React Native Rider App
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── OTPScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── app/
│   │       ├── HomeScreen.js
│   │       ├── RideMapScreen.js
│   │       ├── RideHistoryScreen.js
│   │       ├── WalletScreen.js
│   │       └── AccountScreen.js
│   ├── App.js
│   └── package.json
│
├── driver-app/              # React Native Driver App
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── DriverLoginScreen.js
│   │   │   ├── DriverOTPScreen.js
│   │   │   └── DriverProfileScreen.js
│   │   └── app/
│   │       ├── AvailableRidesScreen.js
│   │       ├── ActiveRideScreen.js
│   │       ├── EarningsScreen.js
│   │       └── DriverAccountScreen.js
│   ├── App.js
│   └── package.json
│
├── admin-dashboard/         # React Admin Dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Drivers.js
│   │   │   ├── Rides.js
│   │   │   ├── Wallet.js
│   │   │   └── Analytics.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── docs/
    ├── firebase_setup.md
    ├── maps_integration.md
    └── wallet_system.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- React Native CLI
- MongoDB
- Firebase Account
- Twilio Account (for OTP)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
MONGODB_URI=mongodb://localhost:27017/gocab
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_PRIVATE_KEY=your_firebase_key
FIREBASE_CLIENT_EMAIL=your_firebase_email

# Run server
npm start
# or for development with auto-reload
npm run dev
```

### Rider App Setup (React Native)

```bash
cd rider-app
npm install

# Configure API URL in screens (change 'your-api-url' to actual)
# Update API_URL in each screen file

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Driver App Setup (React Native)

```bash
cd driver-app
npm install

# Configure API URL in screens
npm run android  # or npm run ios
```

### Admin Dashboard Setup (React)

```bash
cd admin-dashboard
npm install
npm start
# Opens on http://localhost:3000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/request-otp` - Request OTP login
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/update-profile` - Update user profile

### Rides
- `POST /api/rides/request-ride` - Create new ride request
- `GET /api/rides/active/:userId` - Get active rides
- `GET /api/rides/history/:userId` - Get ride history
- `POST /api/rides/update-status` - Update ride status
- `POST /api/rides/complete-ride` - Complete ride and payment
- `POST /api/rides/rate-ride` - Rate and review ride

### Bidding
- `POST /api/bidding/submit-bid` - Submit driver bid
- `GET /api/bidding/bids/:rideId` - Get all bids for ride
- `POST /api/bidding/accept-bid` - Accept driver bid
- `POST /api/bidding/reject-ride` - Reject ride

### Wallet
- `GET /api/wallet/balance/:userId` - Get wallet balance
- `POST /api/wallet/add-money` - Add money to wallet
- `POST /api/wallet/deduct-fare` - Deduct ride fare
- `GET /api/wallet/history/:userId` - Get transaction history

## 🔄 Socket.IO Events

### Driver Events
- `driverOnline` - Driver comes online
- `driverLocationUpdate` - Driver location update
- `driverOffline` - Driver goes offline

### Rider Events
- `rideRequested` - Rider requests ride
- `bidSubmitted` - Driver submits bid

### Broadcast Events
- `newRideAvailable` - New ride broadcast to drivers
- `newBidReceived` - New bid received by rider
- `driverLocationBroadcast` - Live driver location
- `rideInProgress` - Ride started
- `rideEnded` - Ride completed

## 📱 App Features

### Rider App
- ✅ OTP Login
- ✅ Home screen with pickup/dropoff
- ✅ Live map with driver tracking
- ✅ Ride history
- ✅ Wallet management
- ✅ Account settings
- ✅ Saved addresses
- ✅ Emergency contacts

### Driver App
- ✅ OTP Login
- ✅ Availability toggle (online/offline)
- ✅ Available rides browsing
- ✅ Bidding system
- ✅ Active ride tracking
- ✅ Real-time location sharing
- ✅ Earnings dashboard
- ✅ Document verification

### Admin Dashboard
- ✅ Dashboard with KPIs
- ✅ Users management
- ✅ Drivers management
- ✅ Rides monitoring
- ✅ Wallet transactions
- ✅ Analytics & charts
- ✅ Revenue metrics

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- OTP verification (Twilio integration)
- Role-based access control
- Secure wallet transactions
- Firebase token validation

## 💳 Payment Integration

- Wallet-based payment system
- Multiple payment methods (Card, UPI, Bank Transfer)
- Transaction history with detailed tracking
- Automatic fare deduction

## 🗺️ Maps Integration

Ready for:
- **Google Maps API** - Full integration support
- **OpenStreetMap** - Alternative mapping solution
- Real-time location tracking
- Route optimization
- Distance calculation

## 🔔 Notifications

Firebase Cloud Messaging setup for:
- Ride notifications (riders)
- Bid notifications (drivers)
- Payment confirmations
- Status updates
- Emergency alerts

## 📊 Database Schema

### User Schema
- Unique phone-based identification
- Role-based roles (rider/driver/admin)
- Profile information
- Verification status
- Location tracking
- Notification preferences

### Ride Schema
- Pickup and dropoff locations
- Estimated and actual fare
- Ride status tracking
- Rating and reviews
- Driver assignment via bidding

### Wallet Schema
- Current balance
- Transaction history
- Multiple payment methods
- Automatic expiry handling

## 🛠️ Configuration Files

### Environment Variables (.env)
```
MONGODB_URI=mongodb://localhost:27017/gocab
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
GOOGLE_MAPS_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

## 📚 Documentation

- [Firebase Setup Guide](./docs/firebase_setup.md)
- [Maps Integration Guide](./docs/maps_integration.md)
- [Wallet System Documentation](./docs/wallet_system.md)

## 🚀 Deployment

### Backend Deployment (Heroku, AWS, DigitalOcean)
```bash
# Push to platform
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your_uri
```

### Mobile Apps (App Store & Play Store)
- Build production APK/IPA
- Submit to respective stores
- Configure signing certificates

### Admin Dashboard (Vercel, Netlify)
```bash
npm run build
# Deploy the build folder
```

## 📈 Future Enhancements

- Group rides functionality
- Scheduled rides
- Premium ride options
- Driver incentives & bonuses
- Advanced analytics
- Multi-language support
- Accessibility features
- Dark mode UI

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Support

For support, email support@gocab.com or create an issue in the repository.

## 👥 Project Team

- Backend Development: Node.js, Express, MongoDB
- Mobile Development: React Native, Socket.IO
- Frontend: React, Charts.js
- DevOps: Docker, Cloud Deployment

---

**Last Updated**: March 11, 2026
**Version**: 1.0.0
