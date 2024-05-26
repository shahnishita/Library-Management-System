import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../Global/SideBar";
import { UserContext } from "../../Client/Global/UserData";
import PreLoader from "../../Client/Global/PreLoader";
import axios from "axios";
import Loader from "../../Client/Global/loader";
import Cookies from "js-cookie";

const ResponseRequest = () => {
  const { borrow_id } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [isPreLoading, setIsPreLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { DecodeUserData } = useContext(UserContext);

  const fetchRequestData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/admins/borrow/requests/${borrow_id}/`
      );

      const { user } = response.data;
      document.title = `${
        user.first_name && user.last_name
          ? user.first_name + " " + user.last_name
          : "@" + user.username
      } Request - Library of Congress`;

      setRequestData(response.data);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsPreLoading(true);
      try {
        await DecodeUserData();
        await fetchRequestData();

        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };

    fetchData();
  }, []);

  const nonStaffTypes = ["guest", "member", "VIP"];

  if (isPreLoading) {
    return <PreLoader />;
  }

  if (
    !Cookies.get("remember") ||
    !localStorage.getItem("localData") ||
    nonStaffTypes.includes(Cookies.get("user_type"))
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar activeReqTab={true} activeDashboardTab={false} />
      <div className="flex-grow">
        <ResponseRequestContent
          setIsLoading={setIsLoading}
          requestData={requestData}
        />
      </div>
      <div
        className={`${
          isLoading ? "block" : "hidden"
        } fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <Loader SvgWidth="25px" width="70px" />
      </div>
    </div>
  );
};

export default ResponseRequest;

