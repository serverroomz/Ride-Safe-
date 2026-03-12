import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://your-api-url:5000/api';

export default function Wallet() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      // In production, fetch from API
      setTransactions([
        { _id: '1', userId: 'John Doe', type: 'credit', amount: 500, description: 'Wallet topup', timestamp: '2024-03-11' },
        { _id: '2', userId: 'Jane Smith', type: 'debit', amount: 250, description: 'Ride fare', timestamp: '2024-03-11' },
        { _id: '3', userId: 'Bob Wilson', type: 'credit', amount: 1000, description: 'Promotion credit', timestamp: '2024-03-10' }
      ]);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Wallet Management</h1>
        <p>Monitor wallet transactions</p>
      </div>

      <div className="table-container">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.userId}</td>
                <td>
                  <span style={{ color: tx.type === 'credit' ? '#27ae60' : '#e74c3c' }}>
                    {tx.type === 'credit' ? '↑ Credit' : '↓ Debit'}
                  </span>
                </td>
                <td>₹ {tx.amount}</td>
                <td>{tx.description}</td>
                <td>{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
