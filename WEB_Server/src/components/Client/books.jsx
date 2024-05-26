import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./Global/UserData";
import Toast from "./Global/Toast";
import BookInfoPopUp from "./Book/bookInfoPopUp";
import Search from "./Global/search";
import TopHead from "./Global/topHead";
import Main from "./Book/BookView";
import PreLoader from "./Global/PreLoader";
import Footer from "./Global/Footer";


const Books = () => {
  const { userInfo, DecodeUserData } = useContext(UserContext);
  const { author, title, isAvailable } = useParams();
  const [books, setBooks] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [IsPreLoading, setIsPreLoading] = useState(true);
  const [ToastContentMain, setToastContentMain] = useState({});
  const [bookInfoPopUp, setBookInfoPopUp] = useState({});
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);


  useEffect(() => {
    setIsPreLoading(true); 
    const fetchData = async () => {
      try {
        DecodeUserData();
        if (author || title || isAvailable) {
          await fetchSearchBooks();
        } else {
          await fetchBooks();
        }
        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };
    fetchData();
  }, []);


  const fetchSearchBooks = async () => {
    try {

      const response = await axios.get(
        `http://localhost:8000/api/book/search/?a=${author}&t=${title}&i=${isAvailable}`
      );
      if (response.data.length === 0) {
        setIsSearchEmpty(true);
      } else {
        setBooks(response.data);
      }
    } catch (error) {
      return null;
    }
  };


  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/?u=${
          userInfo.uid || ""
        }`
      );
      setBooks(response.data);
    } catch (error) {
      return null;
    }
  };


  const ToastContentFromMain = (data) => {
    setToastContentMain(data);
  };

  const bookOpen = (data) => {
    setBookInfoPopUp(data);
  };

  const handleOpenSearch = () => {
    setIsOpened(true);
    document.body.style.overflow = "auto";
  };

  const handleCloseSearch = () => {
    setIsOpened(false);
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (bookInfoPopUp.isPopUp) {
      document.body.style.overflow = "hidden";
    }
  }, [bookInfoPopUp]);


  if (IsPreLoading) {
    return <PreLoader />;
  } else {
    return (
      <div>
        <Search close={handleCloseSearch} isOpen={isOpened} />
        <TopHead active_books={true} func={handleOpenSearch} />
        <Main
          func={fetchBooks}
          books={books}
          UserInfo={userInfo}
          ToastContent={ToastContentFromMain}
          OpenBook={bookOpen}
          compoTitle={author || title ? "Search Books" : ""}
        />
        <Toast
          visibility={ToastContentMain.isShow ? "block" : "hidden"}
          text={ToastContentMain.message}
          background={
            ToastContentMain.type === "success"
              ? "bg-green-500"
              : ToastContentMain.type === "info"
              ? "bg-blue-500"
              : "bg-red-500"
          }
        />
        <div
          className={`w-full h-full z-[] ${
            bookInfoPopUp.isPopUp ? "block" : "hidden"
          }`}
        >
          <div
            onClick={() => {
              document.body.style.overflow = "unset";
              bookInfoPopUp.closePopUp();
            }}
            className="z-[10] fixed top-0 left-0 w-full h-screen backdrop-blur-lg"
          />
          <BookInfoPopUp bookInfo={bookInfoPopUp} />
          <div
            onClick={() => {
              bookInfoPopUp.closePopUp();
              document.body.style.overflow = "unset";
            }}
            className="before:z-[10] before:content-[''] before:w-2 before:bg-[#9b9b9b] before:rounded-b-md before:fixed before:left-[calc(50%-5px)] before:h-5 before:rotate-[45deg] before:bottom-10 md:before:bottom-4 after:z-[10] after:content-[''] after:w-2 after:h-10 after:bg-[#9b9b9b] after:rounded-t-md after:fixed after:left-[calc(50%+5px)] after:bottom-10 md:after:bottom-4 after:h-5 after:rotate-[135deg] hover:before:rotate-[90deg] before:transition before:duration-300 after:transition after:duration-300 hover:after:rotate-[90deg] hover:after:transition hover:after:bg-white hover:before:bg-white"
          ></div>
        </div>
        <div
          className={`${
            isSearchEmpty ? "block" : "hidden"
          } bg-[#161616] text-center text-white min-h-[270px] flex items-center justify-center`}
        >
          No Books Found
        </div>
        <Footer />
      </div>
    );
  }
};

export default Books;
