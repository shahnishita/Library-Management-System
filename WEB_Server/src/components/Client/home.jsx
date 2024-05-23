import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Recommend from "./Home/recommend"
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

const Home = () => {
  const { DecodeUserData, isSessionExpired } = useContext(UserContext);

  const [isOpened, setIsOpened] = useState(false);
  const [libraryImage, setLibraryImage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [isRatingPosting, setIsRatingPosting] = useState(false);
  const [ratingToastContent, setRatingToastContent] = useState({});

  console.log(isSessionExpired);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        DecodeUserData();
        const [libraryImageData, ratingsData] = await Promise.all([
          fetchLibImage(),
          fetchRatings()
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
          thumbnail="https://upload.wikimedia.org/wikipedia/en/8/87/Cursed_Child_new_poster.jpg"
          title="Harry Potter and the Cursed Child"
          genre="Fiction"
          search="80"
        />
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
