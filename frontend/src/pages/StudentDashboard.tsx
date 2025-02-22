import { useState, useMemo, useEffect, useRef } from "react";
import ApiService from "../services/api";
import { AudioCache } from "../services/audioCache";
import {
  StudentScore,
  AttendanceResponse,
  AttendanceSummary,
  AttendanceEntry,
  ScoreResponse,
  StudentProfile,
  StudentListResponse,
  EventResponse,
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
import {
  Calendar,
  GraduationCap,
  UserCheck,
  Edit2,
  Save,
  ChevronLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/index";

const audioBaseUrl = import.meta.env.VITE_API_BASE_URL + "/generate_audio";

function StudentDashboard() {
  const user = useAppStore((state) => state.user);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [studentsList, setStudentsList] = useState<
    StudentListResponse["students"]
  >([]);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [newRemark, setNewRemark] = useState("");
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
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userLanguage = useAppStore((state) => state.language);
  const [eventCount, setEventCount] = useState(0);

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
    if (user?.role === "teacher") {
      setIsLoadingStudents(true);
      // Load students list from cache or fetch
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        try {
          const studentsData = JSON.parse(cachedStudents);
          setStudentsList(studentsData.data.Students || []);
        } catch (error) {
          console.error("Error parsing cached students data:", error);
          setStudentsList([]);
        }
      } else {
        // Optionally fetch from API if not in cache
        ApiService.get<StudentListResponse>("/get_all_students")
          .then((response) => {
            setStudentsList(response.Students || []);
          })
          .catch((error) => {
            console.error("Error fetching students:", error);
            setStudentsList([]);
          });
      }
      setIsLoadingStudents(false);
    } else {
      setSelectedStudentId(localStorage.getItem("student_id"));
    }
  }, [user?.role]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStudentId) return;

      setIsLoading(true);
      try {
        const [scoresResponse, attendanceResponse] = await Promise.allSettled([
          ApiService.get<ScoreResponse>(
            `/get_student_score/${selectedStudentId}`
          ),
          ApiService.get<AttendanceResponse>(
            `/get_student_attendance/${selectedStudentId}`
          ),
        ]);

        if (
          scoresResponse.status === "fulfilled" &&
          scoresResponse.value?.Scores
        ) {
          const formattedData = transformScoreData(scoresResponse.value.Scores);
          setPerformanceData(formattedData);
        } else {
          console.error("Failed to fetch scores or scores data is missing");
          setPerformanceData([]);
        }

        if (
          attendanceResponse.status === "fulfilled" &&
          attendanceResponse.value?.Attendance
        ) {
          const summary = calculateAttendanceSummary(
            attendanceResponse.value.Attendance
          );
          setAttendanceSummary(summary);
        } else {
          console.error(
            "Failed to fetch attendance or attendance data is missing"
          );
          setAttendanceSummary(null);
        }

        // Handle events data
        const cachedEvents = localStorage.getItem("cache_GET_/get_events");
        let eventsData;

        if (cachedEvents) {
          eventsData = JSON.parse(cachedEvents);
          const upcomingEvents = eventsData.data.Events.filter(
            (event: any) => new Date(event.date) >= new Date()
          );
          setEventCount(upcomingEvents.length || 0);
        } else {
          const response = await ApiService.get<EventResponse>("/get_events");
          const upcomingEvents = response.Events.filter(
            (event) => new Date(event.date) >= new Date()
          );
          setEventCount(upcomingEvents.length || 0);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setPerformanceData([]);
        setAttendanceSummary(null);
        setEventCount(0);
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
  }, [selectedStudentId]);

  useEffect(() => {
    const fetchStudentProfile = () => {
      if (!selectedStudentId) return;

      // Get profile from get_all_students cache
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        try {
          const studentsData = JSON.parse(cachedStudents);
          const selectedStudent = studentsData.data.Students.find(
            (student: any) => student.student_id === selectedStudentId
          );

          if (selectedStudent) {
            setStudentProfile({
              ...selectedStudent,
              Remark: selectedStudent.Remark || null,
              // Add any other required fields with default values if needed
              dob: selectedStudent.dob || "",
              class_id: selectedStudent.class_id || "",
              class_teacher: selectedStudent.class_teacher || "",
              guardian_name: selectedStudent.guardian_name || "",
              guardian_mob: selectedStudent.guardian_mob || "",
              guardian_mail: selectedStudent.guardian_mail || "",
              student_gender: selectedStudent.student_gender || "",
            });
            return; // Exit if we found the student in cache
          }
        } catch (error) {
          console.error("Error parsing cached students data:", error);
        }
      }

      // Fallback to profile API only if cache miss or error
      const cachedProfile = localStorage.getItem(
        `cache_GET_/get_students_profile/${selectedStudentId}`
      );
      if (cachedProfile) {
        try {
          const profileData = JSON.parse(cachedProfile);
          setStudentProfile(profileData.data);
        } catch (error) {
          console.error("Error parsing cached profile:", error);
        }
      }
    };

    fetchStudentProfile();
  }, [selectedStudentId]);

  const handleRemarkSubmit = async () => {
    if (!selectedStudentId || !newRemark) return;

    try {
      await ApiService.put(
        `/modify_remark/${selectedStudentId}?remark=${encodeURIComponent(
          newRemark
        )}`
      );

      // Update individual profile cache
      const updatedProfile = {
        ...studentProfile!,
        Remark: newRemark,
      };
      setStudentProfile(updatedProfile);
      localStorage.setItem(
        `cache_GET_/get_students_profile/${selectedStudentId}`,
        JSON.stringify({ data: updatedProfile })
      );

      // Update all students cache
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        const studentsData = JSON.parse(cachedStudents);
        const updatedStudents = {
          ...studentsData,
          data: {
            ...studentsData.data,
            Students: studentsData.data.Students.map((student: any) =>
              student.student_id === selectedStudentId
                ? { ...student, Remark: newRemark }
                : student
            ),
          },
        };
        localStorage.setItem(
          "cache_GET_/get_all_students",
          JSON.stringify(updatedStudents)
        );
      }

      setIsEditingRemark(false);
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handlePlayRemark = async () => {
    if (!studentProfile?.Remark) return;

    try {
      const cacheKey = `remark_${studentProfile.student_id}_${userLanguage}`;
      let audioUrl = await AudioCache.getAudioUrl(cacheKey);

      if (!audioUrl) {
        const response = await fetch(
          `${audioBaseUrl}?text=${encodeURIComponent(
            studentProfile.Remark
          )}&lang=${userLanguage}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch audio");
        }

        const audioBlob = await response.blob();
        if (!audioBlob.type.startsWith("audio/")) {
          throw new Error("Invalid audio format received");
        }
        audioUrl = AudioCache.setAudioCache(cacheKey, audioBlob);
      }

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio();

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingAudioId(null);
      };

      audio.onended = () => {
        setPlayingAudioId(null);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };

      try {
        audio.src = audioUrl;
        await audio.load();
        audioRef.current = audio;
        await audio.play();
        setPlayingAudioId("remark");
      } catch (playError) {
        console.error("Playback failed:", playError);
        setPlayingAudioId(null);
        audioRef.current = null;
      }
    } catch (error) {
      console.error("Audio processing error:", error);
      setPlayingAudioId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
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

  if (user?.role === "teacher" && !selectedStudentId) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Select a Student
        </h1>
        {isLoadingStudents ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
          </div>
        ) : studentsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentsList.map((student) => (
              <button
                key={student.student_id}
                onClick={() => setSelectedStudentId(student.student_id)}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
              >
                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-500">
                  ID: {student.student_id}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No students found
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  const remarksSection = (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Remarks</h2>
        {user?.role === "teacher" && (
          <button
            onClick={() => {
              if (isEditingRemark) {
                handleRemarkSubmit();
              } else {
                setNewRemark(studentProfile?.Remark || "");
                setIsEditingRemark(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
          >
            {isEditingRemark ? (
              <>
                <Save size={16} /> Save
              </>
            ) : (
              <>
                <Edit2 size={16} /> Edit
              </>
            )}
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div className="border-l-4 border-indigo-400 pl-4">
          <div className="flex justify-between items-start">
            <div>
              {isEditingRemark ? (
                <textarea
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
              ) : (
                <>
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
                </>
              )}
            </div>
            {!isEditingRemark && studentProfile?.Remark && (
              <button
                onClick={handlePlayRemark}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={
                  playingAudioId === "remark" ? "Stop audio" : "Play audio"
                }
              >
                {playingAudioId === "remark" ? (
                  <Volume2 className="h-5 w-5 text-indigo-600 animate-pulse" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-500" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {user?.role === "teacher" && selectedStudentId && (
            <button
              onClick={() => setSelectedStudentId(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
        </div>

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
            to={`/attendance${
              selectedStudentId ? `?student_id=${selectedStudentId}` : ""
            }`}
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
            <p className="text-lg font-medium text-gray-900">
              {eventCount} {eventCount === 1 ? "Event" : "Events"}
            </p>
            <p className="text-sm text-gray-600">Total Events</p>
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
        {remarksSection}
      </div>
    </>
  );
}

export default StudentDashboard;
