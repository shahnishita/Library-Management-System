import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Search from "./Global/search";
import TopHead from "./Global/topHead";
import { UserContext } from "./Global/UserData";
import PreLoader from "./Global/PreLoader";


const Notifications = () => {
  const { DecodeUserData, notifications, userInfo, fetchNotifications } = useContext(UserContext);
  const [isOpened, setIsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        DecodeUserData();

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseSearch = () => {
    setIsOpened(false);
  };

  const handleOpenSearch = () => {
    setIsOpened(true);
  };

  if (isLoading) {
    return <PreLoader />;
  } else {
    return (
      <>
        <Search close={handleCloseSearch} isOpen={isOpened} />
        <TopHead active_notifications={true} func={handleOpenSearch} />
        <Body fetchNotifications={fetchNotifications} notifications={notifications} userInfo={userInfo} />
      </>
    );
  }
};

export default Notifications;

export const Body = ({ notifications, userInfo, fetchNotifications }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unreadNotifications = notifications.reduce((count, group) => {
      return (
        count +
        group.notifications.filter((notification) => !notification.is_read)
          .length
      );
    }, 0);

    setUnreadCount(unreadNotifications);
  }, [notifications]);

  const getTimeDifference = (tine) => {
    const currentTime = new Date();
    const diffInMilliseconds = Math.abs(currentTime - new Date(tine));
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return "Just now";
    }
  };

  const markAllAsRead = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/u/notifications/?q=${userInfo.username}&m=all`);

        if (response.status === 200) {
            fetchNotifications({username: userInfo.username})
        }

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <section className="bg-[#161616] min-h-screen h-full">
      <div className="px-4 md:px-0 container lg:w-3/5 mx-auto text-white pt-5">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold mt-3 mb-5">
            Notifications{" "}
            <span className="px-2 py-.5 rounded-md bg-[#EE0000]">
              {unreadCount}
            </span>
          </p>
          <button onClick={markAllAsRead} className="font-light hover:text-gray-400 transition-all duration-200">
            Mark all as read
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {notifications.map((group) =>
            group.notifications.slice(0, 20).map((notification, index) => (
              <div
                key={index}
                className="flex rounded-lg shadow-lg gap-4 bg-[#222222] px-4 py-3 overflow-hidden"
              >
                <img
                  className="rounded-full h-[45px]"
                  src={notification.notification_from.profile_pic_url}
                  alt={notification.notification_from.username}
                />
                <div className="flex flex-col w-full gap-4">
                  <div className="flex flex-col gap-.5">
                    <p className="flex gap-2 text-gray-300 text-md">
                      From{" "}
                      <a
                        target="_blank"
                        href={`/u/${notification.notification_from.username}`}
                        className="font-bold text-white relative"
                      >
                        {" "}
                        {notification.notification_from.first_name +
                          " " +
                          notification.notification_from.last_name}
                        <span
                          className={`${
                            notification.is_read ? "hidden" : ""
                          } absolute top-1 -right-4 inline-flex size-2 rounded-full bg-red-400`}
                        ></span>
                      </a>
                    </p>

                    <p className="text-gray-300 text-sm">
                      {getTimeDifference(notification.created_at)}
                    </p>
                  </div>
                  <div className="transition-all duration-200 border-2 border-[#353535] hover:border-[white]/70 hover:bg-[#303030] px-4 py-3 rounded-lg">
                    <p className="text-[14.5px]">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
