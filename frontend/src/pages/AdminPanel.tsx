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
import { ScoreResponse, StudentListResponse, EventResponse } from "../types";
import { DeleteStudentModal } from "../components/modals/DeleteStudentModal";
import { AddMarksModal } from "../components/modals/AddMarksModal";
import { AddStudentModal } from "../components/modals/AddStudentModal";
import { ModifyStudentModal } from "../components/modals/ModifyStudentModal";
import { AddEventModal } from "../components/modals/AddEventModal";
import { useTranslation } from "react-i18next";

interface StudentScore {
  student_id: string;
  name: string;
  average: number;
  scores: {
    [subject: string]: number;
  };
}

function AdminPanel() {
  const { t } = useTranslation();
  const [studentCount, setStudentCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>("average");
  const [leaderboard, setLeaderboard] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<
    "add" | "delete" | "modify" | "marks" | "event" | null
  >(null);
  const [studentsList, setStudentsList] = useState<
    StudentListResponse["Students"]
  >([]);
  const [eventCount, setEventCount] = useState(0);

  const subjects = ["Math", "Science", "English", "History", "average"];

  const processStudentScores = (student: any, scoreData: any) => {
    try {
      // Initialize with default scores
      const defaultScores = {
        student_id: student.student_id,
        name: student.name,
        average: 0,
        scores: {
          Math: 0,
          Science: 0,
          English: 0,
          History: 0,
        },
      };

      // If no valid score data, return defaults
      if (!scoreData?.Scores || !Array.isArray(scoreData.Scores)) {
        return defaultScores;
      }

      // Process scores by subject
      const subjectScores: { [key: string]: number[] } = {};
      scoreData.Scores.forEach((score: any) => {
        if (!score?.subject || typeof score?.marks !== "number") return;

        if (!subjectScores[score.subject]) {
          subjectScores[score.subject] = [];
        }
        subjectScores[score.subject].push(score.marks);
      });

      // Calculate averages per subject with defaults
      const averageScores = {
        Math: 0,
        Science: 0,
        English: 0,
        History: 0,
      };

      Object.entries(subjectScores).forEach(([subject, marks]) => {
        if (marks.length > 0) {
          averageScores[subject as keyof typeof averageScores] =
            marks.reduce((a, b) => a + b, 0) / marks.length;
        }
      });

      // Calculate overall average from valid scores
      const validScores = Object.values(averageScores).filter(
        (score) => score > 0
      );
      const overallAverage =
        validScores.length > 0
          ? validScores.reduce((a, b) => a + b, 0) / validScores.length
          : 0;

      return {
        student_id: student.student_id,
        name: student.name,
        average: overallAverage,
        scores: averageScores,
      };
    } catch (error) {
      // Return default scores on any error
      return {
        student_id: student.student_id,
        name: student.name,
        average: 0,
        scores: {
          Math: 0,
          Science: 0,
          English: 0,
          History: 0,
        },
      };
    }
  };

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
        setStudentsList(students);
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
            } catch (error) {
              scoreData = null;
            }

            return processStudentScores(student, scoreData);
          })
        );

        // Sort scores
        const sortedScores = studentsScores.sort((a, b) => {
          if (selectedSubject === "average") {
            return b.average - a.average;
          }
          return (
            (b.scores[selectedSubject] || 0) - (a.scores[selectedSubject] || 0)
          );
        });

        setLeaderboard(sortedScores);

        // Handle events data
        const cachedEvents = localStorage.getItem("cache_GET_/get_events");
        let eventsData;

        if (cachedEvents) {
          eventsData = JSON.parse(cachedEvents);
          setEventCount(eventsData.data.Events.length || 0);
        } else {
          const response = await ApiService.get<EventResponse>("/get_events");
          setEventCount(response.Events.length || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLeaderboard([]);
        setEventCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  const handleSuccess = () => {
    // Refresh data after successful operation
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("admin.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-semibold ml-2">
              {t("admin.students")}
            </h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{studentCount}</p>
          <p className="text-sm text-gray-600">{t("admin.total.students")}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-semibold ml-2">{t("admin.events")}</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{eventCount}</p>
          <p className="text-sm text-gray-600">{t("admin.total.events")}</p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t("admin.quick.actions")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveModal("add")}
            className="flex items-center p-4 bg-indigo-50 rounded-lg text-left hover:bg-indigo-100 transition-colors group"
          >
            <div className="mr-4">
              <UserPlus className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">
                {t("admin.actions.add.student")}
              </h3>
              <p className="text-sm text-indigo-600">
                {t("admin.actions.add.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal("delete")}
            className="flex items-center p-4 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors group"
          >
            <div className="mr-4">
              <UserMinus className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">
                {t("admin.actions.delete.student")}
              </h3>
              <p className="text-sm text-red-600">
                {t("admin.actions.delete.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal("modify")}
            className="flex items-center p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors group"
          >
            <div className="mr-4">
              <UserCog className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">
                {t("admin.actions.modify.student")}
              </h3>
              <p className="text-sm text-purple-600">
                {t("admin.actions.modify.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal("marks")}
            className="flex items-center p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors group"
          >
            <div className="mr-4">
              <GraduationCap className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                {t("admin.actions.add.marks")}
              </h3>
              <p className="text-sm text-green-600">
                {t("admin.actions.marks.desc")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal("event")}
            className="flex items-center p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors group"
          >
            <div className="mr-4">
              <CalendarPlus className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                {t("admin.actions.create.event")}
              </h3>
              <p className="text-sm text-blue-600">
                {t("admin.actions.event.desc")}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleSuccess}
      />
      <DeleteStudentModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleSuccess}
        students={studentsList}
      />
      <AddMarksModal
        isOpen={activeModal === "marks"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleSuccess}
        students={studentsList}
      />
      <ModifyStudentModal
        isOpen={activeModal === "modify"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleSuccess}
        students={studentsList}
      />
      <AddEventModal
        isOpen={activeModal === "event"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleSuccess}
      />

      {/* Student Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {t("admin.leaderboard")}
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
