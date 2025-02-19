import { useState, useEffect } from "react";
import {
  Users,
  Calendar as CalendarIcon,
  UserPlus,
  UserMinus,
  UserCog,
  GraduationCap,
  CalendarPlus,
} from "lucide-react";
import ApiService from "../services/api";
import { ScoreResponse, StudentListResponse } from "../types";

interface StudentScore {
  student_id: string;
  name: string;
  average: number;
  scores: {
    [subject: string]: number;
  };
}

function AdminPanel() {
  const [studentCount, setStudentCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>("average");
  const [leaderboard, setLeaderboard] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const subjects = ["Math", "Science", "English", "History", "average"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cachedStudents = localStorage.getItem(
          "cache_GET_/get_all_students"
        );
        if (!cachedStudents) {
          console.error("No cached students data found");
          return;
        }

        const studentsData = JSON.parse(cachedStudents);
        const students = studentsData.data.Students || [];
        setStudentCount(students.length);

        const studentsScores: StudentScore[] = await Promise.all(
          students.map(async (student: any) => {
            const cacheKey = `cache_GET_/get_student_score/${student.student_id}`;
            let scoreData;

            try {
              // Try to get from cache first
              const cachedScores = localStorage.getItem(cacheKey);
              if (cachedScores) {
                scoreData = JSON.parse(cachedScores);
                scoreData = scoreData.data;
              } else {
                // If not in cache, fetch from API
                scoreData = await ApiService.get<ScoreResponse>(
                  `/get_student_score/${student.student_id}`
                );
                scoreData = scoreData.data;
              }

              // Ensure we have valid score data
              if (!scoreData?.Scores || !Array.isArray(scoreData.Scores)) {
                console.error(
                  `Invalid score data for student ${student.student_id}`
                );
                return null;
              }

              // Process scores by subject
              const subjectScores: { [key: string]: number[] } = {};
              scoreData.Scores.forEach((score: any) => {
                if (!score.subject || typeof score.marks !== "number") return;

                if (!subjectScores[score.subject]) {
                  subjectScores[score.subject] = [];
                }
                subjectScores[score.subject].push(score.marks);
              });

              // Calculate averages per subject
              const averageScores: { [key: string]: number } = {};
              Object.entries(subjectScores).forEach(([subject, marks]) => {
                if (marks.length > 0) {
                  averageScores[subject] =
                    marks.reduce((a, b) => a + b, 0) / marks.length;
                }
              });

              // Calculate overall average
              const subjectAverages = Object.values(averageScores);
              const overallAverage =
                subjectAverages.length > 0
                  ? subjectAverages.reduce((a, b) => a + b, 0) /
                    subjectAverages.length
                  : 0;

              return {
                student_id: student.student_id,
                name: student.name,
                average: overallAverage,
                scores: averageScores,
              };
            } catch (error) {
              console.error(
                `Error processing student ${student.student_id}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out null values and sort
        const validScores = studentsScores.filter(
          (score): score is StudentScore => score !== null
        );
        const sortedScores = validScores.sort((a, b) => {
          if (selectedSubject === "average") {
            return b.average - a.average;
          }
          return (
            (b.scores[selectedSubject] || 0) - (a.scores[selectedSubject] || 0)
          );
        });

        setLeaderboard(sortedScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">Students</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{studentCount}</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">Events</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-600">This Month</p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-indigo-50 rounded-lg text-left hover:bg-indigo-100 transition-colors group">
            <div className="mr-4">
              <UserPlus className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">Add Student</h3>
              <p className="text-sm text-indigo-600">Register new student</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors group">
            <div className="mr-4">
              <UserMinus className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Delete Student</h3>
              <p className="text-sm text-red-600">Remove student record</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors group">
            <div className="mr-4">
              <UserCog className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Modify Details</h3>
              <p className="text-sm text-purple-600">
                Update student information
              </p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors group">
            <div className="mr-4">
              <GraduationCap className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Add Marks</h3>
              <p className="text-sm text-green-600">Enter assessment scores</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors group">
            <div className="mr-4">
              <CalendarPlus className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Create Event</h3>
              <p className="text-sm text-blue-600">Schedule new event</p>
            </div>
          </button>
        </div>
      </div>

      {/* Student Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Student Leaderboard
          </h2>
          <div className="flex gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedSubject === subject
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {leaderboard.map((student, index) => (
            <div
              key={student.student_id}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">
                #{index + 1}
              </div>
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">
                  Score:{" "}
                  {selectedSubject === "average"
                    ? student.average.toFixed(2)
                    : (student.scores[selectedSubject] || 0).toFixed(2)}
                  %
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
