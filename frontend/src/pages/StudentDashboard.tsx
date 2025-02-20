import { useState, useMemo, useEffect } from "react";
import ApiService from "../services/api";
import {
  StudentScore,
  AttendanceResponse,
  AttendanceSummary,
  AttendanceEntry,
  ScoreResponse,
  StudentProfile,
} from "../types";
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
  const [highlightedSubject, setHighlightedSubject] = useState<string | null>(
    null
  );
  const [performanceData, setPerformanceData] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummary | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );

  // Transform API response data into the format needed for the chart
  const transformScoreData = (
    scores: {
      test_date: string;
      test_type: string;
      subject: string;
      marks: number;
    }[]
  ): StudentScore[] => {
    // Group scores by date and test type
    const groupedScores = scores.reduce((acc, score) => {
      const key = `${score.test_date}_${score.test_type}`;
      if (!acc[key]) {
        acc[key] = {
          date: score.test_date,
          testType: score.test_type,
          Math: null,
          Science: null,
          English: null,
          History: null,
        };
      }
      // Map subject names to their respective fields
      acc[key][score.subject as keyof (typeof acc)[typeof key]] = score.marks;
      return acc;
    }, {} as { [key: string]: StudentScore });

    // Convert the grouped data into an array and sort by date
    return Object.values(groupedScores).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const calculateAttendanceSummary = (
    attendance: AttendanceEntry[]
  ): AttendanceSummary => {
    const totalDays = attendance.length;
    const presentDays = attendance.filter(
      (entry) => entry.attendance_remarks === "P"
    ).length;
    const absentDays = totalDays - presentDays;
    const presentRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      presentRate: Math.round(presentRate),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
        if (!studentId) {
          throw new Error("Student ID not found");
        }

        // Even if one fetch fails, continue with the other
        const [scoresResponse, attendanceResponse] = await Promise.allSettled([
          ApiService.get<ScoreResponse>(`/get_student_score/${studentId}`),
          ApiService.get<AttendanceResponse>(
            `/get_student_attendance/${studentId}`
          ),
        ]);

        if (scoresResponse.status === "fulfilled") {
          const formattedData = transformScoreData(scoresResponse.value.Scores);
          setPerformanceData(formattedData);
        }

        if (attendanceResponse.status === "fulfilled") {
          const summary = calculateAttendanceSummary(
            attendanceResponse.value.Attendance
          );
          setAttendanceSummary(summary);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for cache hits
    const handleCacheHit = (event: CustomEvent<{ key: string; data: any }>) => {
      if (event.detail.key.startsWith("GET_/get_student_score/")) {
        const formattedData = transformScoreData(event.detail.data.Scores);
        setPerformanceData(formattedData);
      } else if (event.detail.key.startsWith("GET_/get_student_attendance/")) {
        const summary = calculateAttendanceSummary(
          event.detail.data.Attendance
        );
        setAttendanceSummary(summary);
      }
      setIsLoading(false);
    };

    window.addEventListener("api-cache-hit", handleCacheHit as EventListener);
    fetchData();

    return () => {
      window.removeEventListener(
        "api-cache-hit",
        handleCacheHit as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const fetchStudentProfile = () => {
      const cachedProfile = localStorage.getItem(
        "cache_GET_/get_students_profile"
      );
      if (cachedProfile) {
        const profileData = JSON.parse(cachedProfile);
        setStudentProfile(profileData.data);
      }
    };

    fetchStudentProfile();
  }, []);

  const yAxisDomain = useMemo(() => {
    const allMarks = performanceData.flatMap((entry) =>
      Object.entries(entry)
        .filter(
          ([key, value]) =>
            ["Mathematics", "Science", "English", "History"].includes(key) &&
            value !== null
        )
        .map(([_, value]) => value as number)
    );

    const minMark = Math.min(...allMarks);
    const maxMark = Math.max(...allMarks);
    return [Math.max(0, minMark - 10), Math.min(100, maxMark + 5)];
  }, [performanceData]);

  const subjects = ["Math", "Science", "English", "History"] as const;
  const subjectColors = {
    Math: "#818cf8", // indigo-400 hex
    Science: "#22c55e",
    English: "#f59e0b",
    History: "#ec4899",
  } as const;

  const currentAverage = useMemo(() => {
    if (!performanceData.length) return null;

    const lastEntry = performanceData[performanceData.length - 1];
    if (!lastEntry) return null;

    const validMarks = subjects
      .map((subject) => lastEntry[subject])
      .filter((mark): mark is number => mark !== null && mark !== undefined);

    return validMarks.length > 0
      ? Math.round(validMarks.reduce((a, b) => a + b, 0) / validMarks.length)
      : null;
  }, [performanceData]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <h2 className="text-xl font-semibold ml-2">Academic Progress</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {currentAverage ? `${currentAverage}%` : "N/A"}
            </p>
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
            <p className="text-3xl font-bold text-gray-900">
              {attendanceSummary ? `${attendanceSummary.presentRate}%` : "N/A"}
            </p>
            <p className="text-sm text-gray-600">Present Days</p>
            {attendanceSummary && (
              <p className="text-xs text-gray-500 mt-1">
                {attendanceSummary.presentDays} out of{" "}
                {attendanceSummary.totalDays} days
              </p>
            )}
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-semibold ml-2">Upcoming</h2>
            </div>
            <p className="text-lg font-medium text-gray-900">3 Assessments</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Subject Performance Trends
            </h2>
            <div className="flex gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() =>
                    setHighlightedSubject(
                      highlightedSubject === subject ? null : subject
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    highlightedSubject === subject
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
          {performanceData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={yAxisDomain} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      value
                        ? `${value}%, ${props.payload.testType}`
                        : "No data",
                      name,
                    ]}
                  />
                  <Legend />
                  {subjects.map((subject) => (
                    <Line
                      key={subject}
                      type="monotone"
                      dataKey={subject}
                      connectNulls={true} // Skip null values in line
                      {...getLineStyle(subject)}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No performance data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Remarks
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-400 pl-4">
              <p className="text-gray-600">
                {studentProfile?.Remark || "No remarks"}
              </p>
              {studentProfile?.Remark && (
                <>
                  <p className="text-sm text-gray-500">
                    {studentProfile.class_teacher} - Class Teacher
                  </p>
                  <p className="text-xs text-gray-400">Latest Remark</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
