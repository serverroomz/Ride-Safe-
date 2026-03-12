import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const API_URL = 'http://your-api-url:5000/api';

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const userData = JSON.parse(userStr);
      setUser(userData);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_URL}/wallet/balance/${userData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(response.data.balance);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error loading wallet' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (amount) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_URL}/wallet/add-money`,
        { userId: user._id, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBalance(response.data.newBalance);
      Toast.show({ type: 'success', text1: 'Money added successfully' });
      loadWalletData();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error adding money' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.label}>Wallet Balance</Text>
        <Text style={styles.amount}>₹ {balance.toFixed(2)}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Add Money</Text>
        <View style={styles.amountButtons}>
          {[100, 200, 500, 1000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.amountButton}
              onPress={() => handleAddMoney(amount)}
            >
              <Text style={styles.amountButtonText}>₹ {amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <TouchableOpacity style={styles.paymentMethod}>
          <Icon name="card" size={24} color="#000" />
          <Text style={styles.methodText}>Credit / Debit Card</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethod}>
          <Icon name="phone-portrait" size={24} color="#000" />
          <Text style={styles.methodText}>UPI</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethod}>
          <Icon name="document" size={24} color="#000" />
          <Text style={styles.methodText}>Bank Transfer</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  balanceCard: {
    backgroundColor: '#000',
    margin: 15,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center'
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  actionsContainer: {
    marginTop: 20,
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15
  },
  amountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  amountButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  amountButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  paymentMethod: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  methodText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    fontWeight: '500'
  }
});
