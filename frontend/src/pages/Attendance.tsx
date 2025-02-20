import { useState, useEffect } from "react";
import ApiService from "../services/api";
import { AttendanceResponse, AttendanceEntry } from "../types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

function Attendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
        if (!studentId) {
          throw new Error("Student ID not found");
        }

        const response = await ApiService.get<AttendanceResponse>(
          `/get_student_attendance/${studentId}`
        );
        setAttendanceData(response.Attendance);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        // API service will return cached data on error, so we don't need to handle it here
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for cache hits
    const handleCacheHit = (event: CustomEvent<{ key: string; data: any }>) => {
      if (event.detail.key.startsWith("GET_/get_student_attendance/")) {
        setAttendanceData(event.detail.data.Attendance);
        setIsLoading(false);
      }
    };

    window.addEventListener("api-cache-hit", handleCacheHit as EventListener);
    fetchAttendance();

    return () => {
      window.removeEventListener(
        "api-cache-hit",
        handleCacheHit as EventListener
      );
    };
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const getAttendanceForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendanceData.find((entry) => entry.attendance_date === dateStr);
  };

  const getAttendanceColor = (date: Date) => {
    if (isWeekend(date)) return "bg-gray-100 text-gray-400";

    const attendance = getAttendanceForDate(date);
    if (!attendance) return "bg-white";

    return attendance.attendance_remarks == "P"
      ? "bg-green-300 text-green-800 font-bold"
      : "bg-red-200 text-red-800 font-bold";
  };

  const calculateSummary = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(
      (entry) => entry.attendance_remarks === "P"
    ).length;
    const absentDays = totalDays - presentDays;
    const presentRate =
      totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    const absentRate =
      totalDays > 0 ? Math.round((absentDays / totalDays) * 100) : 0;

    return { totalDays, presentDays, absentDays, presentRate, absentRate };
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div className="max-w-7xl mx-auto h-screen p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Attendance Calendar
      </h1>

      <div className="flex gap-4 h-[calc(100vh-120px)] scale-90">
        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePreviousMonth}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm
                  ${getAttendanceColor(day)}
                  ${!isSameMonth(day, currentDate) ? "opacity-25" : ""}
                `}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-4 w-80">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Attendance Summary
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 text-2xl font-bold">
                {summary.presentRate}%
              </p>
              <p className="text-green-600">Present Rate</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 text-2xl font-bold">
                {summary.absentRate}%
              </p>
              <p className="text-red-600">Absent Rate</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-2xl font-bold">
                {summary.absentDays}
              </p>
              <p className="text-blue-600">Total Absences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
