import React, { useContext } from "react";
import { UserContext } from "./UserData";
const SessionExpired = () => {
  const { isSessionExpired } = useContext(UserContext);
  return (
    <div className={`${isSessionExpired ? "animate-fireExpireObject" : "scale-0"}  transition-all flex justify-center  items-center z-50 fixed top-0 left-0 right-0 bottom-0 w-full h-full fixed`}>
      <div className="flex flex-col justify-evenly items-center px-5 py-3 w-[500px] h-[300px] rounded-xl shadow-2xl shadow-[#000000]/40 bg-white text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-exclamation-circle w-8 h-8 text-gray-600"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
        <h1 className="text-center text-xl md:text-2xl font-bold text-gray-600">
          Session Expired
        </h1>
        <p className="text-center text-sm md:text-base">
          You have been logged out due to session timeout.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-black text-white py-2 rounded-lg w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpired;
