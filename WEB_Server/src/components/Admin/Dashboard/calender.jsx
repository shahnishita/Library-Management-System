import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startDay = startOfMonth.getDay();
  const endDay = endOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-[#191919]"></div>);
    }
    for (let i = 1; i <= endDay; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isTodayDate = isToday(date);

      let dayClass = "p-[6px] text-center rounded-md text-[13px] lg:text-md";
      if (isTodayDate) {
        dayClass += " bg-blue-500";
      } else if (isWeekend) {
        dayClass += " bg-gray-700";
      } else {
        dayClass += " bg-[#191919]";
      }

      days.push(
        <div key={`day-${i}`} className={dayClass}>
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col gap-5 w-full mx-auto my-0 bg-[#282828] text-white rounded-[10px] overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-bold m-0">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            className="hover:bg-blue-600 bg-blue-500 border-none text-white p-[5px] rounded-full"
            onClick={prevMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-left"
              viewBox="0 0 16 16"
            >
              <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
            </svg>
          </button>
          <button
            className="hover:bg-blue-600 bg-blue-500 border-none text-white p-[5px] rounded-full"
            onClick={nextMonth}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-right"
              viewBox="0 0 16 16"
            >
              <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[5px] text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-[#161616] text-[13px] lg:text-md select-none rounded-md py-1 font-bold "
          >
            {day}
          </div>
        ))}
        {generateCalendar()}
      </div>
    </div>
  );
};

export default Calendar;
