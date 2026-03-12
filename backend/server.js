
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/ride');
const walletRoutes = require('./routes/wallet');
const biddingRoutes = require('./routes/bidding');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gocab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bidding', biddingRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: "Taxi API running", status: "ok" }));

// Socket.IO real-time tracking & notifications
const onlineDrivers = new Map(); // { driverId: { location, socketId } }
const rideTracking = new Map(); // { rideId: { driverId, riderId } }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Driver goes online
  socket.on("driverOnline", (data) => {
    const { driverId, location } = data;
    onlineDrivers.set(driverId, { location, socketId: socket.id });
    socket.join(`driver_${driverId}`);
    io.emit("driverOnlineStatus", { driverId, status: "online", onlineCount: onlineDrivers.size });
    console.log(`Driver ${driverId} is online`);
  });

  // Driver updates location
  socket.on("driverLocationUpdate", (data) => {
    const { driverId, location, rideId } = data;
    if (onlineDrivers.has(driverId)) {
      const driver = onlineDrivers.get(driverId);
      driver.location = location;
      driver.lastUpdate = new Date();
    }
    
    // Broadcast to riders if in active ride
    if (rideId && rideTracking.has(rideId)) {
      io.to(`ride_${rideId}`).emit("driverLocationBroadcast", { driverId, location });
    }
  });

  // Rider requests ride - notify nearby drivers
  socket.on("rideRequested", (data) => {
    const { rideId, riderId, pickupLocation, dropLocation, estimatedFare } = data;
    rideTracking.set(rideId, { riderId, pickupLocation });
    socket.join(`ride_${rideId}`);
    
    // Notify all online drivers within range
    onlineDrivers.forEach((driver, driverId) => {
      const distance = calculateDistance(pickupLocation, driver.location);
      if (distance < 10) { // 10 km radius
        io.to(`driver_${driverId}`).emit("newRideAvailable", {
          rideId,
          riderId,
          pickupLocation,
          dropLocation,
          estimatedFare,
          driverDistance: distance
        });
      }
    });
  });

  // Driver submits bid
  socket.on("bidSubmitted", (data) => {
    const { rideId, driverId, bidPrice } = data;
    io.to(`ride_${rideId}`).emit("newBidReceived", { driverId, bidPrice });
  });

  // Ride started
  socket.on("rideStarted", (data) => {
    const { rideId, driverId } = data;
    io.to(`ride_${rideId}`).emit("rideInProgress", { rideId, driverId });
  });

  // Ride completed
  socket.on("rideCompleted", (data) => {
    const { rideId, driverId, actualFare } = data;
    io.to(`ride_${rideId}`).emit("rideEnded", { rideId, actualFare });
    rideTracking.delete(rideId);
  });

  // Driver goes offline
  socket.on("driverOffline", (data) => {
    const { driverId } = data;
    onlineDrivers.delete(driverId);
    io.emit("driverOnlineStatus", { driverId, status: "offline", onlineCount: onlineDrivers.size });
    socket.leave(`driver_${driverId}`);
    console.log(`Driver ${driverId} is offline`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Helper function to calculate distance (simplified Haversine)
function calculateDistance(loc1, loc2) {
  const R = 6371; // Earth radius in km
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLng = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
