import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { io } from 'socket.io-client';
import Geolocation from 'react-native-geolocation-service';

const API_URL = 'http://your-api-url:5000/api';
const SOCKET_URL = 'http://your-api-url:5000';

export default function AvailableRidesScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadDriver();
    setupSocket();
    if (isOnline) {
      startLocationTracking();
    }
  }, [isOnline]);

  const loadDriver = async () => {
    try {
      const driverStr = await AsyncStorage.getItem('driver');
      setDriver(JSON.parse(driverStr));
    } catch (error) {
      console.log('Error loading driver:', error);
    }
  };

  const setupSocket = () => {
    const socket = io(SOCKET_URL);

    socket.on('newRideAvailable', async (data) => {
      setRides((prev) => [data, ...prev]);
      Toast.show({ type: 'info', text1: 'New ride available!' });
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });
  };

  const startLocationTracking = () => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Emit location to socket
        const socket = io(SOCKET_URL);
        socket.emit('driverLocationUpdate', {
          driverId: driver?._id,
          location: { latitude, longitude }
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 200, distanceFilter: 100 }
    );

    return () => Geolocation.clearWatch(watchId);
  };

  const toggleOnlineStatus = async () => {
    if (!isOnline) {
      setIsOnline(true);
      Toast.show({ type: 'success', text1: 'You are now online' });
      const socket = io(SOCKET_URL);
      socket.emit('driverOnline', {
        driverId: driver?._id,
        location
      });
    } else {
      setIsOnline(false);
      Toast.show({ type: 'info', text1: 'You are now offline' });
      const socket = io(SOCKET_URL);
      socket.emit('driverOffline', {
        driverId: driver?._id
      });
    }
  };

  const submitBid = async (rideId, estimatedFare) => {
    try {
      const response = await axios.post(`${API_URL}/bidding/submit-bid`, {
        rideId,
        driverId: driver._id,
        bidPrice: estimatedFare,
        driverLocation: location,
        estimatedArrivalTime: 300 // 5 minutes
      });

      if (response.data.success) {
        Toast.show({ type: 'success', text1: 'Bid submitted successfully' });
        setRides((prev) => prev.filter((r) => r.rideId !== rideId));
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error submitting bid' });
    }
  };

  const renderRideCard = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideInfo}>
        <Icon name="location" size={20} color="#000" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.pickup}>{item.pickupLocation?.address}</Text>
          <Text style={styles.dropoff}>{item.dropLocation?.address}</Text>
        </View>
      </View>

      <View style={styles.rideMetrics}>
        <View style={styles.metric}>
          <Text style={styles.label}>Est. Fare</Text>
          <Text style={styles.value}>₹ {item.estimatedFare}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.label}>Distance</Text>
          <Text style={styles.value}>{item.estimatedDistance} km</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bidButton}
        onPress={() => submitBid(item.rideId, item.estimatedFare)}
      >
        <Text style={styles.bidButtonText}>Submit Bid</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Available Rides</Text>
          <Text style={styles.status}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, isOnline && styles.toggleButtonActive]}
          onPress={toggleOnlineStatus}
        >
          <Text style={styles.toggleButtonText}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>
      </View>

      {!isOnline ? (
        <View style={styles.offlineMessage}>
          <Icon name="alert-circle" size={40} color="#999" />
          <Text style={styles.offlineText}>You are offline</Text>
          <Text style={styles.offlineSubtext}>
            Go online to receive ride requests
          </Text>
        </View>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#e74c3c" />
          ) : rides.length > 0 ? (
            <FlatList
              data={rides}
              renderItem={renderRideCard}
              keyExtractor={(item) => item.rideId}
              contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="search" size={40} color="#999" />
              <Text style={styles.emptyText}>No rides available</Text>
              <Text style={styles.emptySubtext}>
                Check back soon or explore nearby areas
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  toggleButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  toggleButtonActive: {
    backgroundColor: '#27ae60'
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  offlineMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  offlineText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15
  },
  offlineSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5
  },
  rideCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  rideInfo: {
    flexDirection: 'row',
    marginBottom: 15
  },
  pickup: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  dropoff: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8
  },
  rideMetrics: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 10
  },
  metric: {
    flex: 1
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  bidButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5
  }
});
