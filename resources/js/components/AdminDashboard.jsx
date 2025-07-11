import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentManagement from "./DepartmentManagement";
import TaskManagement from "./TaskManagement";
import ReportManagement from "./ReportManagement";
import AttendanceManagement from "./AttendanceManagement";
import PayrollManagement from "./PayrollManagement";
import LeaveApproval from "./LeaveApproval";
import Announcements from "./Announcements";
import BankDetails from "./hr/BankDetails";
import useStaffMetadata from "./context/hooks/useStaffMetadata";
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
  GraduationCap,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import StaffManagement from './StaffManagement';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const { departments, roles, genders, staffData, setStaffData } = useStaffMetadata();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", currentView);
  }, [currentView]);

  // Updated stats cards with your requirements
  const statsCards = [
    { 
      title: "Total Staff", 
      value: staffData.length, 
      icon: Users, 
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700"
    },
    { 
      title: "Total Students", 
      value: 1250, // You can replace this with actual student data
      icon: GraduationCap, 
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-green-700"
    },
    { 
      title: "Total Departments", 
      value: departments ? departments.length : new Set(staffData.map(s => s.department)).size, 
      icon: Building, 
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-700"
    },
    { 
      title: "Active Staff", 
      value: staffData.filter(s => s.status === "Active").length, 
      icon: UserCheck, 
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700"
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin dashboard - manage your institution efficiently</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className={`${stat.bgColor} p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className={`text-3xl font-bold ${stat.valueColor} mb-1`}>{stat.value}</p>
                        <p className="text-xs text-gray-500">Total count</p>
                      </div>
                      <div className={`p-4 rounded-full bg-white shadow-sm`}>
                        <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setCurrentView("staff")}
                    className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Add Staff</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView("departments")}
                    className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <Building className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Manage Departments</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView("attendance")}
                    className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Track Attendance</span>
                  </button>
                  <button 
                    onClick={() => setCurrentView("reports")}
                    className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">Generate Reports</span>
                  </button>
                </div>
              </div>

              {/* Department Overview - FIXED */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Staff Distribution</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments && departments.map((dept, index) => {
                    // Support both object and string department types
                    const deptName = typeof dept === 'string' ? dept : dept.name;
                    const deptId = typeof dept === 'object' ? dept.id : dept;
                    const deptStaff = staffData.filter(s => s.department === deptName).length;
                    const colors = [
                      'bg-blue-100 text-blue-700',
                      'bg-green-100 text-green-700',
                      'bg-purple-100 text-purple-700',
                      'bg-orange-100 text-orange-700',
                      'bg-red-100 text-red-700'
                    ];
                    return (
                      <div key={deptId || deptName} className={`p-4 rounded-lg ${colors[index % colors.length]} border`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{deptName}</h4>
                            <p className="text-sm opacity-75">{deptStaff} staff members</p>
                          </div>
                          <div className="text-2xl font-bold">
                            {deptStaff}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Status & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Database Connected</p>
                        <p className="text-xs text-green-600">All systems operational</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Backup Status</p>
                        <p className="text-xs text-green-600">Last backup: 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Maintenance Mode</p>
                        <p className="text-xs text-yellow-600">Scheduled for this weekend</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Pending Tasks</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">3 Leave Requests</p>
                        <p className="text-xs text-red-600">Awaiting approval</p>
                      </div>
                      <button 
                        onClick={() => setCurrentView("leaves")}
                        className="text-xs text-red-700 hover:text-red-800 font-medium"
                      >
                        Review
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-800">Monthly Reports</p>
                        <p className="text-xs text-orange-600">Due in 2 days</p>
                      </div>
                      <button 
                        onClick={() => setCurrentView("reports")}
                        className="text-xs text-orange-700 hover:text-orange-800 font-medium"
                      >
                        Generate
                      </button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">Staff Onboarding</p>
                        <p className="text-xs text-blue-600">2 new hires this week</p>
                      </div>
                      <button 
                        onClick={() => setCurrentView("staff")}
                        className="text-xs text-blue-700 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">New staff member added to IT Department</span>
                    <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Monthly attendance report generated</span>
                    <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">3 leave requests pending approval</span>
                    <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                  </div>
                </div>
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
                <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
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

          {currentView === "bank-details" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bank Details</h1>
              </div>
              <BankDetails />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
