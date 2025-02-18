import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Calendar, Bell } from "lucide-react";

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to YetAnotherERP
        </h1>
        <p className="text-xl text-gray-600">
          Stay connected with your child's educational journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/dashboard"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Student Progress</h2>
          </div>
          <p className="text-gray-600">
            Track academic performance and attendance
          </p>
        </Link>

        <Link
          to="/calendar"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Events Calendar</h2>
          </div>
          <p className="text-gray-600">View upcoming events and assessments</p>
        </Link>

        <Link
          to="/reminders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Bell className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Reminders</h2>
          </div>
          <p className="text-gray-600">
            Stay updated with important notifications
          </p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Community</h2>
          </div>
          <p className="text-gray-600">
            Connect with teachers and other parents
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recent Updates
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-600 pl-4">
            <p className="text-gray-600">New assessment results available</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div className="border-l-4 border-indigo-600 pl-4">
            <p className="text-gray-600">Parent-teacher meeting scheduled</p>
            <p className="text-sm text-gray-500">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
