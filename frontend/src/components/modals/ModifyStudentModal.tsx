import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import ApiService from "../../services/api";
import { DatePicker } from "../DatePicker";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: Array<{ student_id: string; name: string }>;
}

export function ModifyStudentModal({
  isOpen,
  onClose,
  onSuccess,
  students,
}: Props) {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    class_id: "",
    class_teacher: "",
    guardian_name: "",
    guardian_mob: "",
    guardian_mail: "",
    student_gender: "",
  });

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await ApiService.put(`/modify_student/${selectedStudent.id}`, formData);

      // Update caches
      // 1. Update all students cache
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        const data = JSON.parse(cachedStudents);
        data.data.Students = data.data.Students.map((student: any) =>
          student.student_id === selectedStudent.id
            ? { ...student, ...formData }
            : student
        );
        localStorage.setItem(
          "cache_GET_/get_all_students",
          JSON.stringify(data)
        );
      }

      // 2. Update individual student profile cache
      localStorage.setItem(
        `cache_GET_/get_students_profile/${selectedStudent.id}`,
        JSON.stringify({
          data: {
            student_id: selectedStudent.id,
            ...formData,
          },
        })
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error modifying student:", error);
    }
  };

  const loadStudentDetails = async (studentId: string) => {
    try {
      // Try to get from all students cache first
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        const data = JSON.parse(cachedStudents);
        const student = data.data.Students.find(
          (s: any) => s.student_id === studentId
        );
        if (student) {
          setFormData(student);
          return;
        }
      }

      // Fallback to individual profile
      const response = await ApiService.get(
        `/get_students_profile/${studentId}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error loading student details:", error);
    }
  };

  const handleStudentSelect = async (
    studentId: string,
    studentName: string
  ) => {
    setSelectedStudent({ id: studentId, name: studentName });
    await loadStudentDetails(studentId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            {selectedStudent && (
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {selectedStudent
                ? t("admin.modals.modify.title")
                : t("admin.modals.select.student")}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedStudent ? (
          <form onSubmit={handleModify} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.dob")}
              </label>
              <DatePicker
                value={formData.dob ? new Date(formData.dob) : new Date()}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dob: format(date, "yyyy-MM-dd"),
                  }))
                }
                maxDate={new Date()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.class")}
              </label>
              <input
                type="text"
                value={formData.class_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, class_id: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.class_teacher")}
              </label>
              <input
                type="text"
                value={formData.class_teacher}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    class_teacher: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.guardian_name")}
              </label>
              <input
                type="text"
                value={formData.guardian_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guardian_name: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.guardian_mob")}
              </label>
              <input
                type="tel"
                value={formData.guardian_mob}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guardian_mob: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.guardian_mail")}
              </label>
              <input
                type="email"
                value={formData.guardian_mail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guardian_mail: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.student.gender")}
              </label>
              <select
                value={formData.student_gender}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    student_gender: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">{t("admin.modals.select.gender")}</option>
                <option value="Male">
                  {t("admin.modals.student.gender_male")}
                </option>
                <option value="Female">
                  {t("admin.modals.student.gender_female")}
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {t("form.cancel")}
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
              >
                {t("form.save")}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.student_id}
                  onClick={() =>
                    handleStudentSelect(student.student_id, student.name)
                  }
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                >
                  {student.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
