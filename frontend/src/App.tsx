import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import ChatBot from "./components/ChatBot"; // Add this import
import Login from "./pages/Login";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Calendar from "./pages/Calendar";
import AdminPanel from "./pages/AdminPanel";
import Reminders from "./pages/Reminders";
import Attendance from "./pages/Attendance";
import OfflineIndicator from "./components/OfflineIndicator";
import { useAppStore } from "./store/index";

const queryClient = new QueryClient();

// Create a wrapper component to conditionally render ChatBot
function AppContent() {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const isOffline = useAppStore((state) => state.isOffline);

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navigation />}
      {isOffline && <OfflineIndicator />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={user ? <StudentDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={user ? <Calendar /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user?.role === "teacher" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/reminders"
            element={user ? <Reminders /> : <Navigate to="/login" />}
          />
          <Route
            path="/attendance"
            element={user ? <Attendance /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      {/* Only show ChatBot if not on login page and user is logged in */}
      {location.pathname !== "/login" && user && <ChatBot />}
    </div>
  );
}

function App() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
