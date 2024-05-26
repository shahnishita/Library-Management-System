import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Logo from "../../../assets/img/lmslogo.svg";
import PreLoader from "../Global/PreLoader";
import { EyeIcon, EyeSlashIcon } from "./signup";
import Cookies from "js-cookie";

const Login = () => {
  // Environment variables
  const PRCT_URL = import.meta.env.VITE_PRC_TOKEN;
  const PRT_URL = import.meta.env.VITE_PR_TOKEN;
  const TOKEN_REQ_CODE = import.meta.env.VITE_TOKEN_REQUEST_CODE;

  // State variables
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [LoginByEmailInfo, setLoginByEmailInfo] = useState({
    username: "",
    password: "",
  });
  const [LoginResponse, setLoginResponse] = useState({});
  const [isUsernameFieldEmpty, setIsUsernameFieldEmpty] = useState(false);
  const [isPasswordFieldEmpty, setIsPasswordFieldEmpty] = useState(false);

  const fetchLibImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/library/image/`
      );

      const randomIndex = Math.floor(Math.random() * response.data.length);
      setBackgroundImage(response.data[randomIndex].image);
    } catch (error) {
      return null;
    }
  };

  // Login function
  const login = async (e) => {
    e.preventDefault();

    if (LoginByEmailInfo.username === "") {
      setIsUsernameFieldEmpty(true);
      return;
    } else {
      setIsUsernameFieldEmpty(false);
    }
    if (LoginByEmailInfo.password === "") {
      setIsPasswordFieldEmpty(true);
      return;
    } else {
      setIsPasswordFieldEmpty(false);
    }

    const UsernameAndEmailRegex =
      /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(?:[a-zA-Z](?:[a-zA-Z0-9_]*))$/;
    if (!UsernameAndEmailRegex.test(LoginByEmailInfo.username)) {
      setLoginResponse({
        message: "Invalid characters in username or email",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    }

    try {
      const CSRFResponse = await axios.get(`${PRCT_URL}${TOKEN_REQ_CODE}/`);
      const CSRFToken = CSRFResponse.data.csrf_token;

      const TokenResponse = await axios.get(`${PRT_URL}${TOKEN_REQ_CODE}/`);
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/user/login/${CSRFToken}/${Token}/email/`,
        LoginByEmailInfo
      );

      setLoginResponse({
        message: response.data.message,
        type: response.data.status,
        sub_message: response.data.subMessage || "",
      });

      if (response.data.status === "success") {
        Cookies.set("remember", response.data.session, { expires: 30 });
        localStorage.setItem("localData", response.data.data);
        window.location.replace("/");
      }
    } catch (error) {
      setLoginResponse({
        message: error.response.data.message,
        type: error.response.data.status,
        sub_message: error.response.data.subMessage || "",
      });
    }
  };

  // Google login success callback
  const GoogleLoginOnSuccess = async (credentialResponse) => {
    if (Cookies.get("remember")) {
      return;
    }

    try {
      const CSRFResponse = await axios.get(`${PRCT_URL}${TOKEN_REQ_CODE}/`);
      const CSRFToken = CSRFResponse.data.csrf_token;
      const TokenResponse = await axios.get(`${PRT_URL}${TOKEN_REQ_CODE}/`);
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/user/login/${CSRFToken}/${Token}/google/`,
        credentialResponse
      );

      setLoginResponse({
        type: response.data.status,
        message: response.data.message,
        sub_message: response.data.subMessage || "",
      });

      if (response.data.status === "success") {
        Cookies.set("remember", response.data.session, { expires: 30 });
        localStorage.setItem("localData", response.data.data);
        window.location.replace("/");
      }
    } catch (error) {
      setLoginResponse({
        type: error.response.data.status,
        message: error.response.data.message,
        sub_message: error.response.data.subMessage || "",
      });
    }
  };

  useEffect(() => {
    if (Cookies.get("remember")) {
      setLoginResponse({
        type: "info",
        message: "You are already logged in.",
        sub_message: "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      await fetchLibImage();

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Password show/hide button
  const PasswordShowHide = () => {
    const eyeIcon = isPasswordShow ? <EyeSlashIcon /> : <EyeIcon />;
    return (
      <button
        className={`${
          isPasswordFieldEmpty ? "bg-red-500" : "bg-[grey]"
        } absolute left-0 top-[50%] px-3 py-[0.60rem] rounded-l-lg translate-y-[-45%]`}
        onClick={(e) => {
          e.preventDefault();
          setIsPasswordShow(!isPasswordShow);
        }}
      >
        {eyeIcon}
      </button>
    );
  };

  if (backgroundImage === null || isLoading) {
    return <PreLoader />;
  } else {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <section className="bg-[#161616] relative">
          <div className="absolute left-3 top-2 z-[1]">
            <a href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-house-fill  w-5 h-5 text-[#fff] hover:text-gray-300 transition-all"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
              </svg>
            </a>
          </div>
          <div className="lg:grid min-h-screen lg:grid-cols-12">
            {/* Left Section */}
            <section className="relative flex h-60 items-end lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                alt="background"
                src={backgroundImage}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 h-full w-full bg-[#00000050]" />

              <div className="hidden lg:relative lg:block lg:p-12">
                <a className="block text-white" href="/">
                  <span className="sr-only">Home</span>
                  <img className="h-16 w-auto" src={Logo} alt="logo" />
                </a>

                <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Welcome to PRAS
                </h2>

                <p className="mt-4 leading-relaxed text-white/90">
                  Smart assistant for library management. the best way to manage
                  your library.
                </p>
              </div>
            </section>

            {/* Right Section */}
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                {/* Logo and Description */}
                <div className="relative mb-14 -mt-16 block lg:hidden">
                  <a
                    className="border-t-2 inline-flex size-16 items-center justify-center rounded-full text-blue-600 sm:size-20 bg-[#161616]"
                    href="#"
                  >
                    <span className="sr-only">Home</span>
                    <img className="h-11 w-auto" src={Logo} alt="logo" />
                  </a>

                  <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl text-white">
                    Welcome to PRAS
                  </h1>

                  <p className="mt-4 leading-relaxed text-gray-400">
                    Smart assistant for library management. the best way to
                    manage your library.
                  </p>
                </div>

                {/* Google Login */}
                <div className="hidden lg:flex flex-col">
                  <div className="col-span-12 flex justify-center ">
                    <div className="relative w-auto h-auto">
                      {Cookies.get("remember") ? (
                        <div className="cursor-not-allowed absolute w-full top-0 left-0 h-[calc(100%+3px)] bg-transparent z-10" />
                      ) : (
                        ""
                      )}
                      <GoogleLogin
                        context="signin"
                        onSuccess={GoogleLoginOnSuccess}
                        onError={() => {
                          return null;
                        }}
                        theme="filled_blue"
                        text="signin_with"
                      />
                    </div>
                  </div>

                  <span className="relative flex justify-center mt-10 mb-10">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                    <span className="relative z-10 text-white bg-[#161616] px-6">
                      Or
                    </span>
                  </span>
                </div>

                {/* Login Form */}
                <form action="#" className="mt-8 grid grid-cols-12 gap-6">
                  {/* Email or Username */}
                  <div className="col-span-12">
                    <label
                      htmlFor="emailORusername"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Email or Username
                    </label>

                    <div className="relative">
                      <input
                        disabled={Cookies.get("remember") ? true : false}
                        placeholder="Enter Email or Username"
                        onChange={(e) =>
                          setLoginByEmailInfo({
                            ...LoginByEmailInfo,
                            username: e.target.value,
                          })
                        }
                        type="text"
                        id="emailORusername"
                        name="emailORusername"
                        className={`disabled:cursor-not-allowed mt-1 w-full pl-12 pr-3 py-[8px] outline-none rounded-lg rounded text-sm shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                      />
                      <div
                        className={`${
                          isUsernameFieldEmpty ? "bg-red-500" : "bg-[gray]"
                        } absolute left-0 top-[50%] px-[0.75rem] py-[0.60rem] rounded-l-lg translate-y-[-45%]`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-person-fill text-white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-span-12">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        onChange={(e) =>
                          setLoginByEmailInfo({
                            ...LoginByEmailInfo,
                            password: e.target.value,
                          })
                        }
                        disabled={Cookies.get("remember") ? true : false}
                        placeholder="Enter Password"
                        autoComplete="off"
                        type={isPasswordShow ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`disabled:cursor-not-allowed mt-1 w-full pl-12 pr-3 py-[8px] outline-none rounded-lg rounded text-sm shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                      />
                      {PasswordShowHide()}
                    </div>
                    <div className="max-w-[400px] mt-5 flex flex-wrap">
                      <p
                        className={`${
                          LoginResponse.type === "errorInfo"
                            ? "text-[orange]"
                            : LoginResponse.type === "error"
                            ? "text-red-500"
                            : LoginResponse.type === "successInfo"
                            ? "text-blue-500"
                            : "text-green-500"
                        } `}
                      >
                        {LoginResponse.message}{" "}
                        <span>
                          {LoginResponse.sub_message === "Forget Password" ? (
                            <a
                              className="text-white font-bold underline"
                              href="/account/password/reset"
                            >
                              {LoginResponse.sub_message}
                            </a>
                          ) : LoginResponse.sub_message === "Register" ? (
                            <a
                              className="text-white font-bold underline"
                              href="/signup"
                            >
                              {LoginResponse.sub_message}
                            </a>
                          ) : (
                            ""
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Login Button */}
                  <div className="mt-5 col-span-6 w-[210%] flex flex-col items-center sm:gap-4">
                    <button
                      disabled={Cookies.get("remember") ? true : false}
                      onClick={login}
                      className={`disabled:cursor-not-allowed disabled:opacity-80 inline-block shrink-0 rounded-md border-none bg-red-600 px-10 py-2 text-md font-medium text-white transition focus:outline-none active:text-white hover:bg-red-700 hover:text-white`}
                    >
                      Log in
                    </button>

                    <p className="mt-6 flex gap-1 text-sm sm:mt-0 text-gray-400">
                      Don't have an account?
                      <a href="/signup" className="underline text-gray-200">
                        Sign up
                      </a>
                      or{" "}
                      <a
                        href="/account/password/reset"
                        className="underline text-gray-200"
                      >
                        Forget Password
                      </a>
                    </p>
                  </div>
                </form>

                {/* Google Login for Mobile */}
                <div className=" lg:hidden flex flex-col">
                  <span className="relative flex justify-center mt-10 mb-10">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                    <span className="relative z-10 text-white bg-[#161616] px-6">
                      Or
                    </span>
                  </span>

                  <div className="col-span-12 flex justify-center">
                    <div className="relative w-auto h-auto">
                      {Cookies.get("remember") ? (
                        <div className="cursor-not-allowed absolute w-full top-0 left-0 h-[calc(100%+3px)] bg-transparent z-10" />
                      ) : (
                        ""
                      )}
                      <GoogleLogin
                        context="signin"
                        onSuccess={GoogleLoginOnSuccess}
                        onError={() => {
                          return null;
                        }}
                        theme="filled_blue"
                        text="signin_with"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </GoogleOAuthProvider>
    );
  }
};

export default Login;
