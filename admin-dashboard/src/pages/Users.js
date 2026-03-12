import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://your-api-url:5000/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // In production, fetch from API
      setUsers([
        { _id: '1', fullName: 'John Doe', phone: '9876543210', role: 'rider', isActive: true },
        { _id: '2', fullName: 'Jane Smith', phone: '9876543211', role: 'rider', isActive: true },
        { _id: '3', fullName: 'Bob Wilson', phone: '9876543212', role: 'rider', isActive: false }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Users Management</h1>
        <p>Manage all riders and drivers</p>
      </div>

      <div className="table-container">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.phone}</td>
                <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>
                  <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button style={{ padding: '5px 10px', cursor: 'pointer' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
