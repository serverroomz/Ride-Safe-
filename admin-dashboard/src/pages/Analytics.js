import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const ridesTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Rides',
        data: [300, 400, 350, 450],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4
      }
    ]
  };

  const revenueData = {
    labels: ['Rides', 'Promotions', 'Other'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#e74c3c', '#27ae60', '#3498db'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Riders',
        data: [50, 75, 100, 130, 170, 210],
        backgroundColor: '#3498db',
        borderRadius: 4
      },
      {
        label: 'Drivers',
        data: [20, 30, 40, 55, 70, 90],
        backgroundColor: '#27ae60',
        borderRadius: 4
      }
    ]
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Analytics</h1>
        <p>Platform performance metrics</p>
      </div>

      <div className="chart-container">
        <h2>Rides Trend</h2>
        <Line data={ridesTrendData} options={{ responsive: true }} />
      </div>

      <div className="chart-container">
        <h2>User Growth</h2>
        <Bar data={userGrowthData} options={{ responsive: true }} />
      </div>

      <div className="chart-container">
        <h2>Revenue Distribution</h2>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Pie data={revenueData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
