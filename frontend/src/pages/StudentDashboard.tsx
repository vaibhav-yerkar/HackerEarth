import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, GraduationCap, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const performanceData = [
    { date: "Feb 1", Mathematics: 85, Science: 78, English: 92, History: 88 },
    { date: "Feb 15", Mathematics: 82, Science: 85, English: 88, History: 85 },
    { date: "Mar 1", Mathematics: 90, Science: 88, English: 85, History: 92 },
    { date: "Mar 15", Mathematics: 88, Science: 92, English: 90, History: 87 },
    { date: "Apr 1", Mathematics: 92, Science: 90, English: 88, History: 90 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Student Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Academic Progress</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">92%</p>
          <p className="text-sm text-gray-600">Current Average</p>
        </div>

        <Link
          to="/attendance"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <UserCheck className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold ml-2">Attendance</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">95%</p>
          <p className="text-sm text-gray-600">Present Days</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">Upcoming</h2>
          </div>
          <p className="text-lg font-medium text-gray-900">3 Assessments</p>
          <p className="text-sm text-gray-600">This Week</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Subject Performance Trends
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Mathematics"
                stroke="#6366f1"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Science"
                stroke="#22c55e"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="English"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="History"
                stroke="#ec4899"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recent Remarks
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-600 pl-4">
            <p className="text-gray-600">
              Excellent participation in class discussions
            </p>
            <p className="text-sm text-gray-500">Ms. Johnson - Mathematics</p>
            <p className="text-xs text-gray-400">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

