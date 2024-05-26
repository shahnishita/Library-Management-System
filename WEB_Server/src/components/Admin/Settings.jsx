import React, { useEffect, useContext, useState, useCallback } from "react";
import SideBar from "./Global/SideBar";
import { UserContext } from "../Client/Global/UserData";
import PreLoader from "../Client/Global/PreLoader";
import axios from "axios";

const Settings = () => {
  const { DecodeUserData, userInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Account");
  const [staffID, setStaffID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      document.title = "Settings - Library of Congress";
      try {
        await DecodeUserData();
      } catch (error) {
        return null;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchStaffID();
      setIsLoading(false);
    };
    fetchData();
  }, [userInfo]);

  const fetchStaffID = async () => {
    try {
      if (userInfo?.username) {
        const response = await axios.get(
          `http://localhost:8000/admins/get/staff/id/?q=${userInfo.username}`
        );
        setStaffID(response.data.staffID);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return <PreLoader />;
  }

  return (
    <div className="flex">
      <SideBar activeSettingsTab={true} activeDashboardTab={false} />
      <div className="flex-grow">
        <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="col-span-3 flex flex-col gap-5">
              <h1 className="text-lg md:text-xl font-black bg-[#282828] py-3 flex items-center justify-center rounded-lg">
                Settings
              </h1>
              <ul className="flex bg-[#282828] py-2 text-sm md:text-md px-3 rounded-lg items-center justify-evenly">
                {["Account"].map((tab) => (
                  <li
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`${
                      activeTab === tab
                        ? "font-bold border-l-2 border-r-2 px-2"
                        : "border-l-0 border-r-0"
                    } transition-all duration-300 hover:bg-white hover:text-black cursor-pointer`}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg p-4">
                {activeTab === "Account" && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4">
                      Account Settings
                    </h2>
                    <form>
                      <div className="mb-4">
                        <label
                          htmlFor="staffID"
                          className="block text-sm font-medium"
                        >
                          Staff ID
                        </label>
                        <input
                          type="text"
                          id="staffID"
                          readOnly
                          value={staffID || ""}
                          className="outline-none w-full bg-[#282828] md:w-1/2  xl:w-1/3 text-white p-2 mt-2 rounded-md"
                        />
                      </div>
                    </form>
                  </div>
                )}
                {/* {activeTab === "Other" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Other Settings</h2>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
