import React from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store";
import { Book, Calendar, Bell, LayoutDashboard } from "lucide-react";
import LanguageToggle from "./LanguageToggle";

function Navigation() {
  const user = useAppStore((state) => state.user);

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8" />
            <span className="font-bold text-xl">Y-A-ERP</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/calendar"
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            <Link
              to="/reminders"
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <Bell className="h-5 w-5" />
              <span>Reminders</span>
            </Link>
            {user?.role === "teacher" && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
