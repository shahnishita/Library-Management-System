import React, { useState, useEffect } from "react";

const UserHistory = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-white h-auto container mx-auto px-4 md:px-0 w-full py-40">
        <p className="text-white text-center">
          User has not borrowed any books yet
        </p>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto text-white md:mt-4">
        <div className="flex flex-col grid grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-10 px-7 py-12">
          {history.map((historyData, i) => {
            const { book } = historyData;
            return (
              <div
                key={i}
                className={`relative col-span-4 shadow-md shadow-[black] px-3 py-3 h-[250px] hover:scale-105 transition hover:duration-300 bg-[#161616] rounded-lg`}
              >
                <div
                  className={`${historyData.status ? "px-2 py-1" : ""} ${
                    historyData.status === "Approved"
                      ? "bg-[limegreen] text-black"
                      : historyData.status === "Pending"
                      ? "bg-[lightblue] text-black"
                      : historyData.status === "Rejected"
                      ? "bg-[red] text-white"
                      : historyData.status === "borrowed"
                      ? "bg-[darkblue] text-white"
                      : historyData.status === "Overdue"
                      ? "bg-[darkred] text-white"
                      : historyData.status === "Cancelled"
                      ? "bg-[gray] text-white"
                      : historyData.status === "Returned"
                      ? "bg-[green] text-white"
                      : ""
                  } absolute top-0 left-0 lowercase text-sm rounded-tl-lg rounded-br-lg`}
                >
                  {historyData.status ? historyData.status : ""}
                </div>
                <div className="w-full h-full flex gap-4">
                  <img
                    className="h-full aspect-[2.5/4] rounded-lg shadow-sm shadow-[black]"
                    src={book.thumbnail}
                    alt=""
                  />
                  <div className="relative flex flex-col gap-1 w-full">
                    <p className="text-sm">
                      <span className="font-bold">Title:</span> {book.title}
                    </p>
                    <div className="absolute bottom-0 left-0">
                      <>
                        {historyData.late_fine_amount === 0 ? (
                          ""
                        ) : (
                          <p className="text-red-500">
                            {historyData.late_fine_amount}
                            <span className="text-[12px]">$</span>
                          </p>
                        )}
                      </>
                    </div>
                    <div className="absolute flex bottom-0 right-0 gap-3">
                      {historyData.status === "Approved" &&
                      !historyData.isReturned ? (
                        <TimeCounter
                          acceptedTime={new Date(historyData.accepted_time)}
                          returnTime={new Date(historyData.return_date)}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default UserHistory;

export const TimeCounter = ({ acceptedTime, returnTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const difference = new Date(returnTime) - currentTime;

      let days = Math.floor(difference / (1000 * 60 * 60 * 24));
      let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((difference / 1000 / 60) % 60);
      let seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsNegative(difference < 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedTime, returnTime]);

  const formatTime = (timeUnit) => {
    return timeUnit < 10 && timeUnit >= 0
      ? `0${timeUnit}`
      : timeUnit.toString().startsWith("-") && Math.abs(timeUnit) < 10
      ? `${timeUnit.toString().slice(0, 1)}0${timeUnit.toString().slice(1)}`
      : timeUnit.toString();
  };

  const textColorClass = isNegative ? "text-red-500" : "";

  return (
    <span className={textColorClass}>{`${timeLeft.days} :  ${formatTime(
      timeLeft.hours
    )} : ${formatTime(timeLeft.minutes)} : ${formatTime(
      timeLeft.seconds
    )}`}</span>
  );
};