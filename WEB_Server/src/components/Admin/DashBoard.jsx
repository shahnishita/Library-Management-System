import React, { useEffect, useContext, useState } from "react";
import SideBar from "./Global/SideBar";
import { UserContext } from "../Client/Global/UserData";
import MainDashBoard from "./Dashboard/MainDashBoard";
import axios from "axios";
import PreLoader from "../Client/Global/PreLoader";
import NotFound from "../Client/Global/NotFound";
import Cookies from "js-cookie";
import SessionExpired from "../Client/Global/SessionExpired";

const DashBoard = () => {
  const { DecodeUserData, userInfo, setIsSessionExpired, isSessionExpired } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [recentRegisterLogs, setRecentRegisterLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      document.title = "Admin Dashboard - Library of Congress";
      try {
        await Promise.all([
          fetchStaffData(),
          DecodeUserData(),
          fetchRecentRegisterLogs(),
        ]);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userInfo.role) {
      Cookies.set("user_type", userInfo.role, { expires: 30 });
    }
  }, [userInfo.role]);

  const checkUserIsInStaffList = (username, uid, role) => {
    return staffList.some(
      (staff) =>
        staff.username === username &&
        staff.userUID === uid &&
        staff.role === role
    );
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admins/staffs/info/"
      );
      setStaffList(response.data);
    } catch (err) {
      throw new Error("Failed to fetch staff data");
    }
  };

  const fetchRecentRegisterLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admins/recent/log/"
      );
      setRecentRegisterLogs(response.data);
    } catch (err) {
      throw new Error("Failed to fetch recent register logs");
    }
  };

  if (isLoading) {
    return <PreLoader />;
  }

  if (
    !Cookies.get("remember") ||
    !localStorage.getItem("localData") ||
    !checkUserIsInStaffList(userInfo.username, userInfo.uid, userInfo.role)
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-grow">
        <MainDashBoard
          setIsSessionExpired={setIsSessionExpired}
          staffList={staffList}
          recentLog={recentRegisterLogs}
        />
      </div>

      <SessionExpired />
    </div>
  );
};

export default DashBoard;
