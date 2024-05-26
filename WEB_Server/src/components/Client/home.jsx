import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Recommend from "./Home/recommend";
import Search from "./Global/search";
import TopHead from "./Global/topHead";
import Gallery from "./Home/gallery";
import Location from "./Home/location";
import Rating from "./Home/rating";
import { UserContext } from "./Global/UserData";
import PreLoader from "./Global/PreLoader";
import Loader from "./Global/loader";
import Toast from "./Global/Toast";
import Footer from "./Global/Footer";
import SessionExpired from "./Global/SessionExpired";
import BookInfoPopUp from "./Book/bookInfoPopUp";
import Cookies from "js-cookie";

const Home = () => {
  const { DecodeUserData, isSessionExpired } = useContext(UserContext);
  const [bookInfoPopUp, setBookInfoPopUp] = useState({});
  const [isOpened, setIsOpened] = useState(false);
  const [libraryImage, setLibraryImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [isRatingPosting, setIsRatingPosting] = useState(false);
  const [ratingToastContent, setRatingToastContent] = useState({});
  const [popularBookData, setPopularBookData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        DecodeUserData().then(async (data) => {
          await fetchPopularBook(data ? data.uid : "all");
        });
        const [libraryImageData, ratingsData] = await Promise.all([
          fetchLibImage(),
          fetchRatings(),
        ]);

        setLibraryImage(libraryImageData);
        setRatings(ratingsData);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLibImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/library/image/`
      );
      const imageUrls = response.data.map((item) => item.image);

      return imageUrls;
    } catch (error) {
      return null;
    }
  };

  const fetchPopularBook = async (uid) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/popular/books/?u=${uid}`);
      setPopularBookData(response.data);
    } catch (error) {
      console.error('Error fetching popular book:', error);
      return null;
    }
  };
  
  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/rating/`
      );

      return response.data;
    } catch (error) {
      return null;
    }
  };

  const bookOpen = (data) => {
    setBookInfoPopUp(data);
  };

  const handleCloseSearch = () => {
    setIsOpened(false);
  };

  const handleOpenSearch = () => {
    setIsOpened(true);
  };

  const handleRatingData = (data) => {
    setRatingToastContent(data);
  };

  if (isLoading) {
    return <PreLoader />;
  } else {
    return (
      <>
        <Search close={handleCloseSearch} isOpen={isOpened} />
        <TopHead active_home={true} func={handleOpenSearch} />
        <Recommend
          thumbnail={popularBookData[0]?.book?.thumbnail}
          title={popularBookData[0]?.book?.title}
          genre={popularBookData[0]?.book?.genre.split("$")[0]}
          popularity={popularBookData[0]?.count}
          func={fetchPopularBook}
          OpenBook={bookOpen}
          fullData={popularBookData[0]}
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
        <Gallery libImg={libraryImage} />
        <Location />
        <Rating
          ratings={ratings}
          fetchRatings={fetchRatings}
          setIsRatingPosting={setIsRatingPosting}
          RatingCompoToastContent={handleRatingData}
        />
        {isRatingPosting && (
          <div className="fixed top-[50%] left-[50%] transform translate-x-[-50%] -translate-y-1/2 z-[100]">
            <Loader width="100px" SvgWidth="40px" />
          </div>
        )}
        <Toast
          text={ratingToastContent.message}
          visibility={ratingToastContent.isPopUp ? "block" : "hidden"}
          background={
            ratingToastContent.type === "success"
              ? "bg-green-500"
              : ratingToastContent.type === "semiError"
              ? "bg-[orange]"
              : "bg-red-500"
          }
        />
        <SessionExpired />
        <Footer />
      </>
    );
  }
};

export default Home;
