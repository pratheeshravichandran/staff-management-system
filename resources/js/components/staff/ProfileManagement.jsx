
import React, { useState, useEffect } from "react";
import axios from 'axios';
const ProfileManagement = () => {
const [staff, setStaff] = useState(null);
const [showProfileModal, setShowProfileModal] = useState(false);
const [staffData, setStaffData] = useState([]);

const token = localStorage.getItem("token");

const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  gender: "",
  email: "",
  phone_number: "",
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
  password: "password123",
});

useEffect(() => {
  // Fetch the logged-in user
  axios
    .get("/auth-user", {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
    .then((response) => {
      const user = response.data.user;

      setStaff((prevStaff) => ({
        ...prevStaff,
        staffId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        gender: user.gender,
        email: user.email,
        phone: user.phone_number,
        staffID: user.staff_id,
        roleName: user.role_name,
        departmentName: user.department_name,
        dob: user.dob?.split("T")[0],
        designation: user.designation,
        joiningDate: user.joining_date?.split("T")[0],
        salary: user.salary,
        status: user.status,
        address: user.address,
        photo: user.profile_pic,
      }));

      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        gender: user.gender || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        staff_id: user.staff_id || "",
        role: user.role || "",
        department_id: user.department_id || "",
        dob: user.dob?.split("T")[0] || "",
        designation: user.designation || "",
        profile_pic: user.profile_pic || null,
        status: user.status || "Active",
        joining_date: user.joining_date?.split("T")[0] || "",
        address: user.address || "",
        salary: user.salary || "",
        password: "password123",
      });
    })
    .catch((error) => {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("An unknown error occurred");
      }
    });
}, []);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = staff.staffId;

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
    const res = await axios.post(`/update/user/${userId}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });

    console.log("Response received:", res);

    const data = res.data;

    if (data.message) {
      alert(`Success: ${data.message}`);
      setShowProfileModal(false);

      setStaffData((prevStaffData) =>
        prevStaffData.map((staff) =>
          staff.id === userId
            ? {
                ...staff,
                firstName: formData.first_name || staff.firstName,
                lastName: formData.last_name || staff.lastName,
                gender: formData.gender || staff.gender,
                email: formData.email || staff.email,
                phone: formData.phone || staff.phone,
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
                photo: formData.photo || staff.photo,
              }
            : staff
        )
      );

      return;
    } else {
      alert("Unexpected response format.");
    }
  } catch (error) {
    console.log("Caught error:", error);
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

if (!staff) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium">Loading your profile...</p>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
     <div className="max-w-full mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
        <p className="text-gray-600">Manage and update your profile information</p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{staff.firstName} {staff.lastName}</h2>
                <p className="text-blue-100 text-sm">{staff.designation}</p>
                <p className="text-blue-100 text-sm">{staff.departmentName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 border border-white/20 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="font-medium">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="First Name" value={staff.firstName} />
                <InfoCard label="Last Name" value={staff.lastName} />
                <InfoCard label="Gender" value={staff.gender} />
                <InfoCard label="Date of Birth" value={staff.dob} />
                <InfoCard label="Email" value={staff.email} icon="email" />
                <InfoCard label="Phone" value={staff.phone} icon="phone" />
              </div>
              <InfoCard label="Address" value={staff.address} fullWidth />
            </div>

            {/* Work Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                Work Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="Staff ID" value={staff.staffID} />
                <InfoCard label="Role" value={staff.roleName} />
                <InfoCard label="Department" value={staff.departmentName} />
                <InfoCard label="Designation" value={staff.designation} />
                <InfoCard label="Joining Date" value={staff.joiningDate} />
                <InfoCard label="Salary" value={`₹${staff.salary}`} />
              </div>
              <StatusCard status={staff.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {formData.profile_pic && typeof formData.profile_pic === "string" ? (
                      <img
                        src={formData.profile_pic}
                        alt="Current Profile"
                        className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 shadow-lg"
                      />
                    ) : formData.profile_pic ? (
                      <img
                        src={URL.createObjectURL(formData.profile_pic)}
                        alt="New Profile"
                        className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        name="profile_pic"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profile_pic: e.target.files[0],
                          })
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                  <FormSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Select Gender" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    required
                  />
                  <FormField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <FormField
                    label="Phone Number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Staff ID"
                    name="staff_id"
                    value={formData.staff_id}
                    disabled
                    readonly
                  />
                  <FormSelect
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "-- Select Status --" },
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                      { value: "On Leave", label: "On Leave" },
                    ]}
                  />
                </div>

                {/* Read-only Fields */}
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Work Information (Read-only)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Department"
                      value={staff.departmentName}
                      readonly
                      disabled
                    />
                    <FormField
                      label="Designation"
                      value={formData.designation}
                      readonly
                      disabled
                    />
                    <FormField
                      label="Role"
                      value={staff.roleName}
                      readonly
                      disabled
                    />
                    <FormField
                      label="Joining Date"
                      type="date"
                      value={formData.joining_date}
                      readonly
                      disabled
                    />
                    <FormField
                      label="Salary"
                      value={formData.salary}
                      readonly
                      disabled
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

// Helper Components
const InfoCard = ({ label, value, icon, fullWidth = false }) => (
<div className={`bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition-colors ${fullWidth ? 'col-span-full' : ''}`}>
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 break-words">{value || 'Not specified'}</p>
    </div>
    {icon && (
      <div className="ml-3">
        {icon === 'email' && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        )}
        {icon === 'phone' && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )}
      </div>
    )}
  </div>
</div>
);

const StatusCard = ({ status }) => {
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
    case 'on leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

return (
  <div className="col-span-full">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
      {status || 'Not specified'}
    </span>
  </div>
);
};

const FormField = ({ label, name, type = "text", value, onChange, required = false, disabled = false, readonly = false, placeholder }) => (
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
    readOnly={readonly}
    placeholder={placeholder}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 ${
      disabled || readonly 
        ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
        : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
    }`}
  />
</div>
);

const FormSelect = ({ label, name, value, onChange, options, required = false }) => (
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
  <select
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
);

export default ProfileManagement;