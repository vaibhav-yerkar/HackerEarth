import { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date(); // Always use current date

  const events = [
    {
      id: "1",
      title: "Mathematics Test",
      date: "2025-02-15",
      type: "assessment",
      description: "Chapter 5: Algebra fundamentals",
    },
    {
      id: "2",
      title: "Science Project Due",
      date: "2025-02-18",
      type: "assessment",
      description: "Environmental Impact Study",
    },
    {
      id: "3",
      title: "Parent-Teacher Meeting",
      date: "2025-02-20",
      type: "event",
      description: "Quarterly progress discussion",
    },
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasEventOnDate = (date: Date) => {
    return events.some((event) => isSameDay(new Date(event.date), date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Academic Calendar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-3">
            {/* Simplified header without navigation */}
            <div className="text-center mb-2">
              <h2 className="text-sm font-semibold text-gray-900">
                {format(currentDate, "MMMM yyyy")}
              </h2>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 text-xs"
                >
                  {day}
                </div>
              ))}
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    w-8 h-8 text-xs flex flex-col items-center justify-center relative rounded-full
                    ${
                      !isSameMonth(day, currentDate)
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-900"
                    }
                    ${
                      isSameDay(day, selectedDate)
                        ? "bg-indigo-100"
                        : "hover:bg-gray-100"
                    }
                  `}
                  disabled={!isSameMonth(day, currentDate)} // Disable dates outside current month
                >
                  {format(day, "d")}
                  {hasEventOnDate(day) && (
                    <div className="absolute bottom-0.5 w-3 h-1 rounded-full bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
              Events for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length > 0 ? (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-indigo-400 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(event.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No events for this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
