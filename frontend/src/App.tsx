import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import Calendar from "./pages/Calendar";
import AdminPanel from "./pages/AdminPanel";
import Reminders from "./pages/Reminders";
import Attendance from "./pages/Attendance";
import OfflineIndicator from "./components/OfflineIndicator";
import { useAppStore } from "./store";

const queryClient = new QueryClient();

function App() {
  const isOffline = useAppStore((state) => state.isOffline);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          {isOffline && <OfflineIndicator />}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
