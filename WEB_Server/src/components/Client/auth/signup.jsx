import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../../../assets/img/lmslogo.svg";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PreLoader from "../Global/PreLoader";
import Cookies from "js-cookie";

const SignUp = () => {
  const PRCT_URL = import.meta.env.VITE_PRC_TOKEN;
  const PRT_URL = import.meta.env.VITE_PR_TOKEN;
  const TOKEN_REQ_CODE = import.meta.env.VITE_TOKEN_REQUEST_CODE;

  const [backgroundImage, setBackgroundImage] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [SignUpByEmailInfo, setSignUpByEmailInfo] = useState({
    username: "",
    gender: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [Passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [SignUpResponse, setSignUpResponse] = useState({});
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const signup = async (e) => {
    e.preventDefault();
    if (
      SignUpByEmailInfo.username === "" ||
      SignUpByEmailInfo.email === "" ||
      SignUpByEmailInfo.first_name === "" ||
      SignUpByEmailInfo.last_name === ""
    ) {
      setSignUpResponse({
        message: "Please fill all the fields",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(SignUpByEmailInfo.email)) {
      setSignUpResponse({
        message: "Invalid email format",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    }

    const nameRegex = /^[a-zA-Z]+(?:['-][a-zA-Z]+)?$/;
    if (
      !nameRegex.test(SignUpByEmailInfo.first_name) ||
      !nameRegex.test(SignUpByEmailInfo.last_name)
    ) {
      setSignUpResponse({
        message: "Invalid first name or last name format",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    }

    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    if (!usernameRegex.test(SignUpByEmailInfo.username)) {
      setSignUpResponse({
        message: "Invalid username format",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    }

    if (
      !SignUpByEmailInfo.password.length >= 8 ||
      !/(?=.*[!@#$%^&*<>?])/.test(SignUpByEmailInfo.password) ||
      !/(?=.*[0-9])/.test(SignUpByEmailInfo.password) ||
      !/(?=.*[A-Z])/.test(SignUpByEmailInfo.password) ||
      !/(?=.*[a-z])/.test(SignUpByEmailInfo.password)
    ) {
      return;
    }

    if (!isTermsChecked) {
      setSignUpResponse({
        message: "Please accept the terms and conditions",
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

      await axios
        .post(
          `http://127.0.0.1:8000/user/signup/${CSRFToken}/${Token}/email/`,
          SignUpByEmailInfo
        )
        .then((response) => {
          setSignUpResponse({
            message: response.data.message,
            type: response.data.status,
            sub_message: response.data.subMessage || "",
          });
        });
    } catch (error) {
      setSignUpResponse({
        message: error.response.data.message,
        type: error.response.data.status,
        sub_message: error.response.data.subMessage || "",
      });
      return null;
    }
  };

  useEffect(() => {
    if (Passwords.password !== Passwords.confirmPassword) {
      setSignUpResponse({
        message: "Passwords do not match",
        type: "errorInfo",
        sub_message: "",
      });
      return;
    } else {
      setSignUpByEmailInfo({
        ...SignUpByEmailInfo,
        password: Passwords.password,
      });
      setSignUpResponse({
        message: "",
        type: "",
      });
    }
  }, [Passwords]);

  useEffect(() => {
    if (Cookies.get("remember")) {
      setIsLoggedIn(true);
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

  const PasswordShowHIde = () => {
    const eyeIcon = isPasswordShow ? <EyeSlashIcon /> : <EyeIcon />;
    return (
      <button
        className="bg-[grey] absolute left-0 top-[50%] px-3 py-[0.60rem] rounded-l-lg translate-y-[-45%]"
        onClick={(e) => {
          e.preventDefault();
          setIsPasswordShow(!isPasswordShow);
        }}
      >
        {eyeIcon}
      </button>
    );
  };

  const handleTermsCheck = () => {
    setIsTermsChecked(!isTermsChecked);
  };

  const GoogleSignUpOnSuccess = async (credentialResponse) => {
    const CSRFResponse = await axios.get(`${PRCT_URL}${TOKEN_REQ_CODE}/`);
    const CSRFToken = CSRFResponse.data.csrf_token;
    const TokenResponse = await axios.get(`${PRT_URL}${TOKEN_REQ_CODE}/`);
    const Token = TokenResponse.data.token;

    try {
      await axios
        .post(
          `http://127.0.0.1:8000/user/signup/${CSRFToken}/${Token}/google/`,
          credentialResponse
        )
        .then((response) => {
          setSignUpResponse({
            type: response.data.status,
            message: response.data.message,
            sub_message: response.data.subMessage || "",
          });
        });
    } catch (error) {
      setSignUpResponse({
        type: error.response.data.status,
        message: error.response.data.message,
        sub_message: error.response.data.subMessage || "",
      });
    }
  };

  useEffect(() => {
    if (Cookies.get("remember")) {
      setSignUpResponse({
        type: "info",
        message: "You are already logged in.",
        sub_message: "",
      });
    }
  }, []);

  if (backgroundImage === null || isLoading) {
    return <PreLoader />;
  } else {
    return (
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

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-4 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
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
                  Smart assistant for library management. the best way to manage
                  your library.
                </p>
              </div>

              <div className="hidden lg:flex flex-col">
                <div className="col-span-12 flex justify-center">
                  <div className="relative w-auto h-auto">
                    {Cookies.get("remember") ? (
                      <div className="cursor-not-allowed absolute w-full top-0 left-0 h-[calc(100%+3px)] bg-transparent z-10" />
                    ) : (
                      ""
                    )}
                    <GoogleOAuthProvider
                      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                    >
                      <GoogleLogin
                        context="signup"
                        onSuccess={GoogleSignUpOnSuccess}
                        onError={() => {
                          return null;
                        }}
                        theme="filled_blue"
                        text="signup_with"
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>

                <span className="relative flex justify-center mt-10 mb-0">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                  <span className="relative z-10 text-white bg-[#161616] px-6">
                    Or
                  </span>
                </span>
              </div>

              <form
                className={`${
                  isFocused ? "md:h-10 h-auto" : "h-auto"
                } transition-all duration-300 overflow-hidden mt-8 grid grid-cols-6 gap-6`}
              >
                <div
                  className={`${
                    isFocused ? "md:flex hidden" : "hidden"
                  } relative col-span-6 bg-[#282828] h-10 shadow-lg rounded-md overflow-hidden items-center justify-center`}
                >
                  <span className="font-bold text-gray-400 text-md">
                    Account Info
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="absolute right-2 bg-transparent p-[3px] rounded-md transition-all duration-300 hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-caret-down-fill text-white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                  </button>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {" "}
                    Username{" "}
                  </label>

                  <input
                    onChange={(e) =>
                      setSignUpByEmailInfo({
                        ...SignUpByEmailInfo,
                        username: e.target.value,
                      })
                    }
                    disabled={isLoggedIn ? true : false}
                    autoComplete="off"
                    type="text"
                    id="username"
                    name="username"
                    className={`${
                      isLoggedIn ? "cursor-not-allowed" : ""
                    } mt-1 w-full px-2 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {" "}
                    Gender{" "}
                  </label>

                  <select
                    defaultValue={"O"}
                    onChange={(e) =>
                      setSignUpByEmailInfo({
                        ...SignUpByEmailInfo,
                        gender: e.target.value,
                      })
                    }
                    disabled={isLoggedIn ? true : false}
                    autoComplete="off"
                    id="gender"
                    name="gender"
                    className={`${
                      isLoggedIn ? "cursor-not-allowed" : ""
                    } mt-1 w-full px-2 py-[8px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                  >
                    <option value="O">Other</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-200"
                  >
                    First Name
                  </label>

                  <input
                    onChange={(e) =>
                      setSignUpByEmailInfo({
                        ...SignUpByEmailInfo,
                        first_name: e.target.value,
                      })
                    }
                    disabled={isLoggedIn ? true : false}
                    autoComplete="off"
                    type="text"
                    id="FirstName"
                    name="first_name"
                    className={`${
                      isLoggedIn ? "cursor-not-allowed" : ""
                    } mt-1 w-full px-2 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="LastName"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Last Name
                  </label>

                  <input
                    onChange={(e) =>
                      setSignUpByEmailInfo({
                        ...SignUpByEmailInfo,
                        last_name: e.target.value,
                      })
                    }
                    disabled={isLoggedIn ? true : false}
                    autoComplete="off"
                    type="text"
                    id="LastName"
                    name="last_name"
                    className={`${
                      isLoggedIn ? "cursor-not-allowed" : ""
                    } mt-1 w-full px-2 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    onChange={(e) =>
                      setSignUpByEmailInfo({
                        ...SignUpByEmailInfo,
                        email: e.target.value,
                      })
                    }
                    disabled={isLoggedIn ? true : false}
                    autoComplete="off"
                    type="email"
                    id="Email"
                    name="email"
                    className={`${
                      isLoggedIn ? "cursor-not-allowed" : ""
                    } mt-1 w-full px-2 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                  />
                </div>
              </form>
              <form action="#" className="mt-6 grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <div className="relative">
                    <input
                      onChange={(e) =>
                        setPasswords({ ...Passwords, password: e.target.value })
                      }
                      disabled={isLoggedIn ? true : false}
                      autoComplete="off"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      type={isPasswordShow ? "text" : "password"}
                      id="Password"
                      name="password"
                      className={`${
                        isLoggedIn ? "cursor-not-allowed" : ""
                      } mt-1 w-full pl-12 pr-3 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                    />
                    {PasswordShowHIde()}
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="PasswordConfirmation"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Password Confirmation
                  </label>

                  <div className="relative">
                    <input
                      onChange={(e) =>
                        setPasswords({
                          ...Passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={isLoggedIn ? true : false}
                      autoComplete="off"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      type={isPasswordShow ? "text" : "password"}
                      id="PasswordConfirmation"
                      name="password_confirmation"
                      className={`${
                        isLoggedIn ? "cursor-not-allowed" : ""
                      } mt-1 w-full px-2 py-[6px] outline-none rounded-lg rounded text-md shadow-sm border-gray-700 bg-[#282828] text-gray-200`}
                    />
                  </div>
                </div>

                <div className="col-span-6">
                  <label htmlFor="TermsAccept" className="flex gap-4">
                    <input
                      onChange={handleTermsCheck}
                      type="checkbox"
                      id="TermsAccept"
                      name="TermsAccept"
                      disabled={isLoggedIn ? true : false}
                      className={`${
                        isLoggedIn ? "cursor-not-allowed" : ""
                      } size-5 rounded-md border-gray-200 bg-white shadow-sm`}
                    />

                    <p className="text-sm text-white">
                      By creating an account, you agree to our
                      <a href="#" className="text-red-400 underline">
                        {" "}
                        terms and conditions{" "}
                      </a>
                      and
                      <a href="#" className="text-red-400 underline">
                        {" "}
                        privacy policy
                      </a>
                      .
                    </p>
                  </label>
                  <div
                    className={`${
                      isFocused ? "h-auto" : "h-0"
                    } transition-all duration-300 overflow-hidden col-span-6 text-white mt-5 flex flex-col gap-1`}
                  >
                    <div className="flex gap-4 items-center">
                      {Passwords.password.length >= 8 ? <Checked /> : <Check />}
                      <p>Password must be at least 8 characters long</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      {/(?=.*[!@#$%^&*<>?])/.test(Passwords.password) ? (
                        <Checked />
                      ) : (
                        <Check />
                      )}
                      <p>At least one special character</p>
                    </div>

                    <div className="flex gap-4 items-center">
                      {/(?=.*[0-9])/.test(Passwords.password) ? (
                        <Checked />
                      ) : (
                        <Check />
                      )}
                      <p>At least one number</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      {/(?=.*[A-Z])/.test(Passwords.password) ? (
                        <Checked />
                      ) : (
                        <Check />
                      )}
                      <p>At least one uppercase</p>
                    </div>
                    <div className="flex gap-4 items-center">
                      {/(?=.*[a-z])/.test(Passwords.password) ? (
                        <Checked />
                      ) : (
                        <Check />
                      )}
                      <p>At least one lowercase</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 mt-0 flex flex-wrap">
                  <p
                    className={`${
                      SignUpResponse.type === "errorInfo"
                        ? "text-[orange]"
                        : SignUpResponse.type === "error"
                        ? "text-red-500"
                        : SignUpResponse.type === "successInfo"
                        ? "text-blue-500"
                        : "text-green-500"
                    } `}
                  >
                    {SignUpResponse.message}{" "}
                    <span>
                      {SignUpResponse.sub_message === "Forget Password" ? (
                        <a
                          className="text-white font-bold underline"
                          href="/account/password/reset"
                        >
                          {SignUpResponse.sub_message}
                        </a>
                      ) : SignUpResponse.sub_message === "Login" ? (
                        <a
                          className="text-white font-bold underline"
                          href="/login"
                        >
                          {SignUpResponse.sub_message}
                        </a>
                      ) : (
                        ""
                      )}
                    </span>
                  </p>
                </div>
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    disabled={isLoggedIn ? true : false}
                    onClick={signup}
                    className={`${
                      isLoggedIn
                        ? "bg-red-600/60 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 hover:text-white"
                    } inline-block shrink-0 rounded-md border-none px-10 py-2 text-md font-medium text-white transition focus:outline-none active:text-white`}
                  >
                    Sign up
                  </button>

                  <p className="mt-6 flex gap-1 text-sm sm:mt-0 text-gray-400">
                    Already have an account?
                    <a href="/login" className="underline text-gray-200">
                      Log in
                    </a>
                  </p>
                </div>
              </form>
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
                    <GoogleOAuthProvider
                      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                    >
                      <GoogleLogin
                        context="signup"
                        onSuccess={GoogleSignUpOnSuccess}
                        onError={() => {
                          return null;
                        }}
                        theme="filled_blue"
                        text="signup_with"
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>
    );
  }
};

export default SignUp;

export const EyeSlashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-eye-slash-fill text-white"
      viewBox="0 0 16 16"
    >
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
    </svg>
  );
};

export const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-eye-fill text-white"
      viewBox="0 0 16 16"
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
    </svg>
  );
};

export const Check = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-check-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
    </svg>
  );
};

export const Checked = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-check-circle-fill text-green-500"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </svg>
  );
};
