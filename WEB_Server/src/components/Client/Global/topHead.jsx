import React, { useState, useContext, useEffect } from "react";
import logo from "../../../assets/img/lmslogo.svg";
import { UserContext } from "./UserData";
import Cookies from "js-cookie";
import LogOut from "../../utils/LogOut";
import SessionExpired from "./SessionExpired";

const TopHead = ({ func, active_home, active_books,active_notifications }) => {
  const [isHeadOpened, setIsHeadOpened] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userInfo, fetchNotifications, isSessionExpired, notifications } = useContext(UserContext);


const hasUnreadNotifications = notifications.some(
  (notificationGroup) =>
    notificationGroup.notifications.some(
      (notification) => !notification.is_read
    )
);

useEffect(() => {
  if (Cookies.get("remember") !== undefined) {
    fetchNotifications(userInfo.username)
  }
}, [])


  const closeHead = () => {
    setIsHeadOpened(true);
    document.getElementById("root").classList.remove("overflow-hidden");
  };

  const openHead = () => {
    setIsHeadOpened(false);
    document.getElementById("root").classList.add("overflow-hidden");
  };

  const account = () => {
    if (
      Cookies.get("remember") === null ||
      Cookies.get("remember") === undefined
    ) {
      return (
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="hidden md:block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-box-arrow-in-right w-5 h-5 text-white"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
            />
            <path
              fillRule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </button>
      );
    } else {
      return (
        <div className={`hidden md:flex relative items-center z-10`}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              className="hover:bg-[#282828] shadow-md w-auto h-10 rounded-full"
              src={userInfo && userInfo.profile_pic || ""}
              alt="dp"
            />
          </button>
          <div
            className={`absolute top-14 overflow-hidden shadow-lg right-0 bg-[#161616] rounded-md w-60 transition-all duration-300 ${
              isProfileOpen
                ? "h-[9.2rem] border border-[#515151]"
                : "h-0 border-0 border-[#515151]"
            }`}
          >
            <div
              className={`transition-all  duration-300 ${
                isProfileOpen ? "translate-y-0" : "translate-y-[-500%]"
              } px-4 py-3 flex flex-col gap-1`}
            >
              <button
                onClick={() => {
                  window.location.href = `/u/${userInfo.username}`;
                }}
                className="hover:bg-[#282828] cursor-pointer py-2 px-1 rounded-md flex items-center gap-2"
              >
                <img
                  className="w-auto h-8 rounded-full "
                  src= {userInfo && userInfo.profile_pic}
                  alt=""
                />
                <p className="text-white text-[14px] font-[600] capitalize">
                  {userInfo.first_name !== null && userInfo.last_name !== null
                    ? userInfo.first_name + " " + userInfo.last_name
                    : "Not Provided"}
                </p>
              </button>
              <button className="hover:bg-[#282828] w-full cursor-pointer py-2 px-2 rounded-md flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-envelope z-[10] w-[13px] h-auto text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                  </svg>
                  <div className="absolute w-6 h-6 -left-[.35rem] bg-[#4b4b4b] px-1 rounded-full" />
                </div>
                <p className="text-white text-[12px]">Give feedback</p>
              </button>
              <button
                onClick={() => {
                  LogOut();
                }}
                className="hover:bg-[#282828] w-full cursor-pointer py-2 px-2 rounded-md flex items-center gap-2"
              >
                <div className="relative flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-box-arrow-right w-4 z-[10] h-4 text-white"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                    />
                  </svg>
                  <div className="absolute w-6 h-6 -left-[.35rem] bg-[#4b4b4b] px-1 rounded-full" />
                </div>
                <p className="text-white text-[12px]">Logout</p>
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const accountMobileView = () => {
    if (
      Cookies.get("remember") != null ||
      Cookies.get("remember") != undefined
    ) {
      return (
        <a
          href={`/u/${userInfo.username}`}
          className={` flex gap-3 justify-evenly items-center bg-[#161616] py-3 px-3 rounded-lg`}
        >
          <img
            className="rounded-full w-[30px] sm:w-[35px]"
            src={userInfo.profile_pic}
            alt="profile"
          />
          <div className="flex flex-col">
            <h1 className="text-white text-center truncate w-[100%] text-[13px] sm:text-[15px]">
              {userInfo.username}
            </h1>
            <div className="flex gap-3 justify-between text-[#CCCCCC] text-[10px] sm:text-[12px]">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  LogOut();
                }}
                className="truncate hover:bg-[#0c0c0c] hover:text-[#FFFFFF] transition duration-500 px-[2px] rounded-md"
              >
                Logout
              </button>
              <button className="truncate hover:bg-[#0c0c0c] hover:text-[#FFFFFF] transition duration-500 px-[2px] rounded-md">
                Settings
              </button>
            </div>
          </div>
        </a>
      );
    } else {
      return (
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className={`w-full min-h-[70px] flex gap-3 justify-evenly items-center bg-[#161616] py-3 px-3 rounded-lg`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-box-arrow-in-right w-5 h-5 text-white"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
            />
            <path
              fillRule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </button>
      );
    }
  };



  return (
    <div>
      <nav>
        <div className="px-5 md:px-10 py-10 bg-[#282828] justify-between items-center w-full h-14 flex">
          <div>
            <a href="/">
              <img
                className="z-[100] w-auto h-[40px] md:h-[50px]"
                src={logo}
                alt="logo"
              />
            </a>
          </div>
          <ul className="hidden md:flex gap-10">
            <a href="/">
              <li
                className={`${
                  active_home ? "border-b-[3px]" : ""
                } font-bold text-white text-[15px] transition-all duration-300 hover:text-gray-400`}
              >
                Home
              </li>
            </a>
            <a href="/books">
              <li
                className={`${
                  active_books ? "border-b-[3px]" : ""
                } font-bold text-white text-[15px] transition-all duration-300 hover:text-gray-400`}
              >
                Books
              </li>
            </a>
            <button
              disabled={true}
              className="disabled:cursor-not-allowed disabled:text-white/80"
            >
              <li className=" font-bold text-[15px]">Check availability</li>
            </button>
          </ul>
          <div className="flex gap-8 items-center">
            <a href="/notifications" className="group flex relative items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className={`${active_notifications ? "text-green-400 hover:text-green-600" : "text-white hover:text-gray-400"} ${hasUnreadNotifications ? "animate-shake" : ""} transition-all duration-300 w-5 h-5 `}
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
              </svg>
                <span className={`${hasUnreadNotifications ? "block" : "hidden"} absolute -top-1 -right-1 inline-flex size-2 rounded-full bg-red-400`}></span>
            </a>
            <button
              className="text-white rounded-full z-10 text-[12px] md:text-[14px] right-0 top-0 bg-[#EE0000] hover:bg-red-700 px-5 py-[6px] ml-2"
              onClick={func}
            >
              Search
            </button>
            {/* Login Icon */}
            {account()}

            {/* Menu Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              onClick={openHead}
              className="bi bi-list text-white md:hidden cursor-pointer"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </div>
        </div>
      </nav>
      <div
        className={`fixed top-0 right-0 h-screen w-full backdrop-blur-[10px] z-[10] bg-[#000000a6] transition-opacity ${
          isHeadOpened ? "hidden" : "block md:hidden"
        }`}
        onClick={closeHead}
      ></div>
      <ul
        className={`px-5 py-4 rounded-l-lg transform transition-transform duration-300  items-end flex h-screen w-[50%] fixed z-[10] top-0 right-0  bg-[#282828] md:hidden flex-col gap-10 ${
          isHeadOpened ? "translate-x-[150%]" : "translate-x-[0%]"
        }`}
      >
        <div className="w-full cursor-pointer">
          <div onClick={closeHead}>
            <div className="before:content-[''] before:w-2 before:h-10 before:bg-[#9b9b9b] before:rounded-b-md before:absolute before:-left-8 before:h-5 before:rotate-[25deg] before:top-[calc(50%)] after:content-[''] after:w-2 after:h-10 after:bg-[#9b9b9b] after:rounded-t-md after:absolute after:-left-8 after:top-[calc(50%-14.5px)] after:h-5 after:rotate-[-25deg] hover:before:rotate-[0deg] before:transition before:duration-300 after:transition after:duration-300 hover:after:rotate-[0deg] hover:after:transition hover:after:bg-white hover:before:bg-white"></div>
          </div>
          {accountMobileView()}
          <h1 className="my-4 uppercase text-[10px] sm:text-[12px] text-[#cecece]">
            Menu
          </h1>
          <div className="flex flex-col gap-4 px-[4px]">
            <a
              href="/books"
              className="flex text-white items-center gap-2 font-bold text-[13px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-book-half"
                viewBox="0 0 16 16"
              >
                <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
              </svg>
              <li className="font-bold text-white text-[13px]">Books</li>
            </a>
            <a
              href="#"
              className="flex text-white items-center gap-2 font-bold text-[13px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-handbag-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2M5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0z" />
              </svg>
              <li className="font-bold text-white text-[13px]">Get</li>
            </a>
            <a
              href="#"
              className="flex text-white items-center gap-2 font-bold text-[13px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar-date-fill"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zm5.402 9.746c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2" />
                <path d="M16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-6.664-1.21c-1.11 0-1.656-.767-1.703-1.407h.683c.043.37.387.82 1.051.82.844 0 1.301-.848 1.305-2.164h-.027c-.153.414-.637.79-1.383.79-.852 0-1.676-.61-1.676-1.77 0-1.137.871-1.809 1.797-1.809 1.172 0 1.953.734 1.953 2.668 0 1.805-.742 2.871-2 2.871zm-2.89-5.435v5.332H5.77V8.079h-.012c-.29.156-.883.52-1.258.777V8.16a13 13 0 0 1 1.313-.805h.632z" />
              </svg>
              <li className="text-white font-bold text-[13px]">Availability</li>
            </a>
          </div>
        </div>
      </ul>
      <SessionExpired isSessionExpired={isSessionExpired} />
    </div>
  );
};

export default TopHead;
