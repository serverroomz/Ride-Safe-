import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { io } from 'socket.io-client';

const API_URL = 'http://your-api-url:5000/api';
const SOCKET_URL = 'http://your-api-url:5000';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    loadUser();
    setupSocket();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      setUser(JSON.parse(userStr));
    } catch (error) {
      console.log('Error loading user:', error);
    }
  };

  const setupSocket = () => {
    const socket = io(SOCKET_URL);
    socket.on('newBidReceived', (data) => {
      Toast.show({ type: 'info', text1: 'New bid received from driver' });
      // Update UI with new bid
    });
  };

  const requestRide = async () => {
    if (!pickup || !dropoff) {
      Toast.show({ type: 'error', text1: 'Please enter pickup and dropoff locations' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/rides/request-ride`, {
        riderId: user._id,
        pickupLocation: { address: pickup, latitude: 0, longitude: 0 },
        dropLocation: { address: dropoff, latitude: 0, longitude: 0 },
        estimatedDistance: 5,
        estimatedFare: estimatedFare || 100,
        rideType: 'standard'
      });

      if (response.data.success) {
        setActiveRide(response.data.ride);
        Toast.show({ type: 'success', text1: 'Ride requested! Waiting for driver bids...' });
        navigation.navigate('RideMap', { rideId: response.data.ride._id });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error requesting ride' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.fullName || 'Rider'}!</Text>
        <Text style={styles.subtitle}>Where do you want to go?</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.locationInput}>
          <Icon name="location" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            value={pickup}
            onChangeText={setPickup}
            editable={!loading}
          />
        </View>

        <View style={styles.locationInput}>
          <Icon name="pin" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Dropoff location"
            value={dropoff}
            onChangeText={setDropoff}
            editable={!loading}
          />
        </View>

        {estimatedFare && (
          <View style={styles.fareEstimate}>
            <Text style={styles.fareLabel}>Estimated Fare:</Text>
            <Text style={styles.fareAmount}>₹ {estimatedFare}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={requestRide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="car" size={20} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Request Ride</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.savedLocations}>
        <Text style={styles.sectionTitle}>Saved Locations</Text>
        <TouchableOpacity style={styles.locationCard}>
          <Icon name="home" size={24} color="#000" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.locationName}>Home</Text>
            <Text style={styles.locationAddress}>Your home address</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationCard}>
          <Icon name="briefcase" size={24} color="#000" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.locationName}>Work</Text>
            <Text style={styles.locationAddress}>Your work address</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  form: {
    padding: 20,
    backgroundColor: '#fff'
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    marginLeft: 10
  },
  fareEstimate: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fareLabel: {
    fontSize: 14,
    color: '#666'
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  savedLocations: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600'
  },
  locationAddress: {
    fontSize: 12,
    color: '#999',
    marginTop: 3
  }
});
