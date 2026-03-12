import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function DriverAccountScreen({ navigation }) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    try {
      const driverStr = await AsyncStorage.getItem('driver');
      setDriver(JSON.parse(driverStr));
    } catch (error) {
      console.log('Error loading driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('driverToken');
    await AsyncStorage.removeItem('driver');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }]
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Icon name="person-circle" size={80} color="#ddd" />
        </View>
        <Text style={styles.name}>{driver?.fullName || 'Driver'}</Text>
        <Text style={styles.phone}>{driver?.phone}</Text>
        <View style={styles.ratingBadge}>
          <Icon name="star" size={16} color="#e74c3c" />
          <Text style={styles.rating}>{driver?.rating?.toFixed(1) || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>License Number</Text>
          <Text style={styles.infoValue}>{driver?.licenseNumber || 'N/A'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Vehicle Number</Text>
          <Text style={styles.infoValue}>{driver?.vehicleNumber || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person" size={24} color="#000" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document" size={24} color="#000" />
          <Text style={styles.menuText}>Bank Details</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="shield" size={24} color="#000" />
          <Text style={styles.menuText}>Documents</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle" size={24} color="#000" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings" size={24} color="#000" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Driver App v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    marginBottom: 15
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  phone: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe8e3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c'
  },
  infoSection: {
    padding: 15,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  menu: {
    marginTop: 10
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500'
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  version: {
    textAlign: 'center',
    color: '#ccc',
    marginBottom: 20,
    fontSize: 12
  }
});
