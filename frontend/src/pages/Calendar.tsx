import { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX, // Changed from Volume2Off to VolumeXff,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isPast,
  isFuture,
} from "date-fns";
import ApiService from "../services/api";
import { EventResponse } from "../types";
import { useAppStore } from "../store/index";
import { AudioCache } from "../services/audioCache";
import { useTranslation } from "react-i18next";

interface Event {
  id: string;
  title: string;
  event_desc: string;
  date: string;
  time: string;
}

const audioBaseUrl = import.meta.env.VITE_API_BASE_URL + "/generate_audio";

function Calendar() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const userLanguage = useAppStore((state) => state.language);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.get<EventResponse>("/get_events");
        setEvents(response.Events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Handle cache hits
    const handleCacheHit = (event: CustomEvent<{ key: string; data: any }>) => {
      if (event.detail.key === "GET_/get_events") {
        setEvents(event.detail.data.Events || []);
        setIsLoading(false);
      }
    };

    window.addEventListener("api-cache-hit", handleCacheHit as EventListener);
    fetchEvents();

    return () => {
      window.removeEventListener(
        "api-cache-hit",
        handleCacheHit as EventListener
      );
    };
  }, []);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const getEventIndicatorStyle = (date: Date) => {
    const eventsForDate = getEventsForDate(date);
    if (!eventsForDate.length) return "";

    const now = new Date();
    const isPastEvent = eventsForDate.every((event) =>
      isPast(new Date(event.date))
    );
    const isFutureEvent = eventsForDate.every((event) =>
      isFuture(new Date(event.date))
    );

    if (isPastEvent) {
      return "after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-1 after:bg-red-500 after:rounded-lg";
    }
    if (isFutureEvent) {
      return "after:absolute after:rounded-lg after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-1 after:bg-blue-500";
    }
    return "after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-1 after:bg-yellow-500";
  };

  const handlePlayAudio = async (event: Event) => {
    try {
      const cacheKey = `audio_${event.id}_${userLanguage}`;
      let audioUrl = await AudioCache.getAudioUrl(cacheKey);

      if (!audioUrl) {
        // Format date for audio text
        const eventDate = new Date(event.date);
        const formattedDate = format(eventDate, "d MMMM yyyy");

        const response = await fetch(
          `${audioBaseUrl}?text=${encodeURIComponent(
            `${event.event_desc} on ${formattedDate}`
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

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create new audio instance
      const audio = new Audio();

      // Set up event handlers before setting source
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

      // Load and play audio
      try {
        audio.src = audioUrl;
        await audio.load(); // Explicitly load the audio
        audioRef.current = audio;
        await audio.play();
        setPlayingAudioId(event.id);
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

  // Clean up audio resources on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        <span>{t("loading")}</span>
      </div>
    );
  }

  // Add unique weekday identifiers
  const weekDays = [
    { key: "sun", label: "S" },
    { key: "mon", label: "M" },
    { key: "tue", label: "T" },
    { key: "wed", label: "W" },
    { key: "thu", label: "T" },
    { key: "fri", label: "F" },
    { key: "sat", label: "S" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("calendar.title")}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(({ key, label }) => (
                <div
                  key={key}
                  className="text-center font-semibold text-gray-600 text-xs"
                >
                  {label}
                </div>
              ))}
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    w-8 h-8 text-xs flex flex-col items-center justify-center relative rounded-full
                    ${
                      !isSameMonth(day, currentMonth)
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-900"
                    }
                    ${
                      isSameDay(day, selectedDate)
                        ? "bg-indigo-100"
                        : "hover:bg-gray-100"
                    }
                    ${getEventIndicatorStyle(day)}
                  `}
                  disabled={!isSameMonth(day, currentMonth)} // Disable dates outside current month
                >
                  {format(day, "d")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
              {t("calendar.events.for", {
                date: format(selectedDate, "MMMM d, yyyy"),
              })}
            </h2>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-indigo-400 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {event.event_desc}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(
                              new Date(`${event.date} ${event.time}`),
                              "MMM dd, yyyy hh:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(event)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label={
                          playingAudioId === event.id
                            ? "Stop audio"
                            : "Play audio"
                        }
                      >
                        {playingAudioId === event.id ? (
                          <Volume2 className="h-5 w-5 text-indigo-600 animate-pulse" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-gray-500" /> // Changed from Volume2Off to VolumeX
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  {t("calendar.no.events")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
