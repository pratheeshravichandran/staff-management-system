import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, CheckCircle, XCircle, TrendingUp, Users, Award } from 'lucide-react';

const AttendanceModule = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const attendanceHistory = [
    { date: '2025-06-03', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-06-02', checkIn: '09:10 AM', checkOut: '06:25 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-06-01', checkIn: '09:20 AM', checkOut: '06:35 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-05-31', checkIn: '09:05 AM', checkOut: '06:20 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-05-30', checkIn: '--', checkOut: '--', status: 'Absent', hours: '0h 0m' },
    { date: '2025-05-29', checkIn: '09:25 AM', checkOut: '06:40 PM', status: 'Late', hours: '9h 15m' },
    { date: '2025-05-28', checkIn: '09:00 AM', checkOut: '06:15 PM', status: 'Present', hours: '9h 15m' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  const getCurrentWorkingHours = () => {
    if (!isCheckedIn || !checkInTime) return '0h 0m';
    
    const now = new Date();
    const checkIn = new Date();
    const [time, period] = checkInTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    
    checkIn.setHours(
      period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
    
    const diff = now - checkIn;
    const workingHours = Math.floor(diff / (1000 * 60 * 60));
    const workingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${workingHours}h ${workingMinutes}m`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Late':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Attendance Dashboard</h1>
          <p className="text-gray-600">{formatDate(currentTime)}</p>
          <p className="text-2xl font-mono text-blue-600 mt-2">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Today's Attendance Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Today's Attendance
            </h3>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isCheckedIn 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {isCheckedIn ? '🟢 Active' : '⚪ Inactive'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center mb-3">
                <div className={`p-3 rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className={`text-xl font-bold ${isCheckedIn ? 'text-green-600' : 'text-gray-600'}`}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full bg-purple-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Check In Time</p>
              <p className="text-xl font-bold text-purple-600">{checkInTime || '--:--'}</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 rounded-full bg-orange-500">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Working Hours</p>
              <p className="text-xl font-bold text-orange-600">{getCurrentWorkingHours()}</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-8 rounded-xl transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Check In
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-8 rounded-xl transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Check Out
              </button>
            )}
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-8 rounded-xl transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg hover:shadow-xl">
              <MapPin className="w-5 h-5 mr-2" />
              View Location
            </button>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">+2 this week</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">22</p>
            <p className="text-sm text-gray-600">Present Days</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">-1 this week</span>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">2</p>
            <p className="text-sm text-gray-600">Absent Days</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">Same as last week</span>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">1</p>
            <p className="text-sm text-gray-600">Late Arrivals</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Excellent</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">95%</p>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Attendance History
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Working Hours
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {record.hours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(record.status)}
                        <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : record.status === 'Late'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;