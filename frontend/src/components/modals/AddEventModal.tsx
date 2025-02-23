import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import ApiService from "../../services/api";
import { DatePicker } from "../DatePicker";
import { TimePicker } from "../TimePicker";
import { useTranslation } from "react-i18next";

// Add EmailJS types
declare global {
  interface Window {
    emailjs: any;
  }
}

// Add environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const EMAILJS_KEY = import.meta.env.VITE_EMAILJS_KEY;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEventModal({ isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    event_desc: "",
    date: new Date(),
    time: "09:00:00", // Updated default time with seconds
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [isEmailJSReady, setIsEmailJSReady] = useState(false);

  useEffect(() => {
    // Check if EmailJS is already loaded
    if (window.emailjs) {
      window.emailjs.init(EMAILJS_KEY);
      setIsEmailJSReady(true);
      return;
    }

    // If not loaded, create and load the script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      window.emailjs.init(EMAILJS_KEY);
      setIsEmailJSReady(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const sendEmailNotifications = async () => {
    if (!isEmailJSReady) {
      console.warn("EmailJS not ready yet");
      return;
    }

    try {
      // Use environment variables for API call
      const response = await fetch(SUPABASE_URL, {
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.statusText}`);
      }

      const data = await response.json();
      const parentEmails = data.map((student: any) => student.guardian_mail);

      if (parentEmails.length === 0) {
        console.warn("No parent emails found!");
        return;
      }

      // Send emails to all parents
      const emailPromises = parentEmails.map((email: string) =>
        window.emailjs.send("service_j0tfv2h", "template_11eoi5c", {
          event_title: formData.title,
          event_desc: formData.event_desc,
          event_date: format(formData.date, "MMMM dd, yyyy"),
          event_time: formData.time,
          to_email: email,
        })
      );

      await Promise.all(emailPromises);
      console.log("All email notifications sent successfully");
    } catch (error) {
      console.error("Error sending email notifications:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSendingEmails(true);

    try {
      // Create event
      await ApiService.post("/add_event", {
        title: formData.title,
        event_desc: formData.event_desc,
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,
      });

      // Send email notifications
      await sendEmailNotifications();

      // Clear cache and close modal
      localStorage.removeItem("cache_GET_/get_events");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
      setIsSendingEmails(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("form.title")}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.title")}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.description")}
            </label>
            <textarea
              value={formData.event_desc}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, event_desc: e.target.value }))
              }
              className="w-full border rounded-lg p-2"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.date")}
            </label>
            <DatePicker
              value={formData.date}
              onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
              minDate={new Date()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.time")}
            </label>
            <TimePicker
              value={formData.time}
              onChange={(time) => setFormData((prev) => ({ ...prev, time }))}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isSendingEmails}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:bg-gray-400"
          >
            {isLoading || isSendingEmails
              ? t("form.sending")
              : t("form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
