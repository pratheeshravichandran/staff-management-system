import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Bell, Users, CalendarCheck, DollarSign, Menu, Download, Eye, TrendingUp, Wallet, CreditCard, FileText, Calendar ,TrendingDown } from "lucide-react";

const PayslipModule = () => {
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem("token");
  const [payrollData, setPayrollData] = useState([]);
  
  useEffect(() => {
    axios.get('/payroll/my', {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    })
      .then((response) => {
        const { message, data } = response.data;
        setPayrollData(data);
      })
      .catch((error) => {
        if (error.response) {
          alert(`❌ Error: ${error.response.data.message}`);
        } else if (error.request) {
          alert("❌ Error: No response received from the server.");
        } else {
          alert(`❌ Error: ${error.message}`);
        }
      });
  }, []);

  const record = payrollData[0];

  const takeHomePercentage = record?.gross_salary
  ? ((record.net_salary / record.gross_salary) * 100).toFixed(2)
  : '0.00';

  const breakdown = [
    { label: 'Basic Salary',           amount: record?.basic_pay,    },
    { label: 'House Rent Allowance',   amount: record?.hra,          },
    { label: 'Dearness Allowance',     amount: record?.da,           },
    { label: 'Transport Allowance',    amount: record?.ta,           },
  ].map(item => ({
    ...item,
    percentage: record?.gross_salary
      ? ((item.amount / record?.gross_salary) * 100).toFixed(1)
      : 0
  }));

  const deduction = [
    { label: 'Provident Fund', amount: record?.pf_deduction ?? 0 },
    { label: 'Employee State Insurance', amount: record?.esi_deduction ?? 0 },
    { label: 'Income Tax', amount: record?.income_tax ?? 0 }
  ].map(item => ({
    ...item,
    percentage: record?.gross_salary
      ? ((item.amount / record.gross_salary) * 100).toFixed(1)
      : 0
  }));

  const totalDeductions = 
  (record?.pf_deduction ?? 0) +
  (record?.esi_deduction ?? 0) +
  (record?.sd_deduction ?? 0) +
  (record?.professional_tax ?? 0) +
  (record?.income_tax ?? 0) +
  (record?.other_tax ?? 0) +
  (record?.loan_penalty ?? 0);


  const earningsData = [
    { name: 'Basic Salary', value: record?.basic_pay, color: '#3B82F6' },
    { name: 'HRA', value: record?.hra , color: '#10B981' },
    { name: 'DA', value: record?.da, color: '#F59E0B' },
    { name: 'TA', value: record?.ta, color: '#F59E0B' }
  ];

  
  if (isHovered) return <div>Loading payroll records...</div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
       <div className="max-w-full mx-auto px-4">
        
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Salary Statement
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar size={16} />
                Employee ID: EMP001
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-6 rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Wallet size={24} />
              </div>
              <TrendingUp size={20} className="text-blue-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{record?.gross_salary.toLocaleString()}</h3>
            <p className="text-blue-100">Gross Salary</p>
          </div>

          <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <DollarSign size={24} />
              </div>
              <TrendingUp size={20} className="text-emerald-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{record?.net_salary.toLocaleString()}</h3>
            <p className="text-emerald-100">Net Salary</p>
          </div>

          <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <CreditCard size={24} />
              </div>
              <TrendingDown size={20} className="text-emerald-200" />
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{totalDeductions.toLocaleString()}</h3>
            <p className="text-orange-100">Total Deductions</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FileText size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{takeHomePercentage}%</h3>
            <p className="text-purple-100">Take Home</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Earnings & Deductions */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Salary Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Earnings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Earnings</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {breakdown.map((item, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{item.label}</span>
                          <span className="font-semibold">₹{item.amount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Gross Salary</span>
                        <span className="text-emerald-600">₹{record?.gross_salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deductions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Deductions</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {deduction.map((item, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{item.label}</span>
                          <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Net Salary</span>
                        <span className="text-emerald-600">₹{record?.net_salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            
            {/* Earnings Pie Chart */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                Earnings Distribution
              </h3>
              
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={earningsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {earningsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {earningsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                    <span className="text-sm font-medium">₹{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Bank Details */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                Employee Bank Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Bank Name</span>
                  <span className="font-medium">State Bank of India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Branch</span>
                  <span className="font-medium">Anna Nagar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">IFSC Code</span>
                  <span className="font-medium">SBIN0001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Account Holder</span>
                  <span className="font-medium">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Account Number</span>
                  <span className="font-medium">****1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipModule;