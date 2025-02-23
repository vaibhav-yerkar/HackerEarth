import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/index";
import { Book, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";

function Navigation() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-400 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8" />
            <span className="font-bold text-xl">{t("app.name")}</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>{t("nav.dashboard")}</span>
            </Link>
            <Link
              to="/calendar"
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <Calendar className="h-5 w-5" />
              <span>{t("nav.calendar")}</span>
            </Link>
            {user?.role === "teacher" && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t("nav.admin")}</span>
              </Link>
            )}
            <LanguageToggle />
            {user && (
              <div className="flex items-center space-x-4 ml-4 border-l pl-4">
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-indigo-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
