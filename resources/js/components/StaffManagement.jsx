import React, { useState } from 'react';
import axios from 'axios';
import roleMap from "./RoleMap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Building,
  X,
  Save,
  Camera,
  Filter
} from "lucide-react";
export default function StaffManagement({ staffData, setStaffData, departments, roles, genders }) {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit", "view"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone_number: "",
    password: "",
    staff_id: "",
    role: "",
    department_id: "",
    dob: "",
    designation: "",
    profile_pic: null,
    status: "",
    joining_date: "",
    address: "",
    salary: "",
    password: "password123"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'department_id' ? Number(value) : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profile_pic: file }));
  };

  const openModal = (type, staff = null) => {
    setModalType(type);
    if (staff) {
      const roleObj = roles.find(r => r.role_name === staff.role) || { id: "" };
      setSelectedStaff(staff);
      setFormData({
        first_name: staff.firstName || "",
        last_name: staff.lastName || "",
        gender: staff.gender || "",
        email: staff.email || "",
        phone_number: staff.phone || "",
        staff_id: staff.staffID || "",
        role: roleObj.id,
        department_id: staff.department_id || "",
        dob: staff.dob || "",
        designation: staff.designation || "",
        profile_pic: staff.photo || null,
        status: staff.status || "Active",
        joining_date: staff.joiningDate || "",
        address: staff.address || "",
        salary: staff.salary || "",
        password: "password123",
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      phone_number: "",
      password: "",
      staff_id: "",
      role: "",
      department_id: "",
      dob: "",
      designation: "",
      profile_pic: null,
      status: "Active",
      joining_date: "",
      address: "",
      salary: "",
      password: "password123"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        form.append(key, value);
      }
    });

    try {
      const res = await axios.post("/register", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      const data = res.data;

      if (data.message) {
        alert(`Success: ${data.message}`);
        closeModal();
        // Refresh staff data
        window.location.reload();
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Unexpected response format.");
      }

    } catch (error) {
      if (error.response) {
        const backendError =
          error.response.data.error ||
          (error.response.data.errors
            ? Object.values(error.response.data.errors).flat().join(", ")
            : "Unknown server error");

        alert(`Error: ${backendError}`);
      } else {
        alert("Network or client error");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photo" || key === "profile_pic") {
        if (value instanceof File) {
          form.append("profile_pic", value);
        }
      } else if (value !== null && value !== "") {
        form.append(key, value);
      }
    });

    try {
      const res = await axios.post(`/update/user/${selectedStaff.id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      const data = res.data;

      if (data.message) {
        alert(`Success: ${data.message}`);
        closeModal();

        // Update staff data locally
        setStaffData((prevStaffData) =>
          prevStaffData.map((staff) =>
            staff.id === selectedStaff.id
              ? {
                  ...staff,
                  firstName: formData.first_name || staff.firstName,
                  lastName: formData.last_name || staff.lastName,
                  gender: formData.gender || staff.gender,
                  email: formData.email || staff.email,
                  phone: formData.phone_number || staff.phone,
                  dob: formData.dob || staff.dob,
                  designation: formData.designation || staff.designation,
                  role: roleMap[formData.role] || staff.role,
                  department_id: formData.department_id || staff.department_id,
                  department: formData.department || staff.department,
                  status: formData.status || staff.status,
                  joiningDate: formData.joining_date || staff.joiningDate,
                  address: formData.address || staff.address,
                  staffID: formData.staff_id || staff.staffID,
                  salary: parseFloat(formData.salary) || staff.salary,
                  photo: formData.profile_pic || staff.photo,
                }
              : staff
          )
        );
      } else {
        alert("Unexpected response format.");
      }
    } catch (error) {
      if (error.response) {
        const backendError =
          error.response.data.error ||
          (error.response.data.errors
            ? Object.values(error.response.data.errors).flat().join(", ")
            : "Unknown server error");
        alert(`Error: ${backendError}`);
      } else {
        alert("Network or client error");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.delete(`/delete/user/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        alert(response.data.message);
        setStaffData(prev => prev.filter(staff => staff.id !== id));
      } catch (error) {
        const errMsg = error.response?.data?.error || "Failed to delete staff member.";
        alert(errMsg);
        console.error("Delete Error:", error);
      }
    }
  };

  const filteredStaff = (staffData ?? []).filter(staff => {
    const matchesSearch = `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || staff.status === filterStatus;
    const matchesDepartment = filterDepartment === "All" || staff.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Resigned": return "bg-red-100 text-red-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => openModal("add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Departments</option>
            {(departments ?? []).map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {staff.photo ? (
                          <img
                            src={staff.photo}
                            alt={`${staff.firstName} ${staff.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {staff.staffID}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.role}</div>
                    <div className="text-sm text-gray-500">{staff.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.joiningDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal("view", staff)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal("edit", staff)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {modalType === "add" && "Add New Staff"}
                {modalType === "edit" && "Edit Staff"}
                {modalType === "view" && "Staff Details"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {modalType === "view" ? (
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                      {selectedStaff?.photo ? (
                        <img 
                          src={selectedStaff.photo} 
                          alt={selectedStaff.name} 
                          className="h-24 w-24 rounded-full object-cover" 
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">
                        {selectedStaff?.firstName} {selectedStaff?.lastName}
                      </h4>
                      <p className="text-lg text-gray-600">{selectedStaff?.role}</p>
                      <p className="text-md text-gray-500">{selectedStaff?.department}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedStaff?.status)}`}>
                        {selectedStaff?.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h5>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedStaff?.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedStaff?.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{selectedStaff?.address}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900 border-b pb-2">Employment Details</h5>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Joined: {selectedStaff?.joiningDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>Department: {selectedStaff?.department}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span>Role: {selectedStaff?.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Staff ID: {selectedStaff?.staffID}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Salary: {selectedStaff?.salary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={modalType === "edit" ? handleUpdate : handleSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center relative">
                      {formData.profile_pic ? (
                        <img
                          src={
                            typeof formData.profile_pic === "string"
                              ? formData.profile_pic // existing uploaded photo (URL)
                              : URL.createObjectURL(formData.profile_pic) // newly uploaded file
                          }
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-500" />
                      )}

                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
                        <Camera className="h-3 w-3" />
                        <input
                          type="file"
                          name="profile_pic"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold">Profile Photo</h4>
                      <p className="text-sm text-gray-500">Upload a profile picture</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select Gender --</option>
                        {(genders??[]).map((gender, index) => (
                          <option key={index} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">D.O.B *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Role</option>
                        {(roles??[]).map(role => (
                          
                          <option key={role.id} value={role.id}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                      <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {(departments??[]).map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date *</label>
                      <input
                        type="date"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">StaffID</label>
                      <input
                        type="text"
                        name="staff_id"
                        value={formData.staff_id}
                        onChange={handleInputChange}
                        placeholder="e.g., DL123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="hidden"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="e.g., DL123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {modalType === "add" ? "Add Staff" : "Update Staff"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}