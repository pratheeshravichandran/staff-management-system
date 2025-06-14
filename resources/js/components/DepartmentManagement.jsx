import React, { useEffect,useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Building2, Sparkles } from 'lucide-react';
import axios from 'axios';

const DepartmentManagement = () => {
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hod: ''
  });

  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    axios.get('/staff',{
      headers:{
        Authorization: token,
      },
    })
      .then(response => {
        setStaffList(response.data.data); 
      })
      .catch(error => {
        alert("❌ Failed to fetch staff list");
        console.error(error);
      });

      axios.get('/departments',{
        headers:{
          Authorization :token,
        },
      })
        .then(response=>{
          setDepartments(response.data.departments);
        })
        .catch(error=>{
          alert(`❌Error: ${ response.data.error}`);
        })
  }, []);
  

  const resetForm = () => {
    setFormData({
      name: '',
      hod: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingDepartment(null);
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setFormData({
      name: department.name,
      hod: department.hod_id
    });
    setEditingDepartment(department);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, hod } = formData;
    const payload = {
      name: name,
      hod_id: hod,
    };
  
    try {
      let response;
  
      if (editingDepartment) {
        // Update API
        response = await axios.put(`/update/departments/${editingDepartment.id}`, payload, {
          headers: {
            Authorization: token,
          },
        });
  
        const updatedDepartment = response.data.data;
  
        setDepartments((prevDepartments) =>
          prevDepartments.map((dept) =>
            dept.id === updatedDepartment.id ? updatedDepartment : dept
          )
        );
  
        alert('✅ Department updated successfully!');
      } else {
        // Create API
        response = await axios.post('/store/departments', payload, {
          headers: {
            Authorization: token,
          },
        });
  
        const createdDepartment = response.data.data;
        setDepartments((prev) => [...prev, createdDepartment]);
        alert('✅ Department created successfully!');
      }
  
      closeModal();
  
    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.message}`);
      } else {
        alert('❌ Error: Unable to process the request.');
      }
    }
  };
  


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`/delete/departments/${id}`, {
          headers: {
            Authorization: token,
          },
        });
  
        // Remove from local state
        setDepartments(prev => prev.filter(dept => dept.id !== id));
        alert('✅ Department deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Failed to delete department.');
      }
    }
  };
  
  const gradientColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-3 rounded-2xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Department Management
                </h1>
                <p className="text-slate-600 text-lg">Manage your organization's departments</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Add Department</span>
              <Sparkles className="h-4 w-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {departments.map((department, index) => (
            <div key={department.id} className="group relative">
              {/* Gradient background blur effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[index % gradientColors.length]} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${gradientColors[index % gradientColors.length]} rounded-xl mb-4 shadow-lg`}>
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-700 transition-colors duration-300">
                        {department.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-500">HOD:</span>
                        <span className="text-sm font-semibold text-slate-700">{department.hod_name}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(department)}
                        className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Bottom gradient accent */}
                <div className={`h-1 bg-gradient-to-r ${gradientColors[index % gradientColors.length]} rounded-b-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-lg transform animate-in zoom-in duration-300">
              <div className="flex items-center justify-between p-8 border-b border-slate-200/50">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {editingDepartment ? 'Update department information' : 'Create a new department entry'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all duration-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                    placeholder="Enter department name"
                  />
                </div>
                
                <div className="space-y-2">
  <label className="block text-sm font-semibold text-slate-700">
    HOD Name *
  </label>
  <select
    name="hod"
    value={formData.hod}
    onChange={handleInputChange}
    required
    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 text-slate-700"
  >
    <option value="">Select HOD</option>
    {staffList.map((staff) => (
      <option key={staff.id} value={staff.id}>
        {staff.name}
      </option>
    ))}
  </select>
</div>

                
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingDepartment ? 'Update Department' : 'Create Department'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-2xl transition-all duration-300 font-semibold hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;  