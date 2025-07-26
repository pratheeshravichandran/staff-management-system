import React, { useEffect, useState } from "react";
import axios from "axios";
import useStaffMetadata from "./context/hooks/useStaffMetadata";
import { Plus, Search, Filter, Calendar, User, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

export default function TaskManagement() {
  const token=localStorage.getItem("token");
  const [tasks, setTasks] = useState([ ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    department: "",
    priority: "Medium",
    dueDate: "",
    status: "pending"
  });

  const[staff, setStaffs]=useState([]);
  useEffect(() => {
    const api = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });
  
    api.get("/get-staffs").then(r => {
      setStaffs(r.data.staff ?? []);
      console.log(r.data.staff);
    });

    api.get("/view-all-task").then(r=>{
      setTasks(r.data.data??[]);
    });
  }, []); // 👈 runs only once after initial render
  
 const departments=[];
  const statuses = ["pending", "in_progress", "completed", "cancelled"];
  const priorities = ["Low", "Medium", "High"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress": return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleAddTask = async () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const payload = {
        task_title: newTask.title,
        description: newTask.description,
        staff_id: newTask.assignedTo,
        department_id: newTask.department,
        priority: newTask.priority,
        due_date: newTask.dueDate
      };
  
      try {
        const api = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const response = await api.post('/assign-task', payload);
  
        if (response.data.status) {
          const addedTask = {
            id: response.data.data.id,
            title: response.data.data.task_title,
            description: response.data.data.description,
            assignedTo: newTask.assignedTo,
            department: newTask.department,
            priority: response.data.data.priority,
            dueDate: response.data.data.due_date,
            createdDate: response.data.data.created_at.split("T")[0],
            progress: 0,
            status: "pending"
          };
  
          setTasks([...tasks, addedTask]);
  
          setNewTask({
            title: "",
            description: "",
            assignedTo: "",
            department: "",
            priority: "Medium",
            dueDate: "",
            status: "pending"
          });
  
          setShowAddTask(false);
          alert(response.data.message); // "Task assigned successfully."
        }
      } catch (error) {
        console.error("Backend error:", error);
  
        if (error.response) {
          alert(
            error.response.data.message ||
            JSON.stringify(error.response.data)
          );
        } else if (error.request) {
          alert("No response from server. Please check your connection.");
        } else {
          alert("Request error: " + error.message);
        }
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };
  
  
  

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, progress: newStatus === "completed" ? 100 : task.progress }
        : task
    ));
  };

  const updateTaskProgress = (taskId, progress) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            progress: progress,
            status: progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending"
          }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    const matchesSearch = task.task_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.staff_id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "completed").length
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Task Management</h3>
          <p className="text-gray-600 mt-1">Assign and track tasks for your team</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{taskStats.pending}</div>
          <div className="text-sm text-yellow-600">pending</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{taskStats.inProgress}</div>
          <div className="text-sm text-blue-600">in_progress</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{taskStats.completed}</div>
          <div className="text-sm text-green-600">completed</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-700">{taskStats.overdue}</div>
          <div className="text-sm text-red-600">Overdue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, staff, or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(task.status)}
                  <h4 className="text-lg font-semibold text-gray-900">{task.task_title}</h4>
                  <span className={`px-2 py-1 text-xs border rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{`${task.staff.first_name} ${task.staff.last_name}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:ml-4">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks found matching your criteria.
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select staff member</option>
                  {staff.map(person => (
                    <option key={person.id} value={person.id}>{person.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}