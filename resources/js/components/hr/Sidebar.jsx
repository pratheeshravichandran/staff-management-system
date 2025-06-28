import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  User,
  FileText,
  CheckSquare,
  Bell,
  LogOut,
  Landmark,
  Home,
  X,
  Menu,
  Settings,
  Search,
  Moon,
  Sun,
  Bookmark,
  Activity,
  Award,
  BarChart3,
  MessageSquare,
  Shield,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: Clock, 
    },
    { 
      id: 'leave', 
      label: 'Leave Management', 
      icon: Calendar, 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
    },
    { 
      id: 'payslip', 
      label: 'Payroll', 
      icon: FileText, 
    },
    { 
      id: 'tasks', 
      label: 'Tasks & Projects', 
      icon: CheckSquare, 
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: CheckSquare, 
    },
    { 
        id: 'bank_details', 
        label: 'Bank Details', 
        icon: Landmark, 
      },
  ];

  const quickActions = [
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const userInfo = {
    name: 'Sarah Johnson',
    role: 'Senior Developer',
    avatar: 'SJ',
    status: 'online'
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    console.log('Logging out...');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-80'} bg-gradient-to-b ${
        darkMode 
          ? 'from-gray-900 via-gray-800 to-gray-900' 
          : 'from-white via-gray-50 to-white'
        } transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-2xl`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b backdrop-blur-sm`}>
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <h1 className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              } bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                HR Portal
              </h1>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:block p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Menu size={18} />
            </button>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* User Profile */}
        {!collapsed && (
          <div className={`p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{userInfo.avatar}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {userInfo.name}
                </p>
                <p className={`text-sm truncate ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {userInfo.role}
                </p>
              </div>
            </div>
          </div>
        )}

        

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredMenuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                  activeTab === id 
                    ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} shadow-lg transform scale-105` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
              >
                <div className="flex items-center">
                  <Icon size={20} className={`${collapsed ? 'mx-auto' : 'mr-3'} transition-colors`} />
                  {!collapsed && (
                    <span className="font-medium">{label}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>    
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-all duration-200 ${
              darkMode 
                ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300' 
                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
            } group`}
          >
            <LogOut size={18} className={`${collapsed ? '' : 'mr-3'} group-hover:animate-pulse`} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`fixed top-4 left-4 z-30 p-3 rounded-lg lg:hidden ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } shadow-lg`}
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

export default Sidebar;