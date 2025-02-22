import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart2,
  Book,
  Award,
  Bell,
  Settings,
} from "lucide-react";
import { StudentProfile } from "../types";
import { useAppStore } from "../store/index";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Home() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const user = useAppStore((state) => state.user);
  const [selectedMetric, setSelectedMetric] = useState("overall");
  const [highlightedSubject, setHighlightedSubject] = useState<string | null>(
    null
  );

  const subjects = ["Math", "Science", "English", "History"] as const;
  const subjectColors = {
    Math: "#818cf8",
    Science: "#22c55e",
    English: "#f59e0b",
    History: "#6366f1",
  } as const;

  const getLineStyle = (subject: keyof typeof subjectColors) => ({
    stroke: highlightedSubject
      ? highlightedSubject === subject
        ? subjectColors[subject]
        : "#d1d5db"
      : subjectColors[subject],
    opacity: highlightedSubject
      ? highlightedSubject === subject
        ? 1
        : 0.5
      : 1,
    strokeWidth: highlightedSubject === subject ? 3 : 2,
  });

  useEffect(() => {
    if (user?.role === "parent") {
      const cachedProfile = localStorage.getItem(
        "cache_GET_/get_students_profile"
      );
      if (cachedProfile) {
        try {
          const profileData = JSON.parse(cachedProfile);
          setStudentProfile(profileData.data);
        } catch (error) {
          console.error("Error parsing cached profile:", error);
        }
      }
    }
  }, [user?.role]);

  const getThirdCard = () => {
    if (user?.role === "teacher") {
      return (
        <Link
          to="/admin"
          className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-900">
              Admin Panel
            </h2>
          </div>
          <p className="text-gray-600">
            Manage students, classes, and administrative tasks
          </p>
        </Link>
      );
    }
    return (
      <Link
        to="/attendance"
        className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold ml-4 text-gray-900">
            Attendance Tracking
          </h2>
        </div>
        <p className="text-gray-600">
          Monitor attendance patterns and view detailed reports
        </p>
      </Link>
    );
  };

  // Sample data for demo chart
  const demoData = [
    {
      month: "Jan",
      math: 68,
      science: 70,
      english: 76,
      history: 82,
    },
    {
      month: "Feb",
      math: 80,
      science: 76,
      english: 70,
      history: 66,
    },
    {
      month: "Mar",
      math: 85,
      science: 66,
      english: 80,
      history: 58,
    },
    {
      month: "Apr",
      math: 76,
      science: 80,
      english: 92,
      history: 74,
    },
    {
      month: "May",
      math: 90,
      science: 83,
      english: 95,
      history: 88,
    },
  ];

  const metrics = [
    { id: "overall", name: "Overall", color: "#818cf8" },
    { id: "math", name: "Mathematics", color: "#22c55e" },
    { id: "science", name: "Science", color: "#f59e0b" },
    { id: "english", name: "English", color: "#ec4899" },
    { id: "history", name: "History", color: "#6366f1" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-indigo-600">YetAnotherERP</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {user
            ? user.role === "parent"
              ? `Stay connected with ${studentProfile?.name}'s educational journey through our comprehensive school management system`
              : "Empower your teaching experience with our comprehensive school management system"
            : "A comprehensive school management system for parents and teachers"}
        </p>
      </div>

      {/* Main Features Grid - Only show when user is logged in */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Link
          to="/dashboard"
          className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <BarChart2 className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-900">
              Performance Analytics
            </h2>
          </div>
          <p className="text-gray-600">
            Track academic progress with detailed insights and visual analytics
          </p>
        </Link>

        <Link
          to="/calendar"
          className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold ml-4 text-gray-900">
              Academic Calendar
            </h2>
          </div>
          <p className="text-gray-600">
            Stay updated with events, exams, and important dates
          </p>
        </Link>

        {getThirdCard()}
      </div>

      {/* Analytics Preview Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Performance Analytics
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track academic progress with detailed subject-wise analysis
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() =>
                setHighlightedSubject(
                  highlightedSubject === subject ? null : subject
                )
              }
              className={`
                px-4 py-2 rounded-full text-sm transition-all
                ${
                  highlightedSubject === subject
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="h-[400px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demoData}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              {subjects.map((subject) => (
                <Line
                  key={subject}
                  type="monotone"
                  dataKey={subject.toLowerCase()}
                  name={subject}
                  connectNulls
                  {...getLineStyle(subject)}
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Track Progress Over Time
            </h3>
            <p className="text-gray-600">
              Monitor academic performance trends with interactive graphs.
              Switch between subjects or view overall progress to identify areas
              for improvement.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Compare performance across different subjects
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Identify strength areas and improvement opportunities
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                Get detailed insights with interactive tooltips
              </li>
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">Current Average</p>
                <p className="text-2xl font-bold text-indigo-600">85%</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+15%</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">Best Subject</p>
                <p className="text-xl font-bold text-blue-600">English</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">Focus Area</p>
                <p className="text-xl font-bold text-orange-600">Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex items-start p-4">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <Book className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Comprehensive Reports
              </h3>
              <p className="text-gray-600 mt-1">
                Detailed academic performance analysis
              </p>
            </div>
          </div>

          <div className="flex items-start p-4">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Real-time Notifications
              </h3>
              <p className="text-gray-600 mt-1">
                Stay updated with important announcements
              </p>
            </div>
          </div>

          <div className="flex items-start p-4">
            <div className="p-2 bg-white rounded-lg shadow-md">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Achievement Tracking
              </h3>
              <p className="text-gray-600 mt-1">
                Monitor and celebrate student success
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
