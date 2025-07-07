import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

const AttendanceDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [workingHours, setWorkingHours] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Calculate working hours if punched in
      if (isPunchedIn && punchInTime) {
        const diffInMs = new Date() - punchInTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        setWorkingHours(diffInHours);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPunchedIn, punchInTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatWorkingHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePunchIn = () => {
    setIsPunchedIn(true);
    setPunchInTime(new Date());
    setWorkingHours(0);
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setPunchInTime(null);
    setWorkingHours(0);
  };

  // Sample data
  const attendanceData = [
    { id: 1, date: '18 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '8 hrs', overtime: '2 hrs' },
    { id: 2, date: '20 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '9 hrs', overtime: '0 hrs' },
    { id: 3, date: '21 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '9 hrs', overtime: '0 hrs' },
    { id: 4, date: '22 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '8 hrs', overtime: '1 hrs' },
    { id: 5, date: '23 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '6 hrs', overtime: '3 hrs' },
    { id: 6, date: '24 Feb 2019', punchIn: '10 AM', punchOut: '7 PM', production: '9 hrs', workingHours: '9 hrs', overtime: '0 hrs' }
  ];

  const todayActivity = [
    { time: '9:00 AM', action: 'Punch In at', status: 'in' },
    { time: '11:00 AM', action: 'Punch Out at', status: 'out' },
    { time: '11:30 AM', action: 'Punch In at', status: 'in' },
    { time: '01:30 PM', action: 'Punch Out at', status: 'out' },
    { time: '02:30 AM', action: 'Punch In at', status: 'in' },
    { time: '04:30 AM', action: 'Punch In at', status: 'in' },
    { time: '07:00 AM', action: 'Punch Out at', status: 'out' }
  ];

  const CircularProgress = ({ percentage, hours }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{hours} hrs</div>
          </div>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ label, current, total, color }) => {
    const percentage = (current / total) * 100;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{current} / {total} hrs</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const BarChart = () => {
    const data = [40, 60, 35, 80, 25, 90, 45, 70, 30, 85, 55, 75];
    const maxValue = Math.max(...data);

    return (
      <div className="flex items-end justify-between h-32 mt-4">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="bg-blue-500 rounded-t-sm w-4 transition-all duration-300"
              style={{ height: `${(value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="text-sm text-gray-500">Dashboard / Attendance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Timesheet Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Timesheet</h3>
              <span className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</span>
            </div>
            <div className="text-center">
              {/* Current Time Display */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Time</p>
                <p className="text-2xl font-bold text-blue-600">{formatTime(currentTime)}</p>
              </div>
              
              {/* Working Hours Display */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Working Hours</p>
                <p className="text-xl font-semibold text-green-600">
                  {isPunchedIn ? formatWorkingHours(workingHours) : '00:00:00'}
                </p>
              </div>

              {isPunchedIn && (
                <p className="text-sm text-gray-600 mb-4">
                  Punched In at: {punchInTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              
              <CircularProgress 
                percentage={isPunchedIn ? Math.min((workingHours / 8) * 100, 100) : 0} 
                hours={isPunchedIn ? workingHours.toFixed(2) : '0.00'} 
              />
              
              {/* Punch In/Out Buttons */}
              <div className="space-y-2 mb-4">
                {!isPunchedIn ? (
                  <button 
                    onClick={handlePunchIn}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                  >
                    PUNCH IN
                  </button>
                ) : (
                  <button 
                    onClick={handlePunchOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                  >
                    PUNCH OUT
                  </button>
                )}
              </div>
              
              <div className="flex justify-center text-sm text-gray-600">
                <div>
                  <p className="font-medium">Status</p>
                  <p className={isPunchedIn ? 'text-green-600' : 'text-red-600'}>
                    {isPunchedIn ? 'Punched In' : 'Punched Out'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistics</h3>
            <div className="space-y-4">
              <ProgressBar label="Today" current={3.45} total={8} color="bg-green-500" />
              <ProgressBar label="This Week" current={28} total={40} color="bg-blue-500" />
              <ProgressBar label="This Month" current={90} total={160} color="bg-yellow-500" />
              <ProgressBar label="Remaining" current={90} total={160} color="bg-blue-600" />
              <ProgressBar label="Overtime" current={5} total={5} color="bg-orange-500" />
            </div>
          </div>

          {/* Today Activity Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Today Activity</h3>
            <div className="space-y-3">
              {todayActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${activity.status === 'in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Attendance List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.punchIn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.punchOut}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.production}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.workingHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.overtime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Records Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Records</h3>
            <div className="text-center mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">12 min</span>
            </div>
            <BarChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceDashboard;