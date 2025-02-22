import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isEqual,
  isSameMonth,
  addMonths,
  subMonths,
  setYear,
  getYear,
} from "date-fns";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);

  // Generate year range - 100 years back to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - 30 + i);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
    setShowYearSelect(false);
  };

  const handleYearButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setShowYearSelect(!showYearSelect);
  };

  const handleYearSelect = (e: React.MouseEvent, year: number) => {
    e.preventDefault(); // Prevent form submission
    setCurrentMonth(setYear(currentMonth, year));
    setShowYearSelect(false);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="relative">
      <input
        type="text"
        value={format(value, "MMMM dd, yyyy")}
        onClick={() => setIsOpen(true)}
        readOnly
        className="w-full border rounded-lg p-2 cursor-pointer"
      />

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-white rounded-lg shadow-xl p-4 w-72">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button" // Add this to prevent form submission
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button" // Add this to prevent form submission
              onClick={handleYearButtonClick}
              className="font-semibold hover:bg-gray-100 px-2 py-1 rounded flex items-center gap-1"
            >
              {format(currentMonth, "MMMM yyyy")}
              <ChevronsUpDown className="h-4 w-4" />
            </button>
            <button
              type="button" // Add this to prevent form submission
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {showYearSelect ? (
            <div className="h-64 overflow-y-auto grid grid-cols-3 gap-1">
              {years.map((year) => (
                <button
                  key={year}
                  type="button" // Add this to prevent form submission
                  onClick={(e) => handleYearSelect(e, year)}
                  className={`
                    p-2 text-sm rounded hover:bg-gray-100
                    ${
                      getYear(currentMonth) === year
                        ? "bg-indigo-100 font-semibold"
                        : ""
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 h-8 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}

              {monthDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={
                    (minDate && day < minDate) || (maxDate && day > maxDate)
                  }
                  className={`
                    h-8 w-8 flex items-center justify-center rounded-full text-sm
                    ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                    ${
                      isEqual(day, value)
                        ? "bg-indigo-500 text-white"
                        : "hover:bg-gray-100"
                    }
                    ${
                      (minDate && day < minDate) || (maxDate && day > maxDate)
                        ? "text-gray-300 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {format(day, "d")}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
