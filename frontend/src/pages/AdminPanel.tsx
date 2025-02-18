import React from 'react';
import { Users, FileText, Calendar as CalendarIcon, Settings } from 'lucide-react';

function AdminPanel() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Students</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold ml-2">Assessments</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">Events</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-600">This Month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-purple-600" />
            <h2 className="text-xl font-semibold ml-2">Reports</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">25</p>
          <p className="text-sm text-gray-600">Generated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Student Updates</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-sm text-gray-600">Grade updated in Mathematics</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800">View</button>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Michael Chen</h3>
                <p className="text-sm text-gray-600">New attendance record added</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800">View</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg text-left hover:bg-indigo-100">
              <h3 className="font-semibold text-indigo-900">Add Student</h3>
              <p className="text-sm text-indigo-600">Register new student</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-left hover:bg-green-100">
              <h3 className="font-semibold text-green-900">Create Assessment</h3>
              <p className="text-sm text-green-600">Schedule new test</p>
            </button>
            <button className="p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100">
              <h3 className="font-semibold text-blue-900">Generate Report</h3>
              <p className="text-sm text-blue-600">Create performance report</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100">
              <h3 className="font-semibold text-purple-900">Send Notice</h3>
              <p className="text-sm text-purple-600">Broadcast announcement</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;