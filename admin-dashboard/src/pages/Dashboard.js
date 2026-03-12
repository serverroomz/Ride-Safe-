import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://your-api-url:5000/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRiders: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalEarnings: 0
  });
  const [recentRides, setRecentRides] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In production, fetch real data from API
      setStats({
        totalRiders: 245,
        totalDrivers: 89,
        totalRides: 1250,
        totalEarnings: 45230
      });

      setRecentRides([
        { id: 1, rider: 'John Doe', driver: 'Mike Johnson', fare: 250, status: 'completed' },
        { id: 2, rider: 'Jane Smith', driver: 'Sarah Lee', fare: 180, status: 'completed' },
        { id: 3, rider: 'Bob Wilson', driver: 'Tom Brown', fare: 320, status: 'in_progress' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rides',
        data: [150, 200, 180, 220, 250, 280],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings (₹)',
        data: [5000, 7000, 6500, 8000, 9000, 10000],
        backgroundColor: '#27ae60',
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to GoCab Admin Panel</p>
      </div>

      <div className="cards-container">
        <div className="card">
          <h3>👥 Total Riders</h3>
          <div className="value">{stats.totalRiders}</div>
          <div className="change">↑ 12.5% from last month</div>
        </div>

        <div className="card">
          <h3>🚕 Total Drivers</h3>
          <div className="value">{stats.totalDrivers}</div>
          <div className="change">↑ 8.2% from last month</div>
        </div>

        <div className="card">
          <h3>🎫 Total Rides</h3>
          <div className="value">{stats.totalRides}</div>
          <div className="change">↑ 25.3% from last month</div>
        </div>

        <div className="card">
          <h3>💰 Total Earnings</h3>
          <div className="value">₹ {stats.totalEarnings.toLocaleString()}</div>
          <div className="change">↑ 18.9% from last month</div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Rides Overview</h2>
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      <div className="chart-container">
        <h2>Monthly Earnings</h2>
        <Bar data={earningsData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>

      <div className="table-container">
        <h2>Recent Rides</h2>
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
            {recentRides.map((ride) => (
              <tr key={ride.id}>
                <td>#{ride.id.toString().padStart(4, '0')}</td>
                <td>{ride.rider}</td>
                <td>{ride.driver}</td>
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
