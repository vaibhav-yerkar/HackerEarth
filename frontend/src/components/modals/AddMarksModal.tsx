import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import ApiService from "../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: Array<{ student_id: string; name: string }>;
}

export function AddMarksModal({ isOpen, onClose, onSuccess, students }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    subject: "Math",
    marks: "",
    test_date: "",
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
              {selectedStudent ? "Add Marks" : "Select Student"}
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
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full border rounded-lg p-2"
                required
              >
                {["Math", "Science", "English", "History"].map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks
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
                Test Date
              </label>
              <input
                type="date"
                value={formData.test_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    test_date: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Type
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
                {["Midterm", "Final"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
            >
              Add Marks
            </button>
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
