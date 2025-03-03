import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns"; // Add this import
import ApiService from "../../services/api";
import { useAppStore } from "../../store/index";
import { DatePicker } from "../DatePicker";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: Props) {
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Add this line
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    class_id: "",
    class_teacher: user?.name || "",
    guardian_name: "",
    guardian_mob: "",
    guardian_mail: "",
    student_gender: "Male",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    try {
      const response = await ApiService.post("/add_student", formData);

      // Update cache
      const cachedStudents = localStorage.getItem(
        "cache_GET_/get_all_students"
      );
      if (cachedStudents) {
        const data = JSON.parse(cachedStudents);
        data.data.Students.push({
          student_id: response.student_id,
          ...formData,
        });
        localStorage.setItem(
          "cache_GET_/get_all_students",
          JSON.stringify(data)
        );
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {t("admin.modals.add.title")}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              maxDate={new Date()} // Can't select future dates
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
              readOnly
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
              pattern="[0-9]{10}"
              value={formData.guardian_mob}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  guardian_mob: e.target.value,
                }))
              }
              className="w-full border rounded-lg p-2"
              required
              placeholder="10-digit mobile number"
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
              <option value="Male">
                {t("admin.modals.student.gender_male")}
              </option>
              <option value="Female">
                {t("admin.modals.student.gender_female")}
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            {isLoading ? t("form.creating") : t("form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
