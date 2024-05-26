import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserReview from "./userProfile/userReview";
import UserHistory from "./userProfile/userHistory";
import UserSaved from "./userProfile/userSaved";
import Toast from "./Global/Toast";
import "./userProfile/profile.css";
import BookInfoPopUp from "./Book/bookInfoPopUp";
import PreLoader from "./Global/PreLoader";
import NotFound from "./Global/NotFound";
import Cookies from "js-cookie";
import LogOut from "../utils/LogOut";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(false);
  const [tab, setTab] = useState(1);
  const [dataFromChild, setDataFromChild] = useState({});
  const [saved, setSaved] = useState([]);
  const [UserNotFound, setUserNotFound] = useState(false);
  const [history, setHistory] = useState([]);
  const [isOwnerMenuClicked, setIsOwnerMenuClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserDatas({ username, setUserNotFound });
      await fetchHistory();
      await fetchSavedBooks();

      setUser(user);
      document.title = `${user.first_name} ${user.last_name} (@${user.username})`;
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkUserOwner = () => {
      if (user && user.session_code === Cookies.get("remember")) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    };

    checkUserOwner();
  }, [user]);

  useEffect(() => {
    window.addEventListener("click", handleClickOutsideMenu);
    return () => {
      window.removeEventListener("click", handleClickOutsideMenu);
    };
  }, []);

  const handleClickOutsideMenu = (event) => {
    const menu = document.getElementById("menu");
    if (menu && !menu.contains(event.target)) {
      setIsOwnerMenuClicked(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/borrow/history/?q=${username}`
      );
      setHistory(response.data);
    } catch (err) {
      return null;
    }
  };

  const fetchSavedBooks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/saved/books/?q=${username}`
      );
      setSaved(response.data);
    } catch (err) {
      return null;
    }
  };

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  const OwnerTab = () => {
    if (owner === true) {
      return (
        <li>
          <button
            onClick={() => setTab(3)}
            className={`text-white  text-[14px] md:text-lg font-bold`}
          >
            Saved{" "}
            <div
              className={`h-[4px] rounded-full bg-white transition-all duration-300 ${
                tab == 3 ? "w-full" : "w-0"
              }`}
            />
          </button>
        </li>
      );
    } else {
      return null;
    }
  };

  const SaveTab = () => {
    if (owner === true) {
      return (
        <div
          style={
            tab == 3
              ? { transform: "translateX(-200%)" }
              : tab == 2
              ? { transform: "translateX(-100%)" }
              : { transform: "translateX(0%)" }
          }
          className={`transition-all h-auto duration-300 w-[100%]`}
        >
          <UserSaved
            saved={saved}
            username={username}
            send={handleDataFromChild}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const editProfile = () => {
    if (owner !== true) {
      return;
    } else {
      window.location.href = `/u/${username}/edit`;
    }
  };

  if (!user) {
    return <PreLoader />;
  } else {
    if (UserNotFound) {
      return <NotFound />;
    } else {
      return (
        <section>
          <div
            className="h-[240px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${user.cover_pic})`,
            }}
          >
            <div className="h-[240px] bg-black/40">
              <div
                className={`${
                  !owner ? "hidden" : "block"
                } absolute right-5 top-3`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOwnerMenuClicked(!isOwnerMenuClicked);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className=" text-[#fff] hover:text-gray-300 hover:bg-gray-700/50 rounded p-1 transition-all w-8 h-8"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  </svg>
                </button>
              </div>
              <div className="absolute left-4 top-2">
                <a href="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-house-fill w-5 h-5 text-[#fff] hover:text-gray-300 transition-all"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                    <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                  </svg>
                </a>
              </div>
              {isOwnerMenuClicked ? (
                <div
                  id="menu"
                  className="absolute w-40 px-2 py-2 flex flex-col items-start gap-3 rounded-md text-white right-14 top-3 bg-[#161616]"
                >
                  <button
                    onClick={editProfile}
                    className="rounded-md w-full flex hover:text-gray-300 hover:bg-[#282828] px-3 py-1"
                  >
                    <span className="text-md">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      LogOut();
                    }}
                    className="rounded-md w-full flex hover:text-gray-300 hover:bg-[#282828] px-3 py-1"
                  >
                    <span className="text-md">Logout</span>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="p-6  text-white -mt-[30px] rounded-t-[25px] bg-[#161616] lg:h-[270px]">
            <div className="flex lg:flex-row flex-col items-center">
              <img
                className="h-[200px] w-[200px] bg-black border-4 border-[#161616] lg:ml-20 -mt-[125px] lg:-mt-[200px] rounded-full"
                src={`${user.profile_pic}`}
                alt={`${user.username}-image`}
              />
              <div className="flex flex-col w-full gap-3 items-center lg:items-start">
                <p className="flex items-start gap-2 lg:ml-10 mt-6 text-2xl md:text-3xl lg:text-4xl font-medium uppercase">
                  <span>
                    {user.first_name !== null && user.last_name !== null
                      ? user.first_name + " " + user.last_name
                      : "Not provided"}
                  </span>
                  {handleGender({ width: 20, height: 20, user: user })}
                </p>
                <div className="container mx-auto flex lg:flex-row flex-col lg:items-center my-7 lg:mt-4 lg:ml-10 lg:gap-40">
                  <a
                    href={`/u/${username}`}
                    className="flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      fill="currentColor"
                      className="bi bi-at"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
                    </svg>
                    <p className="text-sm font-light">{user.username}</p>
                  </a>

                  <a
                    target="_blank"
                    href={`https://www.google.com/maps?q=${user.city},+${user.state},+${user.country}`}
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-house"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                    </svg>
                    <p className="text-lg font-light">
                      {checkLocation({
                        user: user,
                        nullStyles: "text-sm",
                        cityStyles: "text-sm font-light",
                        countryStyles: "text-sm text-[#bebebe96] font-light",
                      })}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full bg-[#282828]">
            <div className="w-full h-[60px] border-b-[1px] border-[#bebebe96]">
              <ul className="flex gap-10 h-full items-center justify-evenly container mx-auto">
                <li>
                  <button
                    onClick={() => setTab(1)}
                    className={`text-white text-[14px] md:text-lg font-bold`}
                  >
                    Reviews{" "}
                    <div
                      className={`h-[4px] bg-white transition-all rounded-full duration-300 ${
                        tab == 1 ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTab(2)}
                    className={`text-white text-[14px] md:text-lg font-bold`}
                  >
                    History{" "}
                    <div
                      className={`h-[4px] rounded-full bg-white transition-all duration-300 ${
                        tab == 2 ? "w-full" : "w-0"
                      }`}
                    />
                  </button>
                </li>
                {OwnerTab()}
              </ul>
            </div>
            <div className={`flex ${owner ? "w-[300%]" : "w-[200%]"}`}>
              <div
                style={
                  tab == 1
                    ? { transform: "translateX(0%)" }
                    : tab == 2
                    ? { transform: "translateX(-100%)" }
                    : { transform: "translateX(-200%)" }
                }
                className={`transition-all h-auto duration-300 w-[100%]`}
              >
                <UserReview user={user} />
              </div>
              <div
                style={
                  tab == 2
                    ? { transform: "translateX(-100%)" }
                    : tab == 3
                    ? { transform: "translateX(-200%)" }
                    : { transform: "translateX(0%)" }
                }
                className={`transition-all h-auto duration-300 w-[100%]`}
              >
                <UserHistory history={history} username={user.username} />
              </div>
              {SaveTab()}
            </div>
          </div>
          <div
            className={`w-full h-full ${
              dataFromChild.isPopUp ? "block" : "hidden"
            }`}
          >
            <div
              onClick={() => {
                document.body.style.overflow = "unset";
                dataFromChild.closePopUp();
              }}
              className="fixed top-0 left-0 w-full h-screen backdrop-blur-lg"
            />
            <BookInfoPopUp bookInfo={dataFromChild} />
            <div
              onClick={() => {
                dataFromChild.closePopUp();
                document.body.style.overflow = "unset";
              }}
              className="before:content-[''] before:w-2 before:bg-[#9b9b9b] before:rounded-b-md before:fixed before:left-[calc(50%-5px)] before:h-5 before:rotate-[45deg] before:bottom-10 md:before:bottom-4 after:content-[''] after:w-2 after:h-10 after:bg-[#9b9b9b] after:rounded-t-md after:fixed after:left-[calc(50%+5px)] after:bottom-10 md:after:bottom-4 after:h-5 after:rotate-[135deg] hover:before:rotate-[90deg] before:transition before:duration-300 after:transition after:duration-300 hover:after:rotate-[90deg] hover:after:transition hover:after:bg-white hover:before:bg-white"
            ></div>
          </div>

          <Toast
            visibility={
              dataFromChild.isSavedRemoveProcessEnabled ? "block" : "hidden"
            }
            background={dataFromChild.isError ? "bg-red-500" : "bg-green-500"}
            text={dataFromChild.responseMessage}
          />
        </section>
      );
    }
  }
}

export default UserProfile;


export const fetchUserDatas = async ({ username, setUserNotFound }) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/user/${username}/`
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 404) {
      setUserNotFound(true);
      return "User Not Found";
    } else {
      setUserNotFound(false);
      return null;
    }
  }
};

export const handleGender = ({ user, width, height }) => {
  const gender = String(user.gender).toLowerCase();

  if (gender === "m") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="currentColor"
        className="bi bi-gender-male text-[#339dff]"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
        />
      </svg>
    );
  } else if (gender === "f") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="currentColor"
        className="bi bi-gender-female text-[#ff7089]"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"
        />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="currentColor"
        className="bi bi-gender-neuter text-[#ffa400]"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V15.5a.5.5 0 0 1-1 0V9.975A5 5 0 0 1 3 5"
        />
      </svg>
    );
  }
};


export const checkLocation = ({
  user,
  nullStyles,
  cityStyles,
  countryStyles,
}) => {
  if (!user || !user.city || !user.state || !user.country) {
    return <span className={nullStyles}>Not provided</span>;
  } else {
    return (
      <span className={cityStyles}>
        {user.city}, {user.state},
        <span className={countryStyles}> {user.country}</span>
      </span>
    );
  }
};
