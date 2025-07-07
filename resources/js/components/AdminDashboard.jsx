import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentManagement from "./DepartmentManagement";
import TaskManagement from "./TaskManagement";
import ReportManagement from "./ReportManagement";
import AttendanceManagement from "./AttendanceManagement";
import PayrollManagement from "./PayrollManagement";
import LeaveApproval from "./LeaveApproval";
import Announcements from "./Announcements";
import useStaffMetadata from "./context/hooks/useStaffMetadata";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import {
  Bell,
  Users,
  CalendarCheck,
  DollarSign,
  Menu,
  User,
  Building,
  ClipboardList,
  LogOut,
  Home,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import StaffManagement from './StaffManagement';


export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const { departments, roles, genders,staffData ,setStaffData} = useStaffMetadata();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", currentView);
  }, [currentView]);

  const dashboardData = [
    { name: "Jan", value: 12 },
    { name: "Feb", value: 19 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 25 },
    { name: "May", value: 22 },
    { name: "Jun", value: 30 }
  ];

  const statsCards = [
    { title: "Total Staff", value: staffData.length, icon: Users, color: "blue" },
    { title: "Active", value: staffData.filter(s => s.status === "Active").length, icon: CalendarCheck, color: "green" },
    { title: "On Leave", value: staffData.filter(s => s.status === "On Leave").length, icon: Bell, color: "yellow" },
    { title: "Departments", value: new Set(staffData.map(s => s.department)).size, icon: Building, color: "purple" }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "staff", label: "Staff Management", icon: Users },
    { id: "departments", label: "Departments", icon: Building },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leaves", label: "Leaves", icon: CalendarDays },
    { id: "payroll", label: "Payroll", icon: ClipboardList },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "bank-details", label: "Bank Details", icon: Bell }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg h-screen fixed top-0 left-0 z-50 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === item.id
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-3 w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Main Content */}
        <main className="min-h-screen p-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'yellow' ? 'bg-yellow-100' :
                        'bg-purple-100'
                      }`}>
                        <stat.icon className={`h-6 w-6 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'yellow' ? 'text-yellow-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Staff Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {currentView === "staff" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-600">Manage your staff members</p>
              </div>
              <StaffManagement 
                staffData={staffData} 
                setStaffData={setStaffData}
                departments={departments}
                roles={roles}
                genders={genders}
              />
            </div>
          )}

          {currentView === "departments" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
                <p className="text-gray-600">Manage company departments</p>
              </div>
              <DepartmentManagement />
            </div>
          )}

          {currentView === "reports" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600">View and generate reports</p>
              </div>
              <ReportManagement />
            </div>
          )}

          {currentView === "attendance" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-gray-600">Track employee attendance</p>
              </div>
              <AttendanceManagement />
            </div>
          )}
          
          {currentView === "payroll" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                <p className="text-gray-600">Manage employee payroll</p>
              </div>
              <PayrollManagement />
            </div>
          )}

          {currentView === "tasks" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                <p className="text-gray-600">Assign and track tasks</p>
              </div>
              <TaskManagement />
            </div>
          )}

          {currentView === "leaves" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <p className="text-gray-600">Approve and manage leave requests</p>
              </div>
              <LeaveApproval />
            </div>
          )}

          {currentView === "announcements" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                <p className="text-gray-600">Create and manage announcements</p>
              </div>
              <Announcements />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}