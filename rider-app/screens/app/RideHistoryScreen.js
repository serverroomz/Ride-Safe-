import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const API_URL = 'http://your-api-url:5000/api';

export default function RideHistoryScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const userData = JSON.parse(userStr);
      setUser(userData);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_URL}/rides/history/${userData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRides(response.data.rides);
    } catch (error) {
      console.log('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRideCard = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideInfo}>
        <Text style={styles.pickup}>{item.pickupLocation?.address}</Text>
        <Text style={styles.arrow}>↓</Text>
        <Text style={styles.dropoff}>{item.dropLocation?.address}</Text>
      </View>

      <View style={styles.rideDetails}>
        <View>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{moment(item.endTime).format('DD MMM YYYY')}</Text>
        </View>
        <View>
          <Text style={styles.label}>Fare</Text>
          <Text style={styles.value}>₹ {item.actualFare}</Text>
        </View>
        <View>
          <Text style={styles.label}>Rating</Text>
          <Text style={styles.value}>{item.rating ? item.rating + ' ⭐' : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ride history yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10
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
    marginBottom: 15
  },
  pickup: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  arrow: {
    fontSize: 14,
    color: '#999',
    marginVertical: 5
  },
  dropoff: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999'
  }
});
