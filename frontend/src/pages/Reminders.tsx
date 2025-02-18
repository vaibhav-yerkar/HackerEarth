import React from 'react';
import { Bell, Calendar, Clock, AlertCircle } from 'lucide-react';

function Reminders() {
  const reminders = [
    {
      id: '1',
      title: 'Mathematics Test',
      description: 'Chapter 5: Algebra fundamentals',
      date: '2024-03-15',
      time: '09:00 AM',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Submit Science Project',
      description: 'Environmental Impact Study due',
      date: '2024-03-18',
      time: '03:00 PM',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Parent-Teacher Meeting',
      description: 'Quarterly progress discussion',
      date: '2024-03-20',
      time: '04:30 PM',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Set New Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{reminder.title}</h2>
                  <p className="text-gray-600 mb-4">{reminder.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {reminder.date}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {reminder.time}
                    </span>
                    <span className={`flex items-center text-sm px-2 py-1 rounded-full ${getPriorityColor(reminder.priority)}`}>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Push Notifications</span>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Disabled
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Reminder Frequency</span>
                <select className="text-sm border rounded-md px-2 py-1">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Reminders</span>
                <span className="font-semibold text-gray-900">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Priority</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reminders;