import React from 'react';
import '../css/app.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './components/context/AuthContext';

axios.defaults.baseURL = 'http://localhost:8000/api'; // Laravel backend
axios.defaults.withCredentials = true; // Enable cookie support


import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import HRDashboard from './components/hr/HRDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import DashboardOverview from "./components/staff/DashboardOverview";
import LeaveRequestPage from "./components/staff/LeaveManagement";

ReactDOM.createRoot(document.getElementById('app')).render(
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="dashboard" element={<DashboardOverview />} />
      <Route path="/leave-request" element={<LeaveRequestPage />} />
    </Routes>
  </BrowserRouter>
  </AuthProvider>
);
