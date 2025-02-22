import { useState } from "react";
import { X, Trash2, AlertCircle } from "lucide-react";
import ApiService from "../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: Array<{ student_id: string; name: string }>;
}

export function DeleteStudentModal({
  isOpen,
  onClose,
  onSuccess,
  students,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      await ApiService.delete(`/delete_student/${selectedStudent.id}`);

      // Clear related caches
      localStorage.removeItem(
        `cache_GET_/get_student_score/${selectedStudent.id}`
      );
      localStorage.removeItem(
        `cache_GET_/get_student_attendance/${selectedStudent.id}`
      );
      localStorage.removeItem(
        `cache_GET_/get_students_profile/${selectedStudent.id}`
      );

      // Update all students cache
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        const data = JSON.parse(cachedStudents);
        data.data.Students = data.data.Students.filter(
          (s: any) => s.student_id !== selectedStudent.id
        );
        localStorage.setItem(
          "cache_GET_/get_all_students",
          JSON.stringify(data)
        );
      }

      onSuccess();
      setConfirmDelete(null);
      onClose();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Delete Student</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmDelete ? (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div>
                <h3 className="font-semibold text-lg">Confirm Deletion</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete {selectedStudent?.name}?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.student_id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{student.name}</span>
                  <button
                    onClick={() => {
                      setSelectedStudent({
                        id: student.student_id,
                        name: student.name,
                      });
                      setConfirmDelete(student.student_id);
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
