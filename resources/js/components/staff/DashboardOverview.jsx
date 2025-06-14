import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckSquare, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";



const DashboardOverview = () => {
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showLeaveSection, setShowLeaveSection] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const announcements = [
    { id: 1, title: 'Team Meeting', content: 'Monthly team meeting scheduled for June 15th', date: '2025-06-04' },
    { id: 2, title: 'Holiday Notice', content: 'Office will be closed on June 20th for public holiday', date: '2025-06-03' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Status</p>
              <p className={`text-lg font-semibold ${isCheckedIn ? 'text-green-600' : 'text-red-600'}`}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </p>
            </div>
            <Clock className={`h-8 w-8 ${isCheckedIn ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Leaves</p>
              <p className="text-lg font-semibold text-orange-600">1</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-lg font-semibold text-blue-600">3</p>
            </div>
            <CheckSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Check In
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Check Out
              </button>
            )}
            <button
      onClick={() => navigate("/leave-request", { state: { showModal: true } })}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
    >
      <Plus size={16} className="mr-2" />
      Apply for Leave
    </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {announcements.slice(0, 2).map(announcement => (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-800">{announcement.title}</p>
                <p className="text-sm text-gray-600">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <LeaveModal 
          showModal={showLeaveModal} 
          setShowModal={setShowLeaveModal} 
        />
      )}
    </div>
  );
};

export default DashboardOverview;