const ResponseRequestContent = ({ requestData, setIsLoading }) => {
  const [takenTime, setTakenTime] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [borrowRequestResponse, setBorrowRequestResponse] = useState({
    status: requestData?.request_status || "",
    taken_time: null,
    handled_by: requestData?.request_handled_by?.staffID || "",
    borrow_id: requestData?.borrow_id || "",
    returned_time: null,
  });

  const [returnedTime, setReturnedTime] = useState(null);
  const [alreadyHandledStaffID, setAlreadyHandledStaffID] = useState(
    requestData?.request_handled_by?.staffID || null
  );
  const [serverResponse, setServerResponse] = useState(null);
  const [sendNotificationData, setSendNotificationData] = useState({
    message: "",
    isEmail: false,
    isNotification: false,
    staffID: requestData?.request_handled_by?.staffID || "",
    userUID: requestData?.user?.userUID || "",
    hour: new Date().getHours(),
    subject: "Library of Congress",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      if (searchInput.length === 0) {
        setStaffList([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/admins/find/staff/?q=${searchInput}`
        );
        if (Array.isArray(response.data)) {
          setStaffList(response.data);
        } else {
          setStaffList([response.data]);
        }
      } catch (error) {
        console.error(error);
        setStaffList([]);
      }
    };
    const debounceFetch = setTimeout(() => {
      fetchStaff();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchInput]);

  const handleStaffSelection = (user) => {
    setSelectedStaff(user);
    setStaffList([]);
    setSearchInput("");
    setBorrowRequestResponse((prev) => ({ ...prev, handled_by: user.staffID }));
  };

  const PostBorrowRequest = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const CSRFResponse = await axios.get(
        `${import.meta.env.VITE_PRC_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const CSRFToken = CSRFResponse.data.csrf_token;

      const TokenResponse = await axios.get(
        `${import.meta.env.VITE_PR_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/admins/response/borrow/request/${CSRFToken}/${Token}/`,
        borrowRequestResponse
      );
      setServerResponse(response.data);
      setIsLoading(false);
      setTimeout(() => {
        setServerResponse(null);
      }, 3000);
    } catch (err) {
      setServerResponse(err.response.data);
      setIsLoading(false);
      setTimeout(() => {
        setServerResponse(null);
      }, 3000);
      return null;
    }
  };

  const sendNotificationFunction = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const CSRFResponse = await axios.get(
        `${import.meta.env.VITE_PRC_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const CSRFToken = CSRFResponse.data.csrf_token;

      const TokenResponse = await axios.get(
        `${import.meta.env.VITE_PR_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/admins/send/notification/${CSRFToken}/${Token}/`,
        sendNotificationData
      );

      setServerResponse(response.data);
      setTimeout(() => {
        setServerResponse(null);
      }, 3000);
      setIsLoading(false);
    } catch (err) {
      setServerResponse(err.response.data);
      setTimeout(() => {
        setServerResponse(null);
      }, 3000);
      setIsLoading(false);
    }
  };

  function formatDateToCustomString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    const timeZoneOffset = date.getTimezoneOffset();
    const timeZoneOffsetSign = timeZoneOffset > 0 ? "-" : "+";
    const timeZoneOffsetHours = String(
      Math.abs(Math.floor(timeZoneOffset / 60))
    ).padStart(2, "0");
    const timeZoneOffsetMinutes = String(
      Math.abs(timeZoneOffset % 60)
    ).padStart(2, "0");
    const timeZone = `${timeZoneOffsetSign}${timeZoneOffsetHours}:${timeZoneOffsetMinutes}`;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${timeZone}`;
  }

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <h1 className="text-3xl md:text-3xl font-black">Request Details</h1>
          <hr className="border-[#bebebe90] my-4 pb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className={`relative flex gap-5 bg-[#282828] bg-center bg-cover bg-no-repeat col-span-1 p-5 rounded-lg`}
            >
              <div
                className={`md:hidden z-[9] w-full h-full absolute bg-gradient-to-r from-[#282828]/90 to-black/80 top-0 left-0 rounded-lg`}
              />
              <img
                className="rounded-lg md:hidden absolute top-0 left-0 h-full w-full object-cover"
                src={requestData.book.thumbnail}
                alt=""
              />
              <img
                src={requestData.book.thumbnail}
                alt={requestData.book.title}
                className="aspect-[2.5/4] hidden md:block h-56 rounded-md"
              />
              <div className="z-10 overflow-hidden flex flex-col justify-between">
                <div>
                  <h2 className="text-md md:text-xl font-bold truncate">
                    {requestData.book.title}
                  </h2>
                  <p className="text-[12px] md:text-sm text-[#bebebe]">
                    by {requestData.book.author.split("$")[0]}
                  </p>
                </div>
                <div>
                  <p className="text-sm md:text-md">
                    <strong>Authors:</strong>{" "}
                    {requestData.book.author.split("$").join(",")}
                  </p>
                  <p className="text-sm md:text-md">
                    <strong>Publisher:</strong>{" "}
                    {requestData.book.publisher.split("$").join(",")}
                  </p>
                  <p className="text-sm md:text-md">
                    <strong>ISBN:</strong>{" "}
                    {requestData.book.ISBN.split("$").join(",")}
                  </p>
                  <p className="text-md">
                    <strong>Pages:</strong> {requestData.book.pages}
                  </p>
                  <p className="text-sm md:text-md">
                    <strong>Book Quantity:</strong>{" "}
                    {requestData.book.book_available}
                  </p>
                </div>
              </div>
            </div>
            <div className="py-5 text-[#bebebe] col-span-1 bg-[#282828] p-5 rounded-lg">
              <h2 className="text-xl font-bold text-white">User Information</h2>
              <p className="text-sm">
                <strong className="text-white">Name:</strong>{" "}
                {requestData.user.first_name} {requestData.user.last_name}
              </p>
              <p className="text-sm">
                <strong className="text-white">Username:</strong>{" "}
                {requestData.user.username}
              </p>
              <p className="text-sm">
                <strong className="text-white">Email:</strong>{" "}
                {requestData.user.email}
              </p>
              <img
                src={requestData.user.profile_pic_url}
                alt={requestData.user.username}
                className="w-32 h-32 mt-4 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 w-full lg:w-1/2 gap-6 py-3 rounded-lg mt-5">
            <div>
              <h2 className="text-xl font-bold">Request Details</h2>
              <form className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status">Status</label>
                    <input
                      type="text"
                      readOnly
                      value={requestData.status}
                      className="outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="requested_time">Requested Time</label>
                    <input
                      type="text"
                      readOnly
                      value={new Date(
                        requestData.requested_time
                      ).toLocaleString()}
                      className="outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="borrowed_for">Borrow For</label>
                    <input
                      type="text"
                      readOnly
                      value={requestData.borrowed_for + " Days"}
                      className="text-[15px] outline-none w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-5">
                  <label htmlFor="message">Message</label>
                  <textarea
                    name="message"
                    readOnly
                    className="text-[15px] resize-none outline-none w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    rows={5}
                    value={requestData.message}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="mt-5">
              <h2 className="text-xl font-bold">Actions</h2>
              <form className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status">Status</label>
                    <select
                      onChange={(e) => {
                        setBorrowRequestResponse({
                          ...borrowRequestResponse,
                          status: e.target.value,
                        });
                      }}
                      defaultValue={requestData.status}
                      className="outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    >
                      <option
                        disabled={
                          requestData.status === "Approved" ? true : false
                        }
                        value="Approved"
                      >
                        Approved
                      </option>
                      <option
                        disabled={
                          requestData.status === "Pending" ? true : false
                        }
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        disabled={
                          requestData.status === "Borrowed" ? true : false
                        }
                        value="Borrowed"
                      >
                        Borrowed
                      </option>
                      <option
                        disabled={
                          requestData.status === "Overdue" ? true : false
                        }
                        value="Overdue"
                      >
                        Overdue
                      </option>
                      <option
                        disabled={
                          requestData.status === "Cancelled" ? true : false
                        }
                        value="Cancelled"
                      >
                        Cancelled
                      </option>
                      <option
                        disabled={
                          requestData.status === "Returned" ? true : false
                        }
                        value="Returned"
                      >
                        Returned
                      </option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="taken_time">Taken Time</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={
                          requestData.taken_time
                            ? new Date(requestData.taken_time).toLocaleString()
                            : takenTime || ""
                        }
                        readOnly
                        className="outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setTakenTime(formatDateToCustomString(new Date()));
                          setBorrowRequestResponse({
                            ...borrowRequestResponse,
                            taken_time: formatDateToCustomString(new Date()),
                          });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#161616] p-2 text-[#bebebe] hover:bg-[#101010] rounded-lg hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-clock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="returned_time">Returned Time</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={
                          requestData.returned_time
                            ? new Date(
                                requestData.returned_time
                              ).toLocaleString()
                            : returnedTime || ""
                        }
                        readOnly
                        className="outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setReturnedTime(formatDateToCustomString(new Date()));
                          setBorrowRequestResponse({
                            ...borrowRequestResponse,
                            returned_time: formatDateToCustomString(new Date()),
                          });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#161616] p-2 text-[#bebebe] hover:bg-[#101010] rounded-lg hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-clock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative flex flex-col gap-2">
                    <label htmlFor="handled_by">Handled By</label>
                    <div className="relative">
                      <input
                        type="text"
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={
                          alreadyHandledStaffID
                            ? alreadyHandledStaffID
                            : selectedStaff
                            ? `${selectedStaff.staffID}`
                            : searchInput
                        }
                        className="text-[15px] outline-none w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedStaff(null);
                          setAlreadyHandledStaffID(null);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#161616] p-2 text-[#bebebe] hover:bg-[#101010] rounded-lg hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={`${
                        staffList.length === 0 ? "" : "p-5"
                      } z-10 max-h-[150px] overflow-auto flex flex-col gap-3 absolute bg-[#101010] rounded-xl w-full top-[80px] right-0`}
                    >
                      {staffList.map((user, index) => (
                        <button
                          onClick={() => {
                            handleStaffSelection(user);
                          }}
                          key={index}
                          className="flex items-center gap-5 bg-[#282828] rounded-xl p-2 hover:bg-[#161616]"
                        >
                          <img
                            className="rounded-full h-9"
                            src={user.profile_pic_url}
                            alt={`${user.username} image`}
                          />
                          <div className="flex flex-col justify-start">
                            <p className="text-[13px] truncate">
                              {user.first_name} {user.last_name}
                            </p>
                            <h1 className="text-[12px] text-[#CCCCCC] truncate text-start">
                              {"@"}
                              {user.username}
                            </h1>
                          </div>
                        </button>
                      ))}{" "}
                    </div>
                  </div>
                </div>
                <button
                  onClick={PostBorrowRequest}
                  className="bg-blue-500 mt-5 hover:bg-blue-700 rounded-full px-10 py-[8px] text-[15px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold">Additional Actions</h2>
              <h1 className="mt-5 text-lg font-bold">Send Notification</h1>
              <form className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                    <label htmlFor="message">Message</label>
                    <textarea
                      rows={3}
                      onChange={(e) => {
                        setSendNotificationData({
                          ...sendNotificationData,
                          message: e.target.value,
                        });
                      }}
                      placeholder="Enter message"
                      className="resize-none outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-2 col-span-1">
                    <label htmlFor="subject">Subject</label>
                    <input
                      onChange={(e) => {
                        setSendNotificationData({
                          ...sendNotificationData,
                          subject: e.target.value,
                        });
                      }}
                      defaultValue={"Library of Congress - "}
                      placeholder="Enter message"
                      className="resize-none outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-1">
                    <label htmlFor="staffID">Staff ID</label>
                    <input
                      onChange={(e) => {
                        setSendNotificationData({
                          ...sendNotificationData,
                          staffID: e.target.value,
                        });
                      }}
                      defaultValue={requestData?.request_handled_by?.staffID}
                      placeholder="Enter message"
                      className="resize-none outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg w-full"
                    />
                  </div>
                  <div className="flex justify-between col-span-1 lg:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                      <div className="w-full">
                        <label
                          className={`${
                            sendNotificationData.isEmail
                              ? "border-blue-500 hover:bg-blue-500 hover:text-white"
                              : "hover:bg-white hover:text-black"
                          } text-[14px] w-full  transition-all duration-300 select-none cursor-pointer px-4 py-2 border-2 rounded-sm flex justify-center items-center`}
                          htmlFor="emailCheckBox"
                        >
                          E-Mail
                        </label>
                        <div>
                          <input
                            onChange={(e) => {
                              setSendNotificationData({
                                ...sendNotificationData,
                                isEmail: e.target.checked,
                              });
                            }}
                            id="emailCheckBox"
                            type="checkbox"
                            className="hidden outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          className={`${
                            sendNotificationData.isNotification
                              ? "border-blue-500 hover:bg-blue-500 hover:text-white"
                              : "hover:bg-white hover:text-black"
                          } text-[14px] w-full  transition-all duration-300 select-none cursor-pointer px-4 py-2 border-2 rounded-sm flex justify-center items-center`}
                          htmlFor="notificationCheckBox"
                        >
                          Notification
                        </label>
                        <div>
                          <input
                            onChange={(e) => {
                              setSendNotificationData({
                                ...sendNotificationData,
                                isNotification: e.target.checked,
                              });
                            }}
                            defaultChecked={false}
                            id="notificationCheckBox"
                            type="checkbox"
                            className="hidden outline-none text-[15px] w-full disabled:cursor-not-allowed bg-[#282828] p-3 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={sendNotificationFunction}
                        className="bg-blue-500 hover:bg-blue-700 rounded-lg px-5 py-2.5 text-[15px] font-medium hover:transition hover:duration-300 w-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-send-fill rotate-45"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="response"
        className={`${
          serverResponse
            ? serverResponse.type === "success"
              ? "bg-[#d4edda] text-[#155724] h-10"
              : "bg-[#f8d7da] text-[#721c24] h-10"
            : "bg-[#d4edda] text-[#155724] h-0"
        } w-full font-bold left-[80px] px-2 transition-all duration-300 capitalize text-[15px] flex items-center z-10 lg:left-[240px] fixed top-0`}
      >
        {serverResponse ? serverResponse.message : null}
      </div>
    </div>
  );
};
