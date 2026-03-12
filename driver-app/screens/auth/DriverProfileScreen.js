import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_URL = 'http://your-api-url:5000/api';

export default function DriverProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = async () => {
    if (!fullName.trim() || !licenseNumber.trim() || !vehicleNumber.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }

    setLoading(true);
    try {
      const driverStr = await AsyncStorage.getItem('driver');
      const driver = JSON.parse(driverStr);
      const token = await AsyncStorage.getItem('driverToken');

      const response = await axios.post(`${API_URL}/auth/update-profile`, {
        userId: driver.userId,
        fullName,
        licenseNumber,
        vehicleNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await AsyncStorage.setItem('driver', JSON.stringify(response.data.user));
        Toast.show({ type: 'success', text1: 'Profile updated' });
        navigation.reset({
          index: 0,
          routes: [{ name: 'AvailableRides' }]
        });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Complete Your Driver Profile</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        <Text style={styles.label}>License Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your license number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          editable={!loading}
        />

        <Text style={styles.label}>Vehicle Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your vehicle number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCompleteProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
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
  form: {
    padding: 20,
    marginTop: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
