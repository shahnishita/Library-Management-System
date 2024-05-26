import React from "react";
import StaffConfirmation from "./staff/staffConfirmation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./loader.css";
import Cookies from "js-cookie";

const StaffSignup = () => {
  if (Cookies.get("staff_code") === null || Cookies.get("staff_code") === "" || Cookies.get("staff_code") === undefined) {
    return (
      <div>
        <StaffConfirmation />
      </div>
    );
  } else if (
    Cookies.get("staff_code") === import.meta.env.VITE_STAFF_CODE
  ) {


    const [terminalLine, setTerminalLine] = useState({
      username: "",
      email: "",
      gender: "",
    });

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "icloud.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "yandex.com",
      "inbox.com",
      "gmx.com",
      "rediffmail.com",
      "live.com",
      "me.com",
      "rocketmail.com",
      "fastmail.com",
      "att.net",
      "cox.net",
      "verizon.net",
      "earthlink.net",
      "mail.ru",
      "163.com",
      "126.com",
      "qq.com",
      "sina.com",
    ];

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isResponseError, setIsResponseError] = useState(false);
    const [Response, setResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRedOrLime, setIsRedOrLime] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const PRT_URL = import.meta.env.VITE_PR_TOKEN;
    const PRCT_URL = import.meta.env.VITE_PRC_TOKEN;
    const TOKEN_REQ_CODE = import.meta.env.VITE_TOKEN_REQUEST_CODE;

    useEffect(() => {
      usernameRef.current.focus();
    }, []);

    return (
      <div className="bg-gradient-to-b from-indigo-500 to-gray-400 h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full h-screen md:w-[80%]  mx-auto md:h-[450px] relative  md:rounded-b-lg bg-[#282828ab]">
          <div className="w-full h-6 bg-[#282828] flex items-center justify-center">
            <p className="select-none text-white font-bold text-[12px] justify-center flex gap-2 items-center">
              Terminal <span className="text-[10px]">◉</span> Staff Signup
            </p>
          </div>
          <div
            className={`${
              isLoading ? "cursor-wait" : "cursor-auto"
            } w-full h-[calc(100%-1.5rem)] px-2`}
          >
            <div className="flex w-full gap-2">
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <span
                  className={`${
                    isUsernameEmpty
                      ? "text-[#EE0000]"
                      : !isUsernameValid
                      ? "text-[orange]"
                      : "text-white"
                  } select-auto`}
                >
                  username:{" "}
                </span>
              </p>
              <input
                onChange={(e) => {
                  setTerminalLine({
                    ...terminalLine,
                    username: e.target.value,
                  });
                }}
                type="text"
                ref={usernameRef}
                className="p-0 bg-transparent text-white outline-none lowercase"
              />
            </div>

            <div className="flex w-full gap-2">
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <span
                  className={`${
                    isEmailEmpty
                      ? "text-[#EE0000]"
                      : !isEmailValid
                      ? "text-[orange]"
                      : "text-white"
                  } select-auto`}
                >
                  email:{""}
                </span>
              </p>
              <input
                onChange={(e) => {
                  setTerminalLine({
                    ...terminalLine,
                    email: e.target.value,
                  });
                }}
                type="email"
                ref={emailRef}
                className="p-0 bg-transparent text-white outline-none lowercase"
              />
            </div>
            <div className="flex w-full gap-2">
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <span
                  className={`${
                    isEmailEmpty
                      ? "text-[#EE0000]"
                      : !isEmailValid
                      ? "text-[orange]"
                      : "text-white"
                  } select-auto`}
                >
                  gender:{""}
                </span>
              </p>
              <select
                onChange={(e) => {
                  setTerminalLine({
                    ...terminalLine,
                    gender: e.target.value,
                  });
                }}
                className="bg-transparent text-white outline-none lowercase"
              >
                <option className="text-black" value="O">Other</option>
                <option className="text-black" value="M">Male</option>
                <option className="text-black" value="F">Female</option>
              </select>
            </div>
            <div className={`flex w-full gap-2`}>
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <button
                  onClick={async () => {
                    if (
                      terminalLine.username == "" ||
                      terminalLine.email == ""
                    ) {
                      setIsUsernameEmpty(true);
                      setIsEmailEmpty(true);
                      return;
                    } else {
                      setIsUsernameEmpty(false);
                      setIsEmailEmpty(false);
                    }

                    if (terminalLine.email.includes("@") == false) {
                      setIsEmailValid(false);
                      return;
                    } else {
                      if (
                        !allowedDomains.some((domain) =>
                          terminalLine.email.endsWith(domain)
                        )
                      ) {
                        setIsEmailValid(false);
                        return;
                      } else {
                        setIsEmailValid(true);
                      }
                    }

                    if (!usernameRegex.test(terminalLine.username)) {
                      setIsUsernameValid(false);
                      setIsResponseError(true);
                      setTimeout(() => {
                        setIsResponseError(false);
                      }, 3000);
                      setIsRedOrLime(false);
                      setResponse({
                        message:
                          "Username contains invalid characters. Only letters, numbers, underscores (_), and hyphens (-) are allowed.",
                      });
                      return;
                    } else {
                      setIsRedOrLime(true);
                      setIsResponseError(false);
                      setIsUsernameValid(true);
                      setResponse("");
                    }

                    if (!emailRegex.test(terminalLine.email)) {
                      setIsEmailValid(false);
                      setIsRedOrLime(false);
                      setIsResponseError(true);
                      setTimeout(() => {
                        setIsResponseError(false);
                      }, 3000);
                      setResponse({
                        message:
                          "Email contains invalid characters or is in an invalid format.",
                      });
                      return;
                    } else {
                      setIsRedOrLime(true);
                      setIsResponseError(false);
                      setIsEmailValid(true);
                      setResponse("");
                    }

                    try {
                      setIsLoading(true);

                      const CSRFResponse = await axios.get(
                        `${PRCT_URL}${TOKEN_REQ_CODE}/`
                      );
                      const CSRFToken = CSRFResponse.data.csrf_token;

                      const TokenResponse = await axios.get(
                        `${PRT_URL}${TOKEN_REQ_CODE}/`
                      );
                      const Token = TokenResponse.data.token;
                      const response = await axios.post(
                        `http://localhost:8000/api/staff/signup/${CSRFToken}/${Token}/`,
                        terminalLine
                      );

                      if (response) {
                        setIsRedOrLime(true);
                        setIsLoading(false);
                        setIsResponseError(true);
                        setTimeout(() => {
                          setIsResponseError(false);
                          window.location.replace('http://localhost:5173/');
                        }, 3000);
                        setResponse(response.data);
                      }
                    } catch (error) {
                      setIsLoading(false);
                      setIsRedOrLime(false);
                      setIsResponseError(true);
                      setTimeout(() => {
                        setIsResponseError(false);
                      }, 3000);
                      if (error.response) {
                        setResponse(error.response.data);
                      } else {
                        setResponse(error);
                      }
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-bar-right text-white"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                    />
                  </svg>
                </button>
              </p>
            </div>

            
            <div
              className={`absolute top-0 right-1 ${
                isLoading ? "block" : "hidden"
              }`}
            >
              <Loading />
            </div>
          </div>
          <div
            className={`${
              isResponseError ? "h-[40%] md:h-6" : "h-0"
            } text-white transition-all duration-300 w-full rounded-t-lg md:rounded-t-none md:rounded-b-lg bg-[#282828] text-[14px] absolute bottom-0 left-0 flex items-start py-2 md:py-0 md:items-center px-2 lowercase font-mono ${
              isRedOrLime ? "text-[lime]" : "text-[#EE0000]"
            }  `}
          >
            <p
              className={`${
                isResponseError ? "block" : "hidden"
              } flex gap-1 items-center`}
            >
              <span className={` text-[lime] text-[15px] select-none`}>➣</span>
              <span
                className={`${isRedOrLime ? "text-[lime]" : "text-[#EE0000]"}`}
              >
                {Response.message}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default StaffSignup;

export const Loading = () => {
  return (
    <div className={`spinner relative w-6 h-6 inline-block rounded`}>
      <div className="bar1"></div>
      <div className="bar2"></div>
      <div className="bar3"></div>
      <div className="bar4"></div>
      <div className="bar5"></div>
      <div className="bar6"></div>
      <div className="bar7"></div>
      <div className="bar8"></div>
      <div className="bar9"></div>
      <div className="bar10"></div>
      <div className="bar11"></div>
      <div className="bar12"></div>
    </div>
  );
};
