import React, { useEffect, useState } from "react";
import { Search, DollarSign, Users, Calculator, ArrowLeft, Trash2, ChevronDown } from 'lucide-react';
import axios from 'axios';
const PayrollManagement = () => {
  
  const token = localStorage.getItem('token');
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false); // Changed to false initially

  const [salaryData, setSalaryData] = useState({
    
  });


  const [searchName, setSearchName] = useState('');
  const [searchstaffId, setSearchstaffId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'salary'

  const [salaryForm, setSalaryForm] = useState({
    basic_pay: '',
    hra: '',
    da: '',
    ta:'',
    pf_deduction: '',
    esi_deduction: '',
    income_tax: '',
    payment_month: ''
  });
  

  useEffect(() => {
    axios.get("/departments", {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      setDepartments(['All', ...response.data.departments.map(dep => dep.name)]);
    })
    .catch(error => {
      if (error.response) {
        console.error("Departments Error:", error.response.data.error || error.response.data);
        alert(`Departments Error: ${error.response.data.error || "Unknown error"}`);
      }
    });

    axios
      .get("get/college-staffs", {
        headers: { Authorization: token },
      })
      .then((response) => {
        const formattedStaff = response.data.staff.map((item) => ({
          id: item.id,
          name: item.full_name,
          staffId: item.staff_id,
          department: item.department || "Unassigned",
          designation:item.designation,
          role: item.role_name,
          joinDate: item.joining_date?.split("T")[0] || "",
          email: item.email,
          phone: item.phone_number,
          netsalary:item.net_salary,
        }));
        setStaffList(formattedStaff); 
      })
      .catch((error) => {
        console.error("Staff Fetch Error:", error.response?.data || error);
      });

    
  }, []);
  
 
  // Filter staff based on search criteria
  const filteredStaff = staffList.filter(staff => {
    const matchesName = staff.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesStaffId = staff.staffId.toLowerCase().includes(searchstaffId.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || staff.department === selectedDepartment;
  
    return matchesName && matchesStaffId && matchesDepartment;
  });

 
  const closeModal = () => {
    setShowModal(false);
    setCurrentView('list'); 
    setSelectedStaff(null); 
    setSalaryForm({
      basic_pay: '',
      hra: '',
      da: '',
      ta:'',
      pf_deduction: '',
      esi_deduction: '',
      income_tax: '',
      payment_month: ''
    });

  };
  
  const handleStaffClick = async (staff) => {
    setSelectedStaff(staff);
    setShowModal(true); // Add this line to show the modal
    
    try {
      const response = await axios.get(`/staff-payroll/${staff.id}`, {
        headers: { Authorization: token }
      });
  
      const staffPayroll = response.data.staff[0];
  
      if (staffPayroll) {
        setSalaryForm({
          id:staffPayroll.id??'',
          basic_pay: staffPayroll.basic_pay ?? '',
          hra: staffPayroll.hra ?? '',
          da: staffPayroll.da ?? '',
          ta:staffPayroll.ta??'',
          pf_deduction: staffPayroll.pf_deduction ?? '',
          esi_deduction: staffPayroll.esi_deduction ?? '',
          income_tax: staffPayroll.income_tax ?? '',
          payment_month: staffPayroll.payment_month?.split("T")[0] ?? ''
        });       
        console.log("Loaded Payroll ID:", staffPayroll.id);  // this should print a number
      } else {
        setSalaryForm({
          basic_pay: '',
          hra: '',
          da: '',
          ta:'',
          pf_deduction: '',
          esi_deduction: '',
          income_tax: '',
          payment_month: ''
        });
      }
    } catch (error) {
      console.error("Payroll fetch error:", error);
      setSalaryForm({
        basic_pay: '',
        hra: '',
        da: '',
        ta:'',
        pf_deduction: '',
        esi_deduction: '',
        income_tax: '',
        payment_month: ''
      });
    }
  
    setCurrentView('salary');
  };
  
  const handleSalarySubmit = async () => {
    if (!selectedStaff) return;
    
    const payload = {
      staff_id: selectedStaff.id,
      basic_pay: parseFloat(salaryForm.basic_pay) || 0,
      hra: parseFloat(salaryForm.hra) || 0,
      da: parseFloat(salaryForm.da) || 0,
      ta: parseFloat(salaryForm.ta) || 0,
      pf_deduction: parseFloat(salaryForm.pf_deduction) || 0,
      esi_deduction: parseFloat(salaryForm.esi_deduction) || 0,
      sd_deduction: parseFloat(salaryForm.sd) || 0,
      professional_tax: parseFloat(salaryForm.professional_tax) || 0,
      income_tax: parseFloat(salaryForm.income_tax) || 0,
      other_tax: parseFloat(salaryForm.other_tax) || 0,
      loan_penalty: parseFloat(salaryForm.loan_penalty) || 0,
      payment_month: salaryForm.payment_month || new Date().toISOString().slice(0, 10),
    };
  
    try {
      const response = await axios.post("/payroll", payload, {
        headers: {
          Authorization: token,
        },
      });  
      const savedData = response.data.data;
  
      // Calculate net salary
      const grossSalary = (parseFloat(salaryForm.basic_pay) || 0) + 
                         (parseFloat(salaryForm.hra) || 0) + 
                         (parseFloat(salaryForm.da) || 0)+
                         (parseFloat(salaryForm.ta) || 0);
      
      const totalDeductions = (parseFloat(salaryForm.pf_deduction) || 0) + 
                             (parseFloat(salaryForm.esi_deduction) || 0) + 
                             (parseFloat(salaryForm.income_tax) || 0);
      
      const netSalary = grossSalary - totalDeductions;
  
      setSalaryData((prev) => ({
        ...prev,
        [savedData.staff_id]: {
          ...salaryForm,
        },
      }));
  
      // Update the staffList with the new net salary
      setStaffList(prevStaffList => 
        prevStaffList.map(staff => 
          staff.id === selectedStaff.id 
            ? { ...staff, netsalary: netSalary }
            : staff
        )
      );
  
      closeModal();
      alert(response.data.message || 'Salary saved successfully!');
    } catch (error) {
      console.error("Payroll Save Error:", error.response?.message || error);
      alert(error.response?.message || error);
    }
  };
  

  const deletePayroll = async (payrollId) => {
    console.log("Deleting payroll with ID:", payrollId);
  
    if (!payrollId || isNaN(payrollId)) {
      alert("No payroll record selected for deletion.");
      return;
    }
  
    try {
      const response = await axios.delete(`/payroll/${payrollId}`, {
        headers: { Authorization: token }
      });
  
      // Update the staffList to reset net salary to 0
      setStaffList(prevStaffList => 
        prevStaffList.map(staff => 
          staff.id === selectedStaff?.id 
            ? { ...staff, netsalary: 0 }
            : staff
        )
      );
  
      alert(response.data.message || "Payroll deleted successfully.");
      setCurrentView('list');
      setSalaryForm({
        id: '',
        basic_pay: '',
        hra: '',
        da: '',
        pf_deduction: '',
        esi_deduction: '',
        income_tax: '',
        payment_month: '',
      });
    } catch (error) {
      console.error("Error deleting payroll:", error);
      alert(error.response?.data?.error || "Failed to delete payroll.");
    }
  };
  
  const renderStaffList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <p className="text-base font-semibold text-blue-700">Total Staff</p>
                <p className="text-3xl font-bold text-blue-900">{staffList.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 text-green-600 mr-4" />
              <div>
                <p className="text-base font-semibold text-green-700">With Salary Data</p>
                <p className="text-3xl font-bold text-green-900">{Object.keys(salaryData).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-center">
              <Calculator className="h-10 w-10 text-purple-600 mr-4" />
              <div>
                <p className="text-base font-semibold text-purple-700">Departments</p>
                <p className="text-3xl font-bold text-purple-900">
                  {new Set(staffList.map(s => s.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Search & Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter employee name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Employee ID Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Employee ID</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter employee ID..."
                  value={searchstaffId}
                  onChange={(e) => setSearchstaffId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Department</label>
              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept === 'All' ? '' : dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => {
          return (
            <div
              key={staff.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
              onClick={() => handleStaffClick(staff)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{staff.name}</h3>
                  <p className="text-blue-600 font-semibold text-lg">{staff.staffId}</p>
                </div>
                <div className="flex gap-2">
                  
                <button
  onClick={async (e) => {
    e.stopPropagation();

    // First, fetch the payroll ID for the clicked staff
    try {
      const response = await axios.get(`/staff-payroll/${staff.id}`, {
        headers: { Authorization: token }
      });

      const payroll = response.data.staff[0];
      if (payroll?.id) {
        deletePayroll(payroll.id);
      } else {
        alert("No payroll record found for this staff.");
      }
    } catch (err) {
      console.error("Failed to fetch payroll before deletion:", err);
      alert("Unable to fetch payroll details.");
    }
  }}
  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
>
  <Trash2 className="h-5 w-5" />
</button>

                </div>
              </div>
              
              <div className="space-y-3 text-base text-gray-700">
                <p><span className="font-semibold text-gray-900">Role:</span> {staff.role}</p>
                <p><span className="font-semibold text-gray-900">Department:</span> {staff.department}</p>
                <p><span className="font-semibold text-gray-900">Join Date:</span> {staff.joinDate}</p>
                <p><span className="font-semibold text-gray-900">Email:</span> {staff.email}</p>
              </div>
              
            
              <div className="mt-6 pt-4 border-t border-gray-200">
  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-semibold text-lg">Net Salary:</span>
    {staff.netsalary ? (
      <span className="font-bold text-green-600 text-2xl">₹{staff.netsalary}</span>
    ) : (
      <span className="font-bold text-yellow-600 text-lg">0</span>
    )}
  </div>
</div>

<div className="mt-4">
  <div
    className={`inline-flex px-3 py-2 rounded-full text-sm font-semibold ${
      staff.netsalary
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}
  >
    {staff.netsalary ? 'Salary Configured' : 'Pending Salary Setup'}
  </div>
</div>

            </div>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No staff members found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  const renderSalaryForm = () => {  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <button
             onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Salary Configuration</h1>
              <p className="text-xl text-gray-700 font-semibold">{selectedStaff?.name} - {selectedStaff?.staffId}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-700">
            <div>
              <p><span className="font-semibold text-gray-900">Department:</span> {selectedStaff?.department}</p>
              <p><span className="font-semibold text-gray-900">role:</span> {selectedStaff?.role}</p>
            </div>
            <div>
              <p><span className="font-semibold text-gray-900">Join Date:</span> {selectedStaff?.joinDate}</p>
              <p><span className="font-semibold text-gray-900">Email:</span> {selectedStaff?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Components</h2>
            
            <div className="space-y-6">
              {/* Earnings */}
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-4">Earnings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">Basic Salary</label>
                    <input
                      type="number"
                      value={salaryForm.basic_pay}
                      onChange={(e) => setSalaryForm({...salaryForm, basic_pay: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter basic salary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">HRA (House Rent Allowance)</label>
                    <input
                      type="number"
                      value={salaryForm.hra}
                      onChange={(e) => setSalaryForm({...salaryForm, hra: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter HRA amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">DA (Dearness Allowance)</label>
                    <input
                      type="number"
                      value={salaryForm.da}
                      onChange={(e) => setSalaryForm({...salaryForm, da: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter DA amount"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">TA (Traveling Allowance)</label>
                    <input
                      type="number"
                      value={salaryForm.ta}
                      onChange={(e) => setSalaryForm({...salaryForm, ta: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter DA amount"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-xl font-semibold text-red-700 mb-4">Deductions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">PF (Provident Fund)</label>
                    <input
                      type="number"
                      value={salaryForm.pf_deduction}
                      onChange={(e) => setSalaryForm({...salaryForm, pf_deduction: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter PF amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">ESI (Employee State Insurance)</label>
                    <input
                      type="number"
                      value={salaryForm.esi_deduction}
                      onChange={(e) => setSalaryForm({...salaryForm, esi_deduction: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter ESI amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">income_tax Deduction</label>
                    <input
                      type="number"
                      value={salaryForm.income_tax}
                      onChange={(e) => setSalaryForm({...salaryForm, income_tax: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter income_tax amount"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSalarySubmit}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors"
              >
                Save Salary Details
              </button>
            </div>
          </div>

          {/* Salary Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Summary</h2>
            
            {salaryForm.basic_pay && (
              <div className="space-y-6">
                {/* Earnings Summary */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                  <h3 className="font-bold text-green-800 mb-4 text-lg">Total Earnings</h3>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between">
                      <span className="font-semibold">Basic Salary:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.basic_pay || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">HRA:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.hra || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">DA:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.da || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">TA:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.ta || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-800 pt-3 border-t border-green-300 text-lg">
                      <span>Gross Salary:</span>
                      <span>₹{(parseFloat(salaryForm.basic_pay || 0) + parseFloat(salaryForm.hra || 0) + parseFloat(salaryForm.da || 0) + parseFloat(salaryForm.ta || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Summary */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-5 rounded-xl border border-red-200">
                  <h3 className="font-bold text-red-800 mb-4 text-lg">Total Deductions</h3>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between">
                      <span className="font-semibold">PF:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.pf_deduction || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">ESI:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.esi_deduction|| 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">income_tax:</span>
                      <span className="font-bold">₹{parseFloat(salaryForm.income_tax || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-red-800 pt-3 border-t border-red-300 text-lg">
                      <span>Total Deductions:</span>
                      <span>₹{(parseFloat(salaryForm.pf_deduction || 0) + parseFloat(salaryForm.esi_deduction || 0) + parseFloat(salaryForm.income_tax || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary - Enhanced Size */}
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-xl border-2 border-blue-300 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">NET SALARY</h3>
                    <div className="text-5xl font-bold text-blue-900 mb-2">
                      ₹{((parseFloat(salaryForm.basic_pay || 0) + parseFloat(salaryForm.hra || 0) + parseFloat(salaryForm.da || 0) + parseFloat(salaryForm.ta || 0)) - (parseFloat(salaryForm.pf_deduction || 0) + parseFloat(salaryForm.esi_deduction || 0) + parseFloat(salaryForm.income_tax || 0))).toLocaleString()}
                    </div>
                    <p className="text-lg font-semibold text-blue-700">Monthly Take-Home Amount</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="w-full" key={currentView}>
          {currentView === 'list' && renderStaffList()}
          {showModal && currentView === 'salary' && renderSalaryForm()}
        </div>
      </div>
    </>
  );  
};

export default PayrollManagement;