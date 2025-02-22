import { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(() => {
    const [h] = value.split(":");
    return parseInt(h, 10) % 12 || 12;
  });
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">(() => {
    const [h] = value.split(":");
    return parseInt(h, 10) >= 12 ? "PM" : "AM";
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHourChange = (delta: number) => {
    setHours((prev) => {
      let newHour = prev + delta;
      if (newHour > 12) newHour = 1;
      if (newHour < 1) newHour = 12;
      return newHour;
    });
  };

  const handleMinuteChange = (delta: number) => {
    setMinutes((prev) => {
      let newMinute = prev + delta;
      if (newMinute > 45) newMinute = 0;
      if (newMinute < 0) newMinute = 45;
      return newMinute;
    });
  };

  const updateTime = () => {
    const militaryHour =
      period === "PM"
        ? hours === 12
          ? 12
          : hours + 12
        : hours === 12
        ? 0
        : hours;
    onChange(
      `${militaryHour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-lg p-2 flex items-center cursor-pointer hover:border-indigo-500"
      >
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <span>
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:00 {period}
        </span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Select Time</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleHourChange(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronUp className="h-6 w-6 text-gray-600" />
                </button>
                <span className="text-3xl font-bold my-2 w-12 text-center">
                  {hours.toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => handleHourChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronDown className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <span className="text-3xl font-bold">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleMinuteChange(15)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronUp className="h-6 w-6 text-gray-600" />
                </button>
                <span className="text-3xl font-bold my-2 w-12 text-center">
                  {minutes.toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => handleMinuteChange(-15)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronDown className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col gap-2">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p as "AM" | "PM")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        period === p
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                updateTime();
                setIsOpen(false);
              }}
              className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
