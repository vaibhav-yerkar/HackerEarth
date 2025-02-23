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

export function AddMarksModal({ isOpen, onClose, onSuccess, students }: Props) {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    subject: "Math",
    marks: "",
    test_date: format(new Date(), "yyyy-MM-dd"),
    test_type: "Midterm",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await ApiService.post("/add_score", {
        student_id: selectedStudent.id,
        ...formData,
        marks: parseInt(formData.marks),
      });

      // Clear cache to force refresh
      localStorage.removeItem(
        `cache_GET_/get_student_score/${selectedStudent.id}`
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding marks:", error);
    }
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
                ? t("admin.modals.marks.title")
                : t("admin.modals.select.student")}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedStudent ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.select.subject")}
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">{t("admin.modals.select.subject")}</option>
                {["Math", "Science", "English", "History"].map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.enter.marks")}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.marks}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, marks: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.enter.test_date")}
              </label>
              <DatePicker
                value={new Date(formData.test_date)}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    test_date: format(date, "yyyy-MM-dd"),
                  }))
                }
                maxDate={new Date()} // Can't select future dates
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.modals.select.test_type")}
              </label>
              <select
                value={formData.test_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    test_type: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">{t("admin.modals.select.test_type")}</option>
                {["Midterm", "Final"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
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
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                {t("form.submit")}
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
                    setSelectedStudent({
                      id: student.student_id,
                      name: student.name,
                    })
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
