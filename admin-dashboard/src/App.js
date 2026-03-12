import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import RidesPage from './pages/Rides';
import DriversPage from './pages/Drivers';
import WalletPage from './pages/Wallet';
import AnalyticsPage from './pages/Analytics';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <>
            <nav className="sidebar">
              <div className="logo">
                <h2>🚕 GoCab Admin</h2>
              </div>
              <ul className="nav-links">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/drivers">Drivers</Link></li>
                <li><Link to="/rides">Rides</Link></li>
                <li><Link to="/wallet">Wallet</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
              </ul>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/drivers" element={<DriversPage />} />
                <Route path="/rides" element={<RidesPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Routes>
            </main>
          </>
        ) : (
          <div className="login-container">
            <div className="login-box">
              <h2>Admin Login</h2>
              <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;