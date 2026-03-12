import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://your-api-url:5000/api';

export default function Rides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      // In production, fetch from API
      setRides([
        { _id: '1', rideId: 'RIDE001', riderId: 'John Doe', driverId: 'Mike Johnson', fare: 250, status: 'completed' },
        { _id: '2', rideId: 'RIDE002', riderId: 'Jane Smith', driverId: 'Sarah Lee', fare: 180, status: 'completed' },
        { _id: '3', rideId: 'RIDE003', riderId: 'Bob Wilson', driverId: 'Tom Brown', fare: 320, status: 'in_progress' }
      ]);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Rides Management</h1>
        <p>Manage all rides on the platform</p>
      </div>

      <div className="table-container">
        <h2>All Rides</h2>
        <table>
          <thead>
            <tr>
              <th>Ride ID</th>
              <th>Rider</th>
              <th>Driver</th>
              <th>Fare</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride._id}>
                <td>{ride.rideId}</td>
                <td>{ride.riderId}</td>
                <td>{ride.driverId}</td>
                <td>₹ {ride.fare}</td>
                <td>
                  <span className={`status-badge status-${ride.status}`}>
                    {ride.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
