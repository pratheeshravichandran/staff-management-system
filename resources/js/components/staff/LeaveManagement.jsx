import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Filter, 
  Search,
  FileText,
  Download,
  Eye,
  Trash2,
  Edit3
} from "lucide-react";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const token = localStorage.getItem("token");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(null);
  const [stats, setStats] = useState({});

  const [formData, setFormData] = useState({
    leave_type: "Sick Leave",
    start_date: "",
    end_date: "",
    description: "",
    supporting_file: null,
  });

  useEffect(() => {
    axios.get('/staff/leaves',
      {
        headers:{
          Authorization:token,
        },
      }
    )
      .then(response => {
        setLeaveRequests(response.data.data); // e.g., "Leave records fetched successfully."
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || 'Something went wrong.';
        setLeaveRequests(errorMessage);
      });
  }, []);
  // Calculate leave statistics
  useEffect(() => {
    const approved = leaveRequests.filter(req => req.hr_status === "approved").length;
    const pending = leaveRequests.filter(req => req.hr_status === "pending").length;
    const rejected = leaveRequests.filter(req => req.hr_status === "rejected").length;
    const totalDays = leaveRequests
      .filter(req => req.status === "approved")
      .reduce((sum, req) => sum + req.days, 0);

    setStats({ approved, pending, rejected, totalDays, total: leaveRequests.length });
  }, [leaveRequests]);

  // Filter and search functionality
  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = filterStatus === "All" || request.hr_status === filterStatus;
    const matchesSearch =
      (request?.leave_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
  
    return matchesStatus && matchesSearch;
  });
  
  

  const calculateDays = (start, end) => {
    const fromDate = new Date(start);
    const toDate = new Date(end);
    const diffTime = Math.abs(toDate - fromDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "supporting_file") {
      setFormData({ ...formData, supporting_file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };  


const handleSubmit = async () => {
  if (!formData.start_date || !formData.end_date || !formData.description || !formData.leave_type) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const data = new FormData();
    data.append("leave_type", formData.leave_type);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("description", formData.description);
    if (formData.supporting_file) {
      data.append("supporting_file", formData.supporting_file);
    }

    const response = await axios.post("/staff/leaves", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });

    const result = response.data;

    alert(result.message || "Leave submitted successfully!");
    setLeaveRequests([...leaveRequests, result.data]); // Optional: update UI
    handleCancel();

  } catch (error) {
    const errorMsg =
      error.response?.data?.error || "Something went wrong!";
    alert(`Error: ${errorMsg}`);
  }
};
  

  const handleCancel = () => {
    setShowLeaveModal(false);
    setEditingLeave(null);
    setFormData({
      type: "Sick Leave",
      from: "",
      to: "",
      reason: "",
      file: null,
    });
  };

  const handleEdit = (leave) => {
    if (leave.status === "Pending") {
      setEditingLeave(leave);
      setFormData({
        type: leave.type,
        from: leave.from,
        to: leave.to,
        reason: leave.reason,
        file: leave.file
      });
      setShowLeaveModal(true);
    }
  };

  const handleDelete = async (id) => {
    const leave = leaveRequests.find(req => req.id === id);
  
    if (!leave) {
      alert("Leave request not found.");
      return;
    }
  
    if (leave.hr_status !== "pending") {
      alert("Only pending leave requests can be deleted.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`/staff/leaves/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      alert(response.data.message || "Leave deleted successfully.");
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete leave request.";
      alert(`Error: ${errorMsg}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircle size={16} className="text-green-600" />;
      case "pending": return <Clock size={16} className="text-yellow-600" />;
      case "rejected": return <XCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Management</h1>
            <p className="text-gray-600">Manage your leave requests and track their status</p>
          </div>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} className="mr-2" />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved || 0}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Days Taken</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalDays || 0}</p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="All">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type & Duration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((leave, index) => (
                <tr key={leave.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{leave.leave_type}</span>
                      <span className="text-xs text-gray-500">
  {calculateDays(leave.start_date, leave.end_date)} day
  {calculateDays(leave.start_date, leave.end_date) > 1 ? 's' : ''}
</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{leave.start_date} to {leave.end_date}</span>
                      <span className="text-xs text-gray-500">Applied: {leave.created_at?.split('T')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getStatusColor(leave.status)}`}>
                      {getStatusIcon(leave.hr_status)}
                      <span className="ml-1">{leave.hr_status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 max-w-xs truncate" title={leave.description}>
                      {leave.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDetails(leave)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {leave.hr_status === "pending" && (
                        <>
                          <button
                            onClick={() => handleDelete(leave.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No leave requests found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
            <h4 className="text-2xl font-bold mb-6 text-gray-900">
              {editingLeave ? "Edit Leave Request" : "Apply for Leave"}
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Permission">Permission</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please provide reason for leave..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supporting Document (Optional)
                </label>
                <input
                  type="file"
                  name="supporting_file"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                >
                  {editingLeave ? "Update Request" : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-2xl font-bold text-gray-900">Leave Request Details</h4>
              <button
                onClick={() => setShowDetails(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Leave Type</p>
                  <p className="text-lg text-gray-900">{showDetails.leave_type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Duration</p>
                  <p className="text-lg text-gray-900">{calculateDays(showDetails.start_date, showDetails.end_date)} day
                  {calculateDays(showDetails.start_date, showDetails.end_date) > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Period</p>
                <p className="text-lg text-gray-900">{showDetails.start_date} to {showDetails.end_date}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <span className={`px-3 py-1 inline-flex items-center text-sm leading-5 font-semibold rounded-full border ${getStatusColor(showDetails.status)}`}>
                  {getStatusIcon(showDetails.hr_status)}
                  <span className="ml-1">{showDetails.hr_status}</span>
                </span>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Reason</p>
                <p className="text-gray-900">{showDetails.description}</p>
              </div>
              
              {showDetails.approvedBy && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    {showDetails.hr_status === "rejected" ? "Rejected By" : "Approved By"}
                  </p>
                  <p className="text-gray-900">{showDetails.approvedBy}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-semibold text-gray-600">Applied Date</p>
                <p className="text-gray-900">{showDetails.created_at?.split('T')[0]}</p>
              </div>
              
              {showDetails.supporting_file && (
  <div>
    <p className="text-sm font-semibold text-gray-600">Supporting Document</p>
    <div className="flex items-center gap-2 mt-1">
      <FileText size={16} className="text-blue-600" />
      <a
        href={showDetails.supporting_file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        View File
      </a>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;