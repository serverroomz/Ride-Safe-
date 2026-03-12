import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const API_URL = 'http://your-api-url:5000/api';

export default function EarningsScreen() {
  const [rides, setRides] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const driverStr = await AsyncStorage.getItem('driver');
      const driverData = JSON.parse(driverStr);
      setDriver(driverData);

      const token = await AsyncStorage.getItem('driverToken');
      const response = await axios.get(
        `${API_URL}/rides/history/${driverData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const completedRides = response.data.rides.filter((r) => r.status === 'completed');
      setRides(completedRides);

      const total = completedRides.reduce((sum, ride) => sum + (ride.actualFare || 0), 0);
      setTotalEarnings(total);
    } catch (error) {
      console.log('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRideCard = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View>
          <Text style={styles.riderName}>Ride #{item._id.slice(-4)}</Text>
          <Text style={styles.date}>{moment(item.endTime).format('DD MMM YYYY, HH:mm')}</Text>
        </View>
        <Text style={styles.earnings}>₹ {item.actualFare}</Text>
      </View>

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <Icon name="location" size={16} color="#999" />
          <Text style={styles.detailText}>{item.pickupLocation?.address}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="pin" size={16} color="#999" />
          <Text style={styles.detailText}>{item.dropLocation?.address}</Text>
        </View>
      </View>

      {item.rating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating: {item.rating} ⭐</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.earningsCard}>
        <View>
          <Text style={styles.label}>Total Earnings</Text>
          <Text style={styles.amount}>₹ {totalEarnings.toFixed(2)}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{rides.length}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {driver?.rating ? driver.rating.toFixed(1) : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {rides.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Completed Rides</Text>
          <FlatList
            data={rides}
            renderItem={renderRideCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="document-outline" size={40} color="#999" />
          <Text style={styles.emptyText}>No completed rides yet</Text>
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
  earningsCard: {
    backgroundColor: '#e74c3c',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff'
  },
  statsContainer: {
    flexDirection: 'row'
  },
  stat: {
    alignItems: 'center',
    marginLeft: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 3
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10
  },
  rideCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee'
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  riderName: {
    fontSize: 14,
    fontWeight: '600'
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 3
  },
  earnings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c'
  },
  rideDetails: {
    marginBottom: 10
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  detailText: {
    fontSize: 12,
    marginLeft: 8,
    color: '#666',
    flex: 1
  },
  ratingContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  ratingText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10
  }
});
