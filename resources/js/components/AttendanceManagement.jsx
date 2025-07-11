import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  Users,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Eye,
} from 'lucide-react';

const StaffAttendanceSystem = () => {
  const detailRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Sample staff data
  const [staffData, setStaffData] = useState([
    { id: 1, name: 'John Doe', department: 'Engineering', status: 'present', shift: 'Day' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', status: 'absent', shift: 'Day' },
    { id: 3, name: 'Mike Johnson', department: 'Sales', status: 'present', shift: 'Day' },
    { id: 4, name: 'Sarah Wilson', department: 'HR', status: 'late', shift: 'Day' },
    { id: 5, name: 'David Brown', department: 'Finance', status: 'present', shift: 'Day' },
    { id: 6, name: 'Lisa Garcia', department: 'IT', status: 'present', shift: 'Night' },
    { id: 7, name: 'Alex Rodriguez', department: 'Design', status: 'present', shift: 'Day' },
    { id: 8, name: 'Emily Chen', department: 'Operations', status: 'absent', shift: 'Day' },
  ]);

  // Sample attendance records
  const [attendanceRecords] = useState([
    { id: 1, staffId: 1, date: '2025-01-06', checkIn: '09:15', checkOut: '18:30', status: 'present', workingHours: 8.25 },
    { id: 2, staffId: 1, date: '2025-01-05', checkIn: '09:00', checkOut: '18:00', status: 'present', workingHours: 8.0 },
    { id: 3, staffId: 2, date: '2025-01-06', checkIn: null, checkOut: null, status: 'absent', workingHours: 0 },
    { id: 4, staffId: 3, date: '2025-01-06', checkIn: '08:00', checkOut: '17:15', status: 'present', workingHours: 8.25 },
    { id: 5, staffId: 4, date: '2025-01-06', checkIn: '09:30', checkOut: '18:00', status: 'late', workingHours: 7.5 },
    { id: 6, staffId: 5, date: '2025-01-06', checkIn: '09:00', checkOut: '18:00', status: 'present', workingHours: 8.0 },
    { id: 7, staffId: 6, date: '2025-01-06', checkIn: '22:00', checkOut: '06:00', status: 'present', workingHours: 8.0 },
    { id: 8, staffId: 7, date: '2025-01-06', checkIn: '08:30', checkOut: '17:30', status: 'present', workingHours: 8.0 },
    { id: 9, staffId: 8, date: '2025-01-06', checkIn: null, checkOut: null, status: 'absent', workingHours: 0 },
  ]);


  useEffect(() => {
    if (selectedStaff && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedStaff]);
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'absent':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'late':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      case 'late':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || staff.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const markAttendance = (staffId, status) => {
    setStaffData((prev) =>
      prev.map((staff) => (staff.id === staffId ? { ...staff, status } : staff))
    );
  };

  const generateReport = (staffId, month = null) => {
    const staff = staffData.find((s) => s.id === staffId);
    let records = attendanceRecords.filter((r) => r.staffId === staffId);

    if (month) {
      records = records.filter((r) => r.date.startsWith(month));
    }

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === 'present').length;
    const absentDays = records.filter((r) => r.status === 'absent').length;
    const lateDays = records.filter((r) => r.status === 'late').length;
    const totalHours = records.reduce((sum, r) => sum + r.workingHours, 0);
    const attendancePercentage =
      totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : 0;

    return {
      staff,
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      totalHours,
      attendancePercentage,
      records,
    };
  };

  const exportReport = () => {
    const csvContent = [
      ['Staff Name', 'Department', 'Date', 'Check In', 'Check Out', 'Working Hours', 'Status'],
      ...attendanceRecords.map((record) => {
        const staff = staffData.find((s) => s.id === record.staffId);
        return [
          staff?.name || 'Unknown',
          staff?.department || 'Unknown',
          record.date,
          record.checkIn || '-',
          record.checkOut || '-',
          record.workingHours.toFixed(1),
          record.status,
        ];
      }),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const DashboardTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Staff</p>
              <p className="text-3xl font-bold text-blue-900">{staffData.length}</p>
              <p className="text-xs text-blue-600 mt-1">Active employees</p>
            </div>
            <div className="p-3 bg-blue-200/50 rounded-xl group-hover:bg-blue-200/70 transition-colors">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">Present Today</p>
              <p className="text-3xl font-bold text-emerald-900">
                {staffData.filter((s) => s.status === 'present').length}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                {((staffData.filter((s) => s.status === 'present').length / staffData.length) * 100).toFixed(1)}% attendance
              </p>
            </div>
            <div className="p-3 bg-emerald-200/50 rounded-xl group-hover:bg-emerald-200/70 transition-colors">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Absent Today</p>
              <p className="text-3xl font-bold text-red-900">
                {staffData.filter((s) => s.status === 'absent').length}
              </p>
              <p className="text-xs text-red-600 mt-1">Need attention</p>
            </div>
            <div className="p-3 bg-red-200/50 rounded-xl group-hover:bg-red-200/70 transition-colors">
              <XCircle className="w-8 h-8 text-red-700" />
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 mb-1">Late Today</p>
              <p className="text-3xl font-bold text-amber-900">
                {staffData.filter((s) => s.status === 'late').length}
              </p>
              <p className="text-xs text-amber-600 mt-1">Punctuality tracking</p>
            </div>
            <div className="p-3 bg-amber-200/50 rounded-xl group-hover:bg-amber-200/70 transition-colors">
              <AlertCircle className="w-8 h-8 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Attendance</h2>
              <p className="text-gray-600">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[200px]"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Staff Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {staff.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.shift} Shift</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border">
                        {staff.department}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(staff.status)}`}>
                        {getStatusIcon(staff.status)}
                        <span className="ml-2 capitalize">{staff.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markAttendance(staff.id, 'present')}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(staff.id, 'absent')}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => markAttendance(staff.id, 'late')}
                          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          Late
                        </button>
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

  const ReportsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Staff Reports</h2>
              <p className="text-gray-600">Comprehensive attendance analytics and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Select Month:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none"
                />
              </div>
              <button
                onClick={exportReport}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {staffData.map((staff) => {
              const report = generateReport(staff.id, selectedMonth);
              return (
                <div
                  key={staff.id}
                  className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {staff.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                        <p className="text-sm text-gray-500">{staff.department}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStaff(staff)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors group-hover:bg-blue-100"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Attendance Rate</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${report.attendancePercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {report.attendancePercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Hours</p>
                        <p className="text-lg font-bold text-gray-900">{report.totalHours.toFixed(1)}h</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Working Days</p>
                        <p className="text-lg font-bold text-gray-900">
                          {report.presentDays + report.lateDays}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Present: {report.presentDays}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Absent: {report.absentDays}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Late: {report.lateDays}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedStaff && (
        <div ref={detailRef}>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedStaff.name} - Monthly Report
                </h2>
                <p className="text-gray-600">
                  {new Date(selectedMonth).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {(() => {
            const report = generateReport(selectedStaff.id, selectedMonth);
            return (
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-2">Total Days</p>
                    <p className="text-3xl font-bold text-blue-900">{report.totalDays}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-700 mb-2">Present Days</p>
                    <p className="text-3xl font-bold text-emerald-900">{report.presentDays}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                    <p className="text-sm font-medium text-red-700 mb-2">Absent Days</p>
                    <p className="text-3xl font-bold text-red-900">{report.absentDays}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-2">Late Days</p>
                    <p className="text-3xl font-bold text-amber-900">{report.lateDays}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                    <p className="text-sm font-medium text-purple-700 mb-2">Total Hours</p>
                    <p className="text-3xl font-bold text-purple-900">{report.totalHours.toFixed(1)}h</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Attendance Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{report.attendancePercentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Avg Hours/Day</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {report.totalDays > 0
                          ? (report.totalHours / report.totalDays).toFixed(1)
                          : 0}
                        h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Working Days</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {report.presentDays + report.lateDays}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Attendance Records</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Check In
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Check Out
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Working Hours
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.records.map((record) => (
                          <tr
                            key={record.id}
                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {record.checkIn || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {record.checkOut || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {record.workingHours.toFixed(1)}h
                            </td>
                            <td
                              className={`px-4 py-3 text-sm font-semibold ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {getStatusIcon(record.status)}
                              <span className="ml-2 capitalize">{record.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
          }`}
        >
          Reports
        </button>
      </div>
      {activeTab === 'dashboard' ? <DashboardTab /> : <ReportsTab />}
    </div>
  );
};

export default StaffAttendanceSystem;
