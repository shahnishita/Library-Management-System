import React, { useEffect, useContext } from "react";
import { UserContext } from "./Client/Global/UserData";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const HandleQrRequest = () => {
  const { DecodeUserData, userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    if (Cookies.get("remember")) {
      DecodeUserData();
    }
  }, []);

  if (userInfo) {
    const NonOfficialRoles = ["Member", "VIP"];

    if (NonOfficialRoles.includes(userInfo.role)) {
      return <Error />;
    } else {
      window.location.href = `/admin/book/update/${id}`;
    }
  }
};

export default HandleQrRequest;

export const Error = () => {
  return (
    <div className="w-full h-screen bg-[#161616] text-white gap-4 flex flex-col justify-center items-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
        Sorry, You don't have permission to access this page
      </p>
      <p className="text-sm sm:text-md md:text-lg text-center">
        You are not authorized to access this page.{" "}
        <span className="text-blue-400 cursor-pointer hover:text-blue-600">
          <a href="/">Go back to Homepage</a>
        </span>
      </p>
    </div>
  );
};
