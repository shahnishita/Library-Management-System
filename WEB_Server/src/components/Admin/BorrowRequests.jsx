import React, { useEffect, useContext, useState } from "react";
import SideBar from "./Global/SideBar";
import { UserContext } from "../Client/Global/UserData";
import axios from "axios";
import PreLoader from "../Client/Global/PreLoader";
import NotFound from "../Client/Global/NotFound";
import Content from "./BorrowRequest/Content";
import Loader from "../Client/Global/loader";
import Cookies from "js-cookie";

const BorrowRequests = () => {
  const { DecodeUserData, userInfo } = useContext(UserContext);
  const [isPreLoading, setIsPreLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [reqStatus, setReqStatus] = useState({
    request_status: "all",
  });
  const [borrowRequests, setBorrowRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsPreLoading(true);
      document.title = "Borrow Requests - Library of Congress";
      try {
        await DecodeUserData();
        await fetchBorrowRequests(reqStatus.request_status);
        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchBorrowRequests(reqStatus.request_status);
  }, [reqStatus]);

  const fetchBorrowRequests = async (status) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/admins/borrow/requests/?q=${status}`
      );
      setBorrowRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };

  const handleRequestStatusChange = (data) => {
    setReqStatus(data);
  };

  const nonStaffTypes = ["guest", "member", "VIP"];

  if (isPreLoading) {
    return <PreLoader />;
  }

  if (
    !Cookies.get("remember") ||
    !localStorage.getItem("localData") ||
    nonStaffTypes.includes(Cookies.get("user_type"))
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar activeReqTab={true} activeDashboardTab={false} />
      <div className="flex-grow">
        <Content
          send={handleRequestStatusChange}
          borrowRequests={borrowRequests}
          fetchBorrowRequests={fetchBorrowRequests}
        />
      </div>
      <div
        className={`${
          isLoading ? "block" : "hidden"
        } fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        <Loader SvgWidth="25px" width={"70px"} />
      </div>
    </div>
  );
};

export default BorrowRequests;
