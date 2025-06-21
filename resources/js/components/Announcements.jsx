import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, Download, Plus, Bell, X, Upload, Send, Eye, FileText, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { ResponsiveContainer } from 'recharts';
const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const userRole = localStorage.getItem('userRole');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    sent_by: '',
    file: null,
  });
  
  const token = localStorage.getItem('token');
  const [announcements, setAnnouncements] =useState([]);

  useEffect(() => {
    axios.get('/announcements', {
      headers: {
        Authorization: token,
      },
    })
    .then(response => {
      setAnnouncements(response.data.data);
    })
    .catch(error => {
      if (error.response) {
        const backendError = error.response.data.error || "Unknown server error";
        console.error("Backend Error:", backendError);
        alert(`Error: ${backendError}`);
      }
    });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewAnnouncement({ ...newAnnouncement, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('message', newAnnouncement.message);
    formData.append('sent_by', newAnnouncement.sent_by);
    if (newAnnouncement.file) {
      formData.append('file', newAnnouncement.file);
    }
  
    try {
      const response = await axios.post('/announcements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token, 
        },
      });
  
      console.log('Announcement created:', response.data);
      setShowNewForm(false);
      setNewAnnouncement({ title: '', message: '', sent_by: '', file: null });
      alert(response.data.message);
    } catch (error) {
      console.error('Error creating announcement:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`/announcements/${id}`, {
        headers: {
          Authorization: token, // ✅ make sure token is valid
        },
      });
  
      console.log('Announcement deleted:', response.data);
      alert(response.data.message);
      // ✅ Remove the deleted announcement from the list
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      // ✅ Display meaningful error
      console.error('Error deleting announcement:', error.response?.data || error.message);
    }
  };
  
  

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.sent_by.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'with-files') return matchesSearch && announcement.file;
    if (filterBy === 'recent') {
      const isRecent = new Date(announcement.published_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && isRecent;
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header with glassmorphism effect */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Announcements
                </h1>
                <p className="text-gray-600 mt-1 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Stay updated with the latest news</span>
                </p>
              </div>
            </div>
            {(userRole === "Admin" || userRole === "Manager") && (
            <button 
              onClick={() => setShowNewForm(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Create Announcement</span>
            </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter with modern design */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-white/80 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[180px]"
              >
                <option value="all">All Announcements</option>
                <option value="recent">Recent (Last 7 days)</option>
                <option value="with-files">With Attachments</option>
              </select>
            </div>
          </div>
        </div>

        {/* New Announcement Form Modal */}
        {showNewForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span>Create New Announcement</span>
                  </h2>
                  <button 
                    onClick={() => setShowNewForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Announcement Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter announcement title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={newAnnouncement.message}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Write your announcement message here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Attachment (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer group"
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                          <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                            {newAnnouncement.file ? newAnnouncement.file.name : 'Click to upload a file'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, DOC, TXT, or Image files
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publish Announcement</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements List with modern cards */}
        <div className="space-y-6">
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{announcement.sent_by}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(announcement.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    {announcement.file && (
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300 group">
                        <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <a
  href={announcement.file}
  target="_blank"
  rel="noopener noreferrer"
  download
  className="text-sm text-blue-600 font-semibold underline hover:text-blue-800"
>
  View
</a>
                      </button>
                    )}
                  {announcement.id&&(
                    
                     <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300 group"
                       onClick={() => handleDelete(announcement.id)}
                     >
                       Delete
                     </button>
                   
                  )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">
                    {announcement.message}
                  </p>

                  {announcement.file && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Attachment:</span>
                        <a
  href={announcement.file}
  target="_blank"
  rel="noopener noreferrer"
  download
  className="text-sm text-blue-600 font-semibold underline hover:text-blue-800"
>
  View
</a>

                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredAnnouncements.length > 0 && (
          <div className="mt-12 text-center">
            <button className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 border border-white/20 px-8 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Load More Announcements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;