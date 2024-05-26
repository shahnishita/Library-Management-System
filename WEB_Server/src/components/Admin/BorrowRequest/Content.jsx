import React from "react";

const Content = ({ send, borrowRequests }) => {
  const getTimeDifference = (requestedTime, text) => {
    const currentTime = new Date();
    const diffInMilliseconds = Math.abs(currentTime - new Date(requestedTime));
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ${text}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ${text}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ${text}`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <h1 className="text-3xl md:text-3xl font-black">Borrow Requests</h1>
          <hr className="border-[#bebebe90] my-4 pb-6 md:pb-12" />
          <div className="grid grid-cols-12 ">
            <div className="flex flex-col col-span-12 mb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[18px] font-bold">Filter</span>
                <h2 className="block md:hidden text-[18px] md:text-[16px] font-bold mr-8">
                  Result {borrowRequests.length || 0}
                </h2>
              </div>
              <div className="flex justify-between items-center w-full">
                <select
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    send({
                      request_status: newStatus,
                    });
                  }}
                  className="min-w-[250px] appearance-none capitalize text-black px-3 py-[8px] rounded-md bg-[#282828] text-white text-[15px] outline-none border-0"
                  name="request_status"
                >
                  <option value="all">All Requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
                <h2 className="hidden md:block text-[16px] font-bold mr-8">
                  Result {borrowRequests.length || 0}
                </h2>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {borrowRequests.length > 0 ? (
              borrowRequests.map((borrowRequest, i) => (
                <div
                  onClick={() => {
                    window.location.href = `/admin/response/request/${borrowRequest.borrow_id}`;
                  }}
                  key={i}
                  className={`cursor-pointer bg-[#282828] p-5 rounded-lg mb-4 flex justify-between gap-4 ${
                    i % 2 === 0 ? "bg-[#282828]" : "bg-[#1f1f1f]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center">
                      <img
                        src={borrowRequest.book.thumbnail}
                        alt={borrowRequest.book.title}
                        className="aspect-[2.5/4] h-16 mr-4 rounded-md block md:hidden"
                      />
                      <div className="overflow-hidden">
                        <h2 className="text-xl font-bold truncate">
                          {borrowRequest.book.title}
                        </h2>
                        <p className="text-sm text-[#bebebe]">
                          by {borrowRequest.book.author.split("$")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a
                        target="_blank"
                        href={`/u/${borrowRequest.user.username}`}
                      >
                        <strong>User:</strong>{" "}
                        {borrowRequest.user.first_name &&
                        borrowRequest.user.last_name
                          ? `${borrowRequest.user.first_name} ${borrowRequest.user.last_name}`
                          : `@${borrowRequest.user.username}`}
                      </a>
                      <p>
                        <strong>Requested Time:</strong>{" "}
                        {new Date(
                          borrowRequest.requested_time
                        ).toLocaleString()}
                        ,{" "}
                        {getTimeDifference(borrowRequest.requested_time, "ago")}
                      </p>
                      <p>
                        <strong>Return Date:</strong>
                        {borrowRequest.return_date ? (
                          borrowRequest.status === "Returned" ? (
                            <span> Returned</span>
                          ) : (
                            <span>
                              {" "}
                              {new Date(
                                borrowRequest.return_date
                              ).toLocaleString()}
                              ,{" "}
                              {getTimeDifference(
                                borrowRequest.return_date,
                                "left"
                              )}
                            </span>
                          )
                        ) : borrowRequest.status === "Approved" ? (
                          " Not collected yet"
                        ) : (
                          " Not approved yet"
                        )}
                      </p>
                      <p>
                        <strong>Status:</strong> {borrowRequest.status}
                      </p>
                      <p className="truncate">
                        <strong>Message:</strong> {borrowRequest.message}
                      </p>
                    </div>
                  </div>
                  <img
                    className="hidden md:block max-h-[185px] h-full aspect-[2.5/4]"
                    src={borrowRequest.book.thumbnail}
                    alt=""
                  />
                </div>
              ))
            ) : (
              <p className="text-center mt-40">No borrow requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
