import React, { useState } from "react";
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  // Mock attendance data
  const attendanceData: { [key: string]: string } = {
    "2025-02-03": "present",
    "2025-02-04": "present",
    "2025-02-05": "present",
    "2025-02-06": "present",
    "2025-02-07": "absent",
    "2025-02-10": "present",
    "2025-02-11": "present",
    "2025-02-12": "present",
    "2025-02-13": "present",
    "2025-02-14": "present",
    "2025-02-17": "absent",
  };

  const getAttendanceColor = (date: Date) => {
    if (isWeekend(date)) return "bg-gray-100 text-gray-400";

    const dateStr = format(date, "yyyy-MM-dd");
    const status = attendanceData[dateStr];

    if (status === "present") return "bg-green-300 text-green-800 font-bold";
    if (status === "absent") return "bg-red-200 text-red-800 font-bold";
    return "bg-white";
  };

  return (
    <div className="max-w-7xl mx-auto h-screen p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Attendance Calendar
      </h1>

      <div className="flex gap-4 h-[calc(100vh-120px)]">
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
              <p className="text-green-800 text-2xl font-bold">95%</p>
              <p className="text-green-600">Present Rate</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 text-2xl font-bold">5%</p>
              <p className="text-red-600">Absent Rate</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-2xl font-bold">2</p>
              <p className="text-blue-600">Total Absences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
