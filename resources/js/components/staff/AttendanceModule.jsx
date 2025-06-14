import React, { useState } from 'react';

const AttendanceModule = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const attendanceHistory = [
    { date: '2025-06-03', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-06-02', checkIn: '09:10 AM', checkOut: '06:25 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-06-01', checkIn: '09:20 AM', checkOut: '06:35 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-05-31', checkIn: '09:05 AM', checkOut: '06:20 PM', status: 'Present', hours: '9h 15m' },
    { date: '2025-05-30', checkIn: '--', checkOut: '--', status: 'Absent', hours: '0h 0m' },
  ];

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

  return (
    <div className="space-y-6">
      {/* Today's Attendance Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-semibold ${isCheckedIn ? 'text-green-600' : 'text-red-600'}`}>
              {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Check In Time</p>
            <p className="text-lg font-semibold">{checkInTime || '--:--'}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Working Hours</p>
            <p className="text-lg font-semibold">{getCurrentWorkingHours()}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors flex items-center"
            >
              <span className="mr-2">📍</span>
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors flex items-center"
            >
              <span className="mr-2">📤</span>
              Check Out
            </button>
          )}
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
            View Location
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">22</p>
            <p className="text-sm text-gray-600">Present Days</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">2</p>
            <p className="text-sm text-gray-600">Absent Days</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">1</p>
            <p className="text-sm text-gray-600">Late Arrivals</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">95%</p>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.hours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;