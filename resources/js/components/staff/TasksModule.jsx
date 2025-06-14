import React, { useState } from "react";

const TasksModule = () => {
  const initialTasks = [
    { id: 1, title: 'Complete project documentation', status: 'In Progress', dueDate: '2025-06-08', priority: 'High' },
    { id: 2, title: 'Review code changes', status: 'Pending', dueDate: '2025-06-06', priority: 'Medium' },
    { id: 3, title: 'Attend team meeting', status: 'Completed', dueDate: '2025-06-04', priority: 'Low' },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Due: {task.dueDate}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>

                  <div className="flex space-x-2">
                    {['In Progress', 'Completed', 'Rejected'].map(statusOption => (
                      <button
                        key={statusOption}
                        disabled={task.status === statusOption}
                        onClick={() => updateStatus(task.id, statusOption)}
                        className={`text-xs px-2 py-1 rounded ${
                          task.status === statusOption ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksModule;
