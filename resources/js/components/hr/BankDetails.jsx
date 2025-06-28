import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Menu, X, Home, Users, CreditCard, Settings, LogOut, Building, MapPin, Hash, User, Briefcase, Eye } from 'lucide-react';
import axios from 'axios';

const StaffBankDetailsManager = () => {
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState({
    user_id: '',
    bank_name: '',
    branch: '',
    ifsc_code: '',
    account_holder_name: '',
    account_number: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  useEffect(() => {
      axios.get('/bank-details',
        {
          headers:{
            Authorization:token,
          },
        }
      )
        .then(response => {
            setBankDetails(response.data); 
        })
        .catch(err => {
          const errorMessage = err.response?.data?.message || 'Something went wrong.';
          setBankDetails(errorMessage);
        });

        axios.get('/get/staffs/names',
            {
              headers:{
                Authorization:token,
              },
            }
          )
            .then(response => {
                setStaffOptions(response.data); // e.g., "Leave records fetched successfully."
            })
            .catch(err => {
              const errorMessage = err.response?.data?.message || 'Something went wrong.';
              setStaffOptions(errorMessage);
            });
    }, []);


  const resetForm = () => {
    setCurrentRecord({
      user_id: '',
      bank_name: '',
      branch: '',
      ifsc_code: '',
      account_holder_name: '',
      account_number: ''
    });
  };

  const handleAdd = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setModalMode('edit');
    setCurrentRecord(record);
    setShowModal(true);
  };

  const handleView = (record) => {
    setModalMode('view');
    setCurrentRecord(record);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setBankDetails(bankDetails.filter(item => item.id !== deleteId));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSubmit = async () => {
  /* 1 —  Front‑end validation --------------------------------------------- */
  if (!currentRecord.user_id || !currentRecord.bank_name || !currentRecord.account_number) {
    alert("Please fill in all required fields");
    return;
  }

  if (!token) {
    alert("Authentication token missing. Please login again.");
    return;
  }

  /* 2 —  Prepare headers & payload ---------------------------------------- */
  const config = {
    headers: { Authorization: `Bearer ${token}` },     // add “Bearer ”
  };

  const payload = {
    user_id:              currentRecord.user_id,
    bank_name:            currentRecord.bank_name,
    branch:               currentRecord.branch,
    ifsc_code:            currentRecord.ifsc_code,
    account_holder_name:  currentRecord.account_holder_name,
    account_number:       currentRecord.account_number,
  };

  console.log("Submitting payload:", payload);

  /* 3 —  Submit ------------------------------------------------------------ */
  try {
    if (modalMode === "add") {
      const res = await axios.post("/bank-details", payload, config);

      /* 3a —  Laravel normally wraps new row in { data: {...} }  */
      const rawRecord = res.data.data || res.data;

      if (rawRecord && typeof rawRecord === "object") {
        /* 3b —  Attach the matching user so the UI never crashes */
        const user = staffOptions.find((s) => s.id === rawRecord.user_id) || null;

        setBankDetails((prev) => [...prev, { ...rawRecord, user }]);
      } else {
        /* 3c —  Unexpected shape → fallback: refresh whole list */
        const refresh = await axios.get("/bank-details", config);
        const list = Array.isArray(refresh.data) ? refresh.data : refresh.data.data || [];
        setBankDetails(list);
      }

      alert(res.data.message || "Bank details saved successfully!");
      setShowModal(false);
      resetForm();
    }

    /* 4 —  Edit mode can be added here (same pattern) ---------------------- */

  } catch (err) {
    /* 5 —  Extract the most helpful message -------------------------------- */
    const response     = err.response?.data;
    const firstError   = response?.errors
                         ? Object.values(response.errors)[0][0]                // 422 validator
                         : response?.error || response?.message;              // 500 or custom
    const humanMessage = firstError || err.message || "An unexpected error occurred";

    console.error("Full error packet:", response);
    alert(`Error: ${humanMessage}`);
  }
};

  

  const filteredBankDetails = bankDetails.filter(item =>
    item.user?.full_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    item.bank_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    item.account_holder_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    item.ifsc_code?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Staff Bank Details
                </h2>
                <p className="text-gray-500 mt-1">Manage employee banking information</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} className="mr-2" />
              Add Bank Details
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{bankDetails.length}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Bank Details</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{bankDetails.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Unique Banks</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{new Set(bankDetails.map(b => b.bank_name)).size}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBankDetails.map((record) => (
              <div key={record.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
                  {record?.user?.profile_pic ? (
  <img
    src={record.user.profile_pic}                       // already a full URL
    className="w-full h-full object-cover"
  />
) : (
  <User className="w-6 h-6 text-white" />
)}

    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{record.user.full_name}</h3>
                      <p className="text-gray-500 text-sm">{record.account_holder_name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleView(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{record.bank_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{record.branch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-mono">{record.ifsc_code}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Account Number</span>
                      <span className="text-sm font-mono text-gray-900">****{record.account_number.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBankDetails.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No bank details found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add Bank Details' : 
                   modalMode === 'edit' ? 'Edit Bank Details' : 'View Bank Details'}
                </h3>
                <p className="text-gray-500 mt-1">
                  {modalMode === 'add' ? 'Enter new staff banking information' :
                   modalMode === 'edit' ? 'Update banking information' : 'Banking information details'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
            <div>
  <label className="block text-sm font-semibold text-gray-700 mb-3">
    <User size={16} className="inline mr-2" />
    Staff Name
  </label>

  <select
    required
    disabled={modalMode === "view"}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
    value={currentRecord.user_id ?? ""}                 
    onChange={(e) => {
      const selectedId = Number(e.target.value);
      const selected   = staffOptions.find(s => s.id === selectedId) || {};

      setCurrentRecord(prev => ({
        ...prev,
        user_id   : selectedId,
        user      : selected,                             // { id, full_name, … }
        full_name : selected.full_name ?? "",             // if you still keep it flat
      }));
    }}
  >
    <option value="" disabled>
      {modalMode === "view" ? "—" : "Select a staff member"}
    </option>

    {staffOptions.map(({ id, full_name }) => (
      <option key={id} value={id}>
        {full_name}
      </option>
    ))}
  </select>
</div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Building size={16} className="inline mr-2" />
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  value={currentRecord.bank_name}
                  onChange={(e) => setCurrentRecord({...currentRecord, bank_name: e.target.value})}
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <MapPin size={16} className="inline mr-2" />
                  Branch
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  value={currentRecord.branch}
                  onChange={(e) => setCurrentRecord({...currentRecord, branch: e.target.value})}
                  placeholder="Enter branch name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Hash size={16} className="inline mr-2" />
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 uppercase font-mono transition-all duration-200"
                  value={currentRecord.ifsc_code}
                  onChange={(e) => setCurrentRecord({...currentRecord, ifsc_code: e.target.value.toUpperCase()})}
                  placeholder="Enter IFSC code"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <User size={16} className="inline mr-2" />
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                  value={currentRecord.account_holder_name}
                  onChange={(e) => setCurrentRecord({...currentRecord, account_holder_name: e.target.value})}
                  placeholder="Enter account holder name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <CreditCard size={16} className="inline mr-2" />
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 font-mono transition-all duration-200"
                  value={currentRecord.account_number}
                  onChange={(e) => setCurrentRecord({...currentRecord, account_number: e.target.value})}
                  placeholder="Enter account number"
                />
              </div>

              {modalMode !== 'view' && (
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {modalMode === 'add' ? 'Add Details' : 'Update Details'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to delete this bank detail record? This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StaffBankDetailsManager;