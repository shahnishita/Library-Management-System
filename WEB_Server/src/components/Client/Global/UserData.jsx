import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const fetchUserData = async (uid = userInfo.uid) => {
    localStorage.removeItem("localData");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/data/${uid}/`
      );
      setIsLoggedIn(true);
      localStorage.setItem("localData", response.data.data);
      window.location.reload();
    } catch (err) {
      console.error("Failed to fetch user data", err);
      return null;
    }
  };

  const fetchNotifications = async (username) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/u/notifications/?q=${username}`
      );
      setNotifications(response.data);
    } catch (error) {
      return null;
    }
  };

  const DecodeUserData = async (data = localStorage.getItem("localData")) => {
    if (!data) {
      return null;
    }

    const decodedToken = jwtDecode(data);
    setUserInfo(decodedToken);
    Cookies.set("user_type", decodedToken.role, { expires: 30 });

    if (
      decodedToken.reviews &&
      decodedToken.reviews.rating &&
      decodedToken.reviews.ratingMessage
    ) {
      setIsReviewed(true);
    } else {
      setIsReviewed(false);
    }

    if (Cookies.get("remember")) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/session/verify/?q=${Cookies.get(
            "remember"
          )}`
        );
      } catch (error) {
        if (error.response.data.status === "expired") {
          setIsSessionExpired(true);
          Cookies.remove("remember");
        }
      }
    }

    return decodedToken;
  };

  useEffect(() => {
    const localData = localStorage.getItem("localData");
    const remember = Cookies.get("remember");

    if (remember && localData) {
      setIsLoggedIn(true);
      DecodeUserData(localData);
    } else {
      setIsLoggedIn(false);
      Cookies.set("user_type", "guest", { expires: 30 });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        setUserInfo,
        userInfo,
        isLoggedIn,
        DecodeUserData,
        isReviewed,
        fetchUserData,
        fetchNotifications,
        notifications,
        isSessionExpired,
        setIsSessionExpired
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
