import React, { useContext, useState } from "react";
import { UserContext } from "../../Client/Global/UserData";
import LogOut from "../../utils/LogOut";

const SideBar = ({
  activeDashboardTab = true,
  activeReqTab,
  activeBookDrawer,
  activeSettingsTab,
}) => {
  const { userInfo, isLoggedIn } = useContext(UserContext);
  const [expandedBookDrawer, setExpandedBookDrawer] = useState(false);

  return (
    <div className="z-10 fixed inset-y-0 left-0 overflow-hidden w-20 lg:w-60 bg-[#282828] px-4 lg:px-7 py-4 flex flex-col gap-10 text-white">
      {isLoggedIn ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/u/${userInfo.username}`}
          className="flex gap-4 items-center justify-center lg:justify-start"
        >
          <img
            src={userInfo.profile_pic}
            className="rounded-full w-[80%] lg:w-auto lg:h-14"
            alt="profile pic"
          />
          <div className="hidden lg:flex flex-col">
            <p className="font-bold text-[15px]">
              {userInfo.first_name && userInfo.last_name
                ? `${userInfo.first_name} ${userInfo.last_name}`
                : `@${userInfo.username}`}
            </p>
            <p className="text-[13px] text-[#CCCCCC]">{userInfo.role}</p>
          </div>
        </a>
      ) : (
        <a
          href="/login"
          className="flex gap-3 items-center py-3 lg:py-6 justify-center rounded-lg bg-[#161616]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-box-arrow-in-right -ml-1 lg:ml-0"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
            />
            <path
              fillRule="evenodd"
              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
          </svg>
        </a>
      )}
      <div className="flex flex-col gap-4 w-auto">
        <a
          href="/admin/dashboard"
          className={`${
            activeDashboardTab
              ? "bg-blue-500 hover:bg-blue-600"
              : "hover:bg-[#0c0c0c]/80"
          } px-3 py-3 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start gap-3`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-boxes"
            viewBox="0 0 16 16"
          >
            <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
          </svg>
          <p className="hidden lg:block text-[14px]">Dashboard</p>
        </a>
        <a
          href="/admin/borrow/requests"
          className={`${
            activeReqTab
              ? "bg-blue-500 hover:bg-blue-600"
              : "hover:bg-[#0c0c0c]/80"
          } px-3 py-3 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start gap-3`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-book"
            viewBox="0 0 16 16"
          >
            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
          </svg>
          <p className="hidden lg:block text-[14px]">Borrow Request</p>
        </a>
        <div className="flex flex-col gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              setExpandedBookDrawer(!expandedBookDrawer);
            }}
            className={`${
              expandedBookDrawer
                ? "bg-[#0c0c0c]/80"
                : activeBookDrawer
                ? "bg-blue-500 hover:bg-blue-600"
                : "hover:bg-[#0c0c0c]/80"
            }  px-3 py-3 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start gap-3`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-bookshelf"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5M3 14h10v-3H3zm0-4h10V7H3zm0-4h10V3H3z" />
            </svg>
            <p className="hidden lg:block text-[14px]">Book</p>
          </button>
          <div
            onClick={() => setExpandedBookDrawer(!expandedBookDrawer)}
            className={`${
              expandedBookDrawer ? "block lg:hidden" : "hidden"
            } w-full h-full z-[9] bg-transparent fixed top-0 left-0`}
          />
          <div
            className={`lg:hidden ml-4 z-[1000] bg-[#282828] shadow-lg shadow-black/40 border-l-[5px] border-gray-500 border px-2 py-2 fixed left-20 top-40 rounded-tr-md rounded-br-md overflow-hidden transition-all duration-300 ${
              expandedBookDrawer ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <BookDrawer
              textStyle={"lg:hidden"}
              activeBookDrawer={activeBookDrawer}
            />
          </div>

          <div
            className={`lg:block hidden ml-4 overflow-hidden transition-all duration-300 ${
              expandedBookDrawer ? "h-[143px] " : "h-0 invisible"
            }`}
          >
            <BookDrawer
              className={"gap-4"}
              textStyle={"hidden lg:block"}
              activeBookDrawer={activeBookDrawer}
            />
          </div>
          <hr className="mx-3 lg:mr-32 lg:ml-4 border-gray-500" />
          <a
            href="/admin/settings"
            className={`${
              activeSettingsTab
                ? "bg-blue-500 hover:bg-blue-600"
                : "hover:bg-[#0c0c0c]/80"
            } px-3 py-3 lg:py-2 rounded-lg flex items-center justify-center lg:justify-start gap-3`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-gear"
              viewBox="0 0 16 16"
            >
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
            </svg>
            <p className="hidden lg:block text-[14px]">Settings</p>
          </a>
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <button
          onClick={() => LogOut()}
          className="bg-[#161616] hover:bg-black px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;

export const BookDrawer = ({ activeBookDrawer, textStyle, className }) => {
  return (
    <div className={`flex flex-col gap-2 ${className} `}>
      <a
        href="/admin/book/add"
        className={`${
          activeBookDrawer === "addBook"
            ? "bg-blue-500 hover:bg-blue-600"
            : "hover:bg-[#0c0c0c]/80"
        } px-3 py-2 rounded-lg flex items-center justify-start gap-3`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-plus-square"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
        <p className={`${textStyle} text-[14px]`}>Add Book</p>
      </a>
      <a
        href="/admin/book/update"
        className={`${
          activeBookDrawer === "updateBook"
            ? "bg-blue-500 hover:bg-blue-600"
            : "hover:bg-[#0c0c0c]/80"
        } px-3 py-2 rounded-lg flex items-center justify-start gap-3`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-graph-up"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
          />
        </svg>
        <p className={`${textStyle} text-[14px]`}>Update Book</p>
      </a>
      <a
        href="/admin/book/label"
        className={`${
          activeBookDrawer === "bookLabel"
            ? "bg-blue-500 hover:bg-blue-600"
            : "hover:bg-[#0c0c0c]/80"
        } px-3 py-2 rounded-lg flex items-center justify-start gap-3`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-tag-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        </svg>
        <p className={`${textStyle} text-[14px]`}>Book Label</p>
      </a>
    </div>
  );
};
