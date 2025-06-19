import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, FileText, Filter, Search, Bell, MoreVertical, Eye, Download, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { Token } from '@mui/icons-material';
const token = localStorage.getItem("token");
const LeaveApprovalSystem = () => {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [leaveRequests, setLeaveRequests] = useState([]);


  useEffect(()=>{
    axios.get('/college/staff/leaves',{
      headers:{
        Authorization: token,
      },
    })
    .then(response=>{
      setLeaveRequests(response.data.data);
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Something went wrong.';
      setLeaveRequests(errorMessage);
    });

  },[]);

  const closeModal = () => {
    setSelectedRequest(false);
  };
  const handleApproval = (requestId, action, reason = '') => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: action,
              processedDate: new Date().toISOString().split('T')[0],
              ...(action === 'denied' && reason && { denyReason: reason })
            }
          : request
      )
    );
    closeModal();
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
  
    const name = request.employeeName?.toLowerCase() || '';
    const id = request.employeeId?.toLowerCase() || '';
    const department = request.department?.toLowerCase() || '';
  
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase());
  
    return matchesFilter && matchesSearch;
  });
  

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'denied': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch(type) {
      case 'Casual Leave': return 'bg-blue-100 text-blue-800';
      case 'Sick Leave': return 'bg-red-100 text-red-800';
      case 'Personal Leave': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = leaveRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content - Adjusted for sidebar */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Staff Leave Approvals
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <Bell className="w-5 h-5 text-gray-600" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                    {pendingCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-xs text-amber-600 font-medium">Needs Review</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{leaveRequests.filter(req => req.hr_status === 'approved').length}</p>
                <p className="text-xs text-emerald-600 font-medium">This Month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{leaveRequests.filter(req => req.status === 'denied').length}</p>
                <p className="text-xs text-red-600 font-medium">This Month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{leaveRequests.length}</p>
                <p className="text-xs text-blue-600 font-medium">All Requests</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <select 
                  value={selectedFilter} 
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value="pending">Pending Requests</option>
                  <option value="all">All Requests</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Rejected</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by employee name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-100">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">{request.avatar}</span>
                    </div>
                    
                    {/* Employee Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.urgency === 'high' && (
                          <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {request.employeeId}
                        </span>
                        <span>•</span>
                        <span>{request.department}</span>
                        <span>•</span>
                        <span>{request.position}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Leave Type</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                            {request.leave_type}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
                          <p className="text-sm font-medium text-gray-900">{request.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Leave Period</p>
                          <p className="text-sm text-gray-700">{request.startDate} to {request.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Remaining Leave</p>
                          <p className="text-sm font-medium text-gray-900">{request.remainingLeave} days</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{request.reason}</p>
                      </div>

                      {request.status === 'denied' && request.denyReason && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-700">{request.denyReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproval(request.id, 'approved')}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {handleApproval(request.id, 'denied');}}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Leave Request Details</h2>
                  <p className="text-gray-600 mt-1">Complete information and approval actions</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Employee Information
                    </h3>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-medium">{selectedRequest.avatar}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-gray-900">{selectedRequest.employeeName}</p>
                          <p className="text-gray-600">{selectedRequest.position}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Employee ID</p>
                          <p className="text-sm text-gray-600">{selectedRequest.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Department</p>
                          <p className="text-sm text-gray-600">{selectedRequest.department}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Leave Balance</p>
                          <p className="text-sm font-semibold text-blue-600">{selectedRequest.remainingLeave} days</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact</p>
                          <p className="text-sm text-gray-600">{selectedRequest.contactDuringLeave}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Leave Details
                    </h3>
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLeaveTypeColor(selectedRequest.leaveType)}`}>
                          {selectedRequest.leaveType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedRequest.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Applied Date</p>
                          <p className="text-sm text-gray-600">{selectedRequest.appliedDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Start Date</p>
                          <p className="text-sm text-gray-600">{selectedRequest.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">End Date</p>
                          <p className="text-sm text-gray-600">{selectedRequest.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Reason for Leave
                  </h3>
                  <p className="text-gray-700 bg-purple-50 p-4 rounded-xl border border-purple-100">{selectedRequest.reason}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Work Handover Details
                  </h3>
                  <p className="text-gray-700 bg-orange-50 p-4 rounded-xl border border-orange-100">{selectedRequest.workHandover}</p>
                </div>
              </div>

              {/* Approval Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => handleApproval(selectedRequest.id, 'approved')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Leave Request
                  </button>
                  <button
                    onClick={() => {
                        handleApproval(selectedRequest.id, 'denied');
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Leave Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalSystem;