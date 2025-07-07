
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Search,
  User,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Eye,
  Menu,
  X
} from 'lucide-react';
import DashboardOverview from '../staff/DashboardOverview';
import AttendanceModule from '../staff/AttendanceModule';
import LeaveManagement from '../staff/LeaveManagement';
import ProfileManagement from '../staff/ProfileManagement';
import PayslipModule from '../staff/PayslipModule';
import BankDetails from './BankDetails';
import TasksModule from '../staff/TasksModule';
import AnnouncementsModule from '../Announcements';
import ManageStaff from '../StaffManagement';
import useStaffMetadata from "../context/hooks/useStaffMetadata";
import Sidebar from './Sidebar';


const HRDashboard = () => {
  const token = localStorage.getItem("token");
  const { departments, roles, genders,staffData ,setStaffData} = useStaffMetadata();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });

  useEffect(() => {
      localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
   const [staff, setStaff] = useState(null);
   useEffect(() => {
    axios
      .get("/auth-user", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((response) => {
        const user = response.data.user;
        setStaff({
          name: `${user.first_name} ${user.last_name}`,
          role: user.role_name,
          department: user.department_name,
          staffId: user.staff_id,
          email: user.email,
          phone: user.phone_number,
          gender: user.gender,
          dob: user.dob?.split("T")[0],
          designation: user.designation,
          joiningDate: user.joining_date?.split("T")[0],
          salary: user.salary,
          status: user.status,
          address: user.address,
          photo: user.profile_pic,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch staff data:", error);
      });
  }, []);

    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard': return <DashboardOverview />;
        case 'attendance': return <AttendanceModule />;
        case 'leave': return <LeaveManagement />;
        case 'profile': return <ProfileManagement staff={staff} />;
        case 'payslip': return <PayslipModule />;
        case 'tasks': return <TasksModule />;
        case 'announcements': return <AnnouncementsModule />;
        case 'bank_details': return <BankDetails />;
        case 'manage_staffs': return <ManageStaff  staffData={staffData} 
        setStaffData={setStaffData}
        departments={departments}
        roles={roles}
        genders={genders}/>;
        default: return <DashboardOverview />;
      }
    };
  
  return (
    <div className="flex h-screen bg-gray-100">
    <Sidebar 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
 <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {staff?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{staff?.name}</p>
                <p className="text-xs text-gray-600">{staff?.role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {staff?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    );
}
export default HRDashboard;
