import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DepartmentManagement from "./DepartmentManagement";
import TaskManagement from "./TaskManagement";
import ReportManagement from "./ReportManagement";
import AttendanceManagement from "./AttendanceManagement";
import PayrollManagement from "./PayrollManagement";
import LeaveApproval from "./LeaveApproval";
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
  CalendarDays
} from "lucide-react";
import StaffManagement from './StaffManagement';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  
  const [staffData, setStaffData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem("activeTab");
}); // <-- missing closing parenthesis here

useEffect(() => {
  localStorage.setItem("activeTab", currentView);
}, [currentView]);



  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch metadata
    axios.get('/get/metadata', {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      const { roles, genders } = response.data;
      setRoles(roles);
      setGenders(genders);
    })
    .catch(error => {
      if (error.response) {
        const backendError = error.response.data.error || "Unknown server error";
        console.error("Backend Error:", backendError);
        alert(`Error: ${backendError}`);
      }
    });

    // Fetch departments
    axios.get("/departments", {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      setDepartments(response.data.departments);
    })
    .catch(error => {
      if (error.response) {
        console.error("Departments Error:", error.response.data.error || error.response.data);
        alert(`Departments Error: ${error.response.data.error || "Unknown error"}`);
      }
    });

    // Fetch staff data
    axios.get("/get/allstaffs", { headers: { Authorization: token } })
    .then(response => {
      const formattedStaff = response.data.staff.map(item => ({
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        gender: item.gender,
        email: item.email,
        phone: item.phone_number,
        dob: item.dob?.split("T")[0] || "",
        designation: item.designation,
        role: item.role_name,
        department_id: item.department_id || "Unassigned",
        department: item.department || "Unassigned",
        status: item.status,
        joiningDate: item.joining_date?.split("T")[0] || "",
        address: item.address || "",
        staffID: item.staff_id,
        salary: parseFloat(item.salary) || 0,
        photo: item.profile_pic || null,
      }));
      setStaffData(formattedStaff);
    })
    .catch(error => {
      console.error("Staff Fetch Error:", error.response?.data || error);
    });
  }, []);

  // Sample dashboard data
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
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
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
            <StaffManagement 
              staffData={staffData} 
              setStaffData={setStaffData}
              departments={departments}
              roles={roles}
              genders={genders}
            />
          )}

          {currentView === "departments" && <DepartmentManagement />}


          {currentView === "reports" && <ReportManagement />}

          {currentView === "attendance" && <AttendanceManagement/>}
          
          {currentView === "payroll" && <PayrollManagement/>}

          {currentView === "tasks" && <TaskManagement/>}

          {currentView === "leaves" && <LeaveApproval />}
        </main>
      </div>
    </div>
  );
}