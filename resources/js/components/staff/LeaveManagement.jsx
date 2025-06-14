import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const LeaveManagement = () => {
  // Dummy leave data
  const location = useLocation();

useEffect(() => {
  if (location.state?.showModal) {
    setShowLeaveModal(true);
  }
}, [location.state]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      type: "Sick Leave",
      from: "2025-06-01",
      to: "2025-06-03",
      status: "Approved",
      reason: "Fever and cold",
      file: null,
    },
    {
      id: 2,
      type: "Casual Leave",
      from: "2025-06-05",
      to: "2025-06-06",
      status: "Pending",
      reason: "Personal work",
      file: null,
    },
  ]);

  // Modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: "Sick Leave",
    from: "",
    to: "",
    reason: "",
    file: null,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.from || !formData.to || !formData.reason) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create new leave request with Pending status
    const newLeave = {
      id: leaveRequests.length + 1,
      type: formData.type,
      from: formData.from,
      to: formData.to,
      status: "Pending",
      reason: formData.reason,
      file: formData.file,
    };

    setLeaveRequests([...leaveRequests, newLeave]);
    setShowLeaveModal(false);

    // Reset form
    setFormData({
      type: "Sick Leave",
      from: "",
      to: "",
      reason: "",
      file: null,
    });
  };

  // Cancel form
  const handleCancel = () => {
    setShowLeaveModal(false);
    setFormData({
      type: "Sick Leave",
      from: "",
      to: "",
      reason: "",
      file: null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Management</h3>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Apply Leave
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.from}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : leave.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {leave.file ? leave.file.name : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for leave application */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h4 className="text-lg font-semibold mb-4">Apply for Leave</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1" htmlFor="type">
                    Leave Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1" htmlFor="from">
                    From
                  </label>
                  <input
                    type="date"
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1" htmlFor="to">
                    To
                  </label>
                  <input
                    type="date"
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1" htmlFor="reason">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1" htmlFor="file">
                    Supporting File (optional)
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleChange}
                    className="w-full"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
