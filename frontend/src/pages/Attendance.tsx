import { useState, useEffect } from "react";
import ApiService from "../services/api";
import { AttendanceResponse, AttendanceEntry } from "../types";
import { useAppStore } from "../store/index";
import { Edit2, Save } from "lucide-react";
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
  const user = useAppStore((state) => state.user);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedDates, setModifiedDates] = useState<
    Map<string, "P" | "A" | null>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  useEffect(() => {
    const studentId =
      user?.role === "teacher"
        ? new URLSearchParams(window.location.search).get("student_id")
        : localStorage.getItem("student_id");

    if (studentId) {
      setCurrentStudentId(studentId);
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentStudentId) return;

      setIsLoading(true);
      try {
        const response = await ApiService.get<AttendanceResponse>(
          `/get_student_attendance/${currentStudentId}`
        );
        setAttendanceData(response.Attendance || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendanceData([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    const handleCacheHit = (event: CustomEvent<{ key: string; data: any }>) => {
      if (
        event.detail.key === `GET_/get_student_attendance/${currentStudentId}`
      ) {
        setAttendanceData(event.detail.data.Attendance || []); // Handle potentially missing data
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
  }, [currentStudentId]);

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

  const handleDateClick = (date: Date) => {
    if (!isEditing || isWeekend(date) || !isSameMonth(date, currentDate))
      return;

    const dateStr = format(date, "yyyy-MM-dd");
    const currentValue =
      modifiedDates.get(dateStr) ||
      getAttendanceForDate(date)?.attendance_remarks ||
      null;

    let newValue: "P" | "A" | null;
    if (currentValue === null) newValue = "P";
    else if (currentValue === "P") newValue = "A";
    else newValue = null;

    setModifiedDates(new Map(modifiedDates.set(dateStr, newValue)));
  };

  const handleSave = async () => {
    if (modifiedDates.size === 0 || !currentStudentId) return;
    setIsSaving(true);

    try {
      for (const [date, status] of modifiedDates.entries()) {
        if (status === null) continue;

        await ApiService.post("/add_attendance", {
          student_id: currentStudentId,
          attendance_date: date,
          attendance_status: status,
        });
      }

      const cachedData = localStorage.getItem(
        `cache_GET_/get_student_attendance/${currentStudentId}`
      );

      let updatedAttendance = [...attendanceData];

      updatedAttendance = updatedAttendance.filter(
        (entry) => !modifiedDates.has(entry.attendance_date)
      );

      modifiedDates.forEach((status, date) => {
        if (status) {
          updatedAttendance.push({
            attendance_id: `temp_${date}`,
            student_id: currentStudentId!,
            attendance_date: date,
            attendance_remarks: status,
          });
        }
      });

      setAttendanceData(updatedAttendance);

      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        localStorage.setItem(
          `cache_GET_/get_student_attendance/${currentStudentId}`,
          JSON.stringify({
            ...parsedCache,
            Attendance: updatedAttendance,
          })
        );
      }

      setModifiedDates(new Map());
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAttendanceColor = (date: Date) => {
    if (isWeekend(date)) return "bg-gray-100 text-gray-400";

    const dateStr = format(date, "yyyy-MM-dd");
    const modifiedStatus = modifiedDates.get(dateStr);

    if (modifiedStatus !== undefined) {
      return modifiedStatus === "P"
        ? "bg-green-300 text-green-800 font-bold"
        : modifiedStatus === "A"
        ? "bg-red-200 text-red-800 font-bold"
        : "bg-white";
    }

    const attendance = getAttendanceForDate(date);
    if (!attendance) return "bg-white";

    return attendance.attendance_remarks === "P"
      ? "bg-green-300 text-green-800 font-bold"
      : "bg-red-200 text-red-800 font-bold";
  };

  const calculateSummary = () => {
    if (!attendanceData.length) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        presentRate: 0,
        absentRate: 0,
      };
    }

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
      <div className="max-w-7xl mx-auto h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Calendar
          </h1>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div className="max-w-7xl mx-auto h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Calendar
        </h1>
        {user?.role === "teacher" && (
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-gray-400"
          >
            {isEditing ? (
              <>
                <Save className="h-5 w-5" />
                {isSaving ? "Saving..." : "Save"}
              </>
            ) : (
              <>
                <Edit2 className="h-5 w-5" />
                Edit
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex gap-4 h-[calc(100vh-120px)] scale-90">
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
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm
                  ${getAttendanceColor(day)}
                  ${!isSameMonth(day, currentDate) ? "opacity-25" : ""}
                  ${
                    isEditing &&
                    !isWeekend(day) &&
                    isSameMonth(day, currentDate)
                      ? "cursor-pointer hover:opacity-75"
                      : ""
                  }
                `}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>

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
