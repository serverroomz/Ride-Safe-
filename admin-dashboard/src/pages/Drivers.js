import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://your-api-url:5000/api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      // In production, fetch from API
      setDrivers([
        { _id: '1', fullName: 'Mike Johnson', phone: '9876543213', vehicleNumber: 'DL01AB1234', rating: 4.8, isVerified: true },
        { _id: '2', fullName: 'Sarah Lee', phone: '9876543214', vehicleNumber: 'DL01AB1235', rating: 4.9, isVerified: true },
        { _id: '3', fullName: 'Tom Brown', phone: '9876543215', vehicleNumber: 'DL01AB1236', rating: 4.5, isVerified: false }
      ]);
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Drivers Management</h1>
        <p>Manage all drivers on the platform</p>
      </div>

      <div className="table-container">
        <h2>All Drivers</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Rating</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.fullName}</td>
                <td>{driver.phone}</td>
                <td>{driver.vehicleNumber}</td>
                <td>{driver.rating} ⭐</td>
                <td>
                  <span className={`status-badge status-${driver.isVerified ? 'active' : 'inactive'}`}>
                    {driver.isVerified ? 'Verified' : 'Pending'}
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
