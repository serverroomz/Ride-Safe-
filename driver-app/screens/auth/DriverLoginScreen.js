import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_URL = 'http://your-api-url:5000/api';

export default function DriverLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!phone || phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Invalid phone number' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, {
        phone,
        role: 'driver'
      });

      if (response.data.success) {
        Toast.show({ type: 'success', text1: 'OTP sent successfully' });
        navigation.navigate('OTP', { phone });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error.response?.data?.error || 'Error sending OTP' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="car-sport" size={60} color="#e74c3c" />
        <Text style={styles.title}>GoCab Driver</Text>
        <Text style={styles.subtitle}>Earn Money with Your Car</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRequestOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Request OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 60
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  form: {
    marginBottom: 30
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
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
    alignItems: 'center'
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
