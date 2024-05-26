import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../../Client/Global/UserData";
import axios from "axios";
import Calendar from "./calender";
import Cookies from "js-cookie";

const MainDashBoard = ({ staffList, recentLog, setIsSessionExpired }) => {
  const { userInfo, fetchUserData } = useContext(UserContext);
  const [isRoleAdder, setIsRoleAdder] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchInput, setSearchInput] = useState({});
  const searchRef = useRef(null);
  const [roleUpdateResponse, setRoleUpdateResponse] = useState({
    type: "",
    message: "",
    isShow: false,
  });

  const formatTimeStamp = (timestamp) => {
    const date = new Date(timestamp);
    const customFormattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })}`;
    return customFormattedDate;
  };

  const displayedStaff = staffList.slice(0, 4);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchInput((prev) => ({ ...prev, username: query }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/admins/user/list/?q=${query}`
      );
      setUserList(response.data);
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        `http://127.0.0.1:8000/admins/user/role/update/${CSRFToken}/${Token}/`,
        searchInput
      );

      setRoleUpdateResponse({
        type: "success",
        message: response.data.message,
        isShow: true,
      });
      setTimeout(() => {
        setRoleUpdateResponse({
          isShow: false,
        });
      }, 1500);
      if (searchInput.userUID === userInfo.uid) {
        Cookies.remove("remember");
      }
    } catch (err) {
      setRoleUpdateResponse({
        type: "error",
        message: "Something went wrong.",
        isShow: true,
      });
      setTimeout(() => {
        setRoleUpdateResponse({
          isShow: false,
        });
      }, 1500);
      return null;
    }
  };

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-auto py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="grid grid-rows-2 gap-4 col-span-1">
          <div className="p-5 flex flex-col gap-1 rounded-xl bg-[#282828] row-span-1">
            <p className="text-3xl font-black">
              Welcome,{" "}
              {userInfo.last_name ? userInfo.last_name : userInfo.username}!
            </p>
            <span className="text-xl">Dashboard</span>
          </div>
          <div className="flex flex-col gap-3 rounded-xl bg-[#282828] row-span-1"></div>
        </div>
        <div className="col-span-1 rounded-xl bg-[#282828] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-md font-bold">Team Directory</span>
            <a
              href=""
              className="text-sm font-bold flex items-center gap-1 bg-blue-500 px-3  hover:bg-blue-600 rounded-sm"
            >
              View
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-3">
              {displayedStaff.slice(0, 2).map((staff, index) => (
                <a
                  href={`/u/${staff.username}`}
                  target="_blank"
                  key={index}
                  className="px-5 py-4 w-[50%] rounded-xl flex flex-col items-center gap-3 bg-[#161616]"
                >
                  <img
                    className="rounded-full h-12"
                    src={`${staff.profile_pic_url}`}
                    alt={`${staff.username} image`}
                  />
                  <div className="flex flex-col gap-[2px] w-full items-center">
                    <h1 className="text-[13px] text-center truncate w-[65%]">
                      {!staff.first_name || !staff.last_name ? (
                        <span>@{staff.username} </span>
                      ) : (
                        <span>
                          {staff.first_name} {staff.last_name}{" "}
                        </span>
                      )}
                    </h1>
                    <h2 className="text-[12px] text-[#CCCCCC] text-center truncate w-[65%]">
                      {staff.role}
                    </h2>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex justify-between gap-3">
              {displayedStaff.slice(2, 4).map((staff, index) => (
                <a
                  href={`/u/${staff.username}`}
                  target="_blank"
                  key={index}
                  className="px-5 py-4 w-[50%] rounded-xl flex flex-col items-center gap-3 bg-[#161616]"
                >
                  <img
                    className="rounded-full h-12"
                    src={`${staff.profile_pic_url}`}
                    alt={`${staff.username} image`}
                  />
                  <div className="flex flex-col gap-[2px] w-full items-center">
                    <h1 className="text-[13px] text-center truncate w-[65%]">
                      {!staff.first_name || !staff.last_name ? (
                        <span>@{staff.username} </span>
                      ) : (
                        <span>
                          {staff.first_name} {staff.last_name}{" "}
                        </span>
                      )}
                    </h1>
                    <h2 className="text-[12px] text-[#CCCCCC] text-center truncate w-[65%]">
                      {staff.role}
                    </h2>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 rounded-xl bg-[#282828] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-md font-bold">Recent Activity</span>
            <a
              href=""
              className="text-sm font-bold flex items-center gap-1 bg-blue-500 px-3  hover:bg-blue-600 rounded-sm"
            >
              View
            </a>
          </div>
          <div className="flex flex-col gap-3 justify-evenly h-full">
            {recentLog.slice(0, 3).map((log, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#161616] rounded-3xl p-3"
              >
                <img
                  className="rounded-full h-10"
                  src={log.user.profile_pic_url}
                  alt={`${log.user.username} image`}
                />
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <p className="text-[13px] truncate">
                    <a
                      target="_blank"
                      href={`/u/${log.user.username}`}
                      className="font-bold"
                    >
                      {!log.user.first_name || !log.user.last_name ? (
                        <span>@{log.user.username} </span>
                      ) : (
                        <span>
                          {log.user.first_name} {log.user.last_name}{" "}
                        </span>
                      )}
                    </a>

                    {log.action}
                  </p>
                  <h1 className="text-[12px] text-[#CCCCCC] truncate">
                    {formatTimeStamp(log.timestamp)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-xl bg-[#282828] p-5 flex flex-col gap-4">
          <span className="text-md font-bold">Member Management</span>
          <div className="flex flex-col justify-between h-full pb-5 gap-4">
            <div className="relative">
              <div className="flex w-full gap-3 justify-between">
                <div
                  className={`${
                    isRoleAdder ? "w-[80px]" : "w-full"
                  } overflow-hidden transition-all duration-300 flex flex-col text-[17px]`}
                >
                  <div
                    className={`bg-[#161616] rounded-l-3xl rounded-r-lg py-3 px-5 flex items-center gap-4`}
                  >
                    <button
                      onClick={() => {
                        setIsRoleAdder(!isRoleAdder);
                        if (!isRoleAdder) {
                          setTimeout(() => {
                            searchRef.current.focus();
                          }, 0);
                        } else {
                          setUserList([]);
                        }
                      }}
                      className="relative"
                    >
                      <div
                        className={`${
                          isRoleAdder ? "after:border-[#879FFF]" : ""
                        } bg-black w-5 h-5 rounded-full after:border-[3px] after:w-full after:h-full after:absolute after:rounded-full after:top-0 after:right-0`}
                      />
                    </button>
                    <span className={`text-[15px] font-bold truncate`}>
                      Add member role
                    </span>
                  </div>
                </div>
                <input
                  ref={searchRef}
                  value={searchInput.username || ""}
                  disabled={!isRoleAdder}
                  placeholder="@username"
                  onChange={handleInputChange}
                  type="text"
                  className={`${
                    isRoleAdder ? "w-full" : "w-[65px]"
                  } text-[14px] transition-all duration-300 bg-[#161616] rounded-r-3xl rounded-l-lg py-3 px-5 outline-none`}
                />
              </div>
              <div
                className={`${
                  userList.length === 0 ? "" : "p-5"
                } z-10 max-h-[200px] overflow-auto flex flex-col gap-3 absolute bg-[#101010] rounded-xl w-full lg:w-[calc(100%-65px)] top-[65px] right-0`}
              >
                {userList.map((user, index) => (
                  <button
                    onClick={() => {
                      setSearchInput(user);
                      setUserList([]);
                    }}
                    key={index}
                    className="flex items-center gap-5 bg-[#282828] rounded-xl p-2 hover:bg-[#161616]"
                  >
                    <img
                      className="rounded-full h-9"
                      src={
                        user.profile_pic_url ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={`DP`}
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
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                disabled
                className="text-[14px] disabled:cursor-not-allowed bg-[#181818] outline-none w-full px-5 py-4 rounded-xl"
                type="text"
                onChange={(e) => {
                  setSearchInput({ ...searchInput, userUID: e.target.value });
                }}
                value={searchInput.username || ""}
              />
              <select
                name="role"
                value={searchInput.role || "Admin"}
                disabled={!isRoleAdder || searchInput.role === "Owner"}
                onChange={(e) => {
                  setSearchInput({ ...searchInput, role: e.target.value });
                }}
                className={`text-[14px] disabled:cursor-not-allowed w-full outline-none px-5 py-4 rounded-xl bg-[#181818]`}
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Librarian">Librarian</option>
                <option value="Member">Member</option>
                <option value="VIP">VIP</option>
                <option disabled value="Owner">
                  Owner
                </option>
              </select>
              <button
                type="submit"
                className="text-[14px] bg-blue-500 hover:bg-blue-600 text-white mt-3 font-bold py-2 px-4 rounded-xl"
              >
                Save Role
              </button>
            </form>
          </div>
          <div
            className={`${roleUpdateResponse.isShow ? "h-10" : "h-0"} ${
              roleUpdateResponse.type === "success"
                ? "bg-[#d4edda] text-[#155724]"
                : "bg-[#f8d7da] text-[#721c24]"
            } text-[13px] font-bold transition-all duration-300 overflow-hidden absolute bottom-0 right-0 bg-green-500 w-full flex justify-center items-center rounded-b-3xl`}
          >
            <span>{roleUpdateResponse.message}</span>
          </div>
        </div>
        <div className="relative col-span-1 lg:col-span-2 rounded-xl bg-[#282828] py-4 lg:py-5 px-3 lg:px-8 flex flex-col gap-4">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;
