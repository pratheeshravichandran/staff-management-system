import React, { useState } from "react";
import { Calendar, Download, Eye, Filter, Search, BarChart3, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function ReportManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample report data
  const reports = [
    {
      id: 1,
      title: "Monthly Sales Report",
      type: "Sales",
      generatedBy: "John Smith",
      generatedDate: "2025-06-28",
      status: "completed",
      format: "PDF",
      size: "2.4 MB",
      downloads: 15,
      description: "Comprehensive sales performance analysis for June 2025"
    },
    {
      id: 2,
      title: "User Activity Dashboard",
      type: "Analytics",
      generatedBy: "Sarah Johnson",
      generatedDate: "2025-06-27",
      status: "processing",
      format: "Excel",
      size: "1.8 MB",
      downloads: 8,
      description: "User engagement and activity metrics"
    },
    {
      id: 3,
      title: "Financial Summary Q2",
      type: "Financial",
      generatedBy: "Mike Chen",
      generatedDate: "2025-06-25",
      status: "completed",
      format: "PDF",
      size: "3.2 MB",
      downloads: 23,
      description: "Quarterly financial performance and projections"
    },
    {
      id: 4,
      title: "Employee Performance Review",
      type: "HR",
      generatedBy: "Lisa Wang",
      generatedDate: "2025-06-24",
      status: "failed",
      format: "Excel",
      size: "0 MB",
      downloads: 0,
      description: "Annual performance evaluation summary"
    },
    {
      id: 5,
      title: "Inventory Status Report",
      type: "Operations",
      generatedBy: "David Brown",
      generatedDate: "2025-06-23",
      status: "completed",
      format: "CSV",
      size: "945 KB",
      downloads: 12,
      description: "Current inventory levels and stock analysis"
    }
  ];

  const reportTypes = [
    { key: 'all', label: 'All Reports', icon: FileText, count: reports.length },
    { key: 'sales', label: 'Sales', icon: TrendingUp, count: reports.filter(r => r.type === 'Sales').length },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, count: reports.filter(r => r.type === 'Analytics').length },
    { key: 'financial', label: 'Financial', icon: FileText, count: reports.filter(r => r.type === 'Financial').length },
    { key: 'hr', label: 'HR', icon: Users, count: reports.filter(r => r.type === 'HR').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'processing': return '⟳';
      case 'failed': return '✗';
      default: return '?';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === 'all' || report.type.toLowerCase() === activeTab;
    const matchesStatus = !statusFilter || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Reports Management</h3>
          <p className="text-gray-600 mt-1">Generate, view, and manage system reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              onClick={() => setActiveTab(type.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${
                activeTab === type.key
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {type.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Report</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Generated By</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Downloads</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {report.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{report.generatedBy}</td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(report.generatedDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    <span>{getStatusIcon(report.status)}</span>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{report.size}</td>
                <td className="py-3 px-4 text-gray-700">{report.downloads}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {report.status === 'completed' && (
                      <>
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {report.status === 'failed' && (
                      <button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="View Error"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Reports</p>
              <p className="text-2xl font-bold text-blue-700">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Processing</p>
              <p className="text-2xl font-bold text-yellow-700">
                {reports.filter(r => r.status === 'processing').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Failed</p>
              <p className="text-2xl font-bold text-red-700">
                {reports.filter(r => r.status === 'failed').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}