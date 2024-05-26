import React, { useState, useContext } from "react";
import axios from "axios";
import StarRating from "./subComponents/star";
import RatingDistribution from "./subComponents/ratingDistribution";
import RatingSubmissionForm from "./subComponents/ratingsub";
import { UserContext } from "../Global/UserData";

const Rating = ({
  ratings,
  fetchRatings,
  setIsRatingPosting,
  RatingCompoToastContent,
}) => {
  const { userInfo, isLoggedIn, isReviewed, fetchUserData } = useContext(UserContext);
  const [isReviewPage, setIsReviewPage] = useState(false);

  const ToastContentFromSubCompo = (content) => {
    RatingCompoToastContent({
      isPopUp: content.isPopUp,
      message: content.message,
      type: content.type,
    });
  };

  const UserCanRateOrNot = () => {
    if (isReviewed) {
      return (
        <div className="flex flex-wrap justify-center items-center py-5 text-white">
          You have already rated this library
        </div>
      );
    } else {
      if (isLoggedIn) {
        return (
          <ReviewForm
            handleSubmitRating={handleSubmitRating}
            fetchRatings={fetchRatings}
            setIsReviewPage={setIsReviewPage}
            userInfo={userInfo}
            setIsRatingPosting={setIsRatingPosting}
            send={ToastContentFromSubCompo}
            fetchUserData={fetchUserData}
          />
        );
      } else {
        return (
          <div className="flex flex-wrap justify-center items-center py-5 text-white">
            Login to rate this library
          </div>
        );
      }
    }
  };

  const ChangeReviewPage = () => {
    setIsReviewPage(!isReviewPage);
  };

  const handleSubmitRating = (e, rating) => {
    e.preventDefault();
  };

  const calculateOverallRating = () => {
    if (ratings === null) {
      return;
    }
    let totalRating = 0;
    ratings.forEach((item) => {
      const rating = item.rating;
      totalRating += rating;
    });
    const overallRating = totalRating / ratings.length;
    return overallRating.toFixed(1);
  };

  return (
    <div>
      <section className="hidden lg:grid grid-cols-12">
        <section className="flex flex-col col-span-6 px-10 py-9 bg-[#161616] h-[600px] flex justify-center">
          <div className="px-10 py-8 gap-5 flex flex-col text-white">
            <h1 className="text-3xl font-bold">User Ratings</h1>
            <div className="flex justify-start">
              <div className="flex flex-col gap-10 justify-center">
                <div className="flex gap-10 justify-start items-center">
                  <div className="flex gap-4 justify-center items-center">
                    <StarRating
                      starHeight={20}
                      starWidth={20}
                      styles={"flex justify-center"}
                      overallRating={calculateOverallRating()}
                    />
                    <h1 className="mt-[3px] text-xl">
                      {calculateOverallRating()}
                    </h1>
                  </div>
                  <h1 className="text-xl font-bold mt-[3px]">
                    Total Ratings: {ratings === null ? 0 : ratings.length}
                  </h1>
                </div>
                <RatingDistribution ratings={ratings} />
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center col-span-6 flex flex-col justify-center text-white bg-[#161616] h-[600px] px-12 py-6">
          <div className="bg-[#121212] px-20 py-14 rounded-xl gap-5 flex flex-col">
            <a
              className={`flex justify-center ${isLoggedIn ? "hidden" : ""}`}
              href="/login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className={`bi bi-box-arrow-in-right w-6 h-6 text-white animate-bounce`}
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
            </a>
            <a
              href={`/u/${userInfo.username}`}
              className={`${
                isLoggedIn ? "" : "hidden"
              } flex items-center gap-4 mb-6`}
            >
              <img
                className="rounded-full w-[30px]"
                src={userInfo.profile_pic}
                alt=""
              />
              <h1 className="font-bold">
                {userInfo.first_name} {userInfo.last_name}
              </h1>
            </a>
            {UserCanRateOrNot()}
          </div>
        </section>
      </section>
      <section className="flex lg:hidden w-[200%]">
        <section
          style={
            !isReviewPage
              ? { transform: "translateX(0%)" }
              : { transform: "translateX(-100%)" }
          }
          className="w-[100%] transition-all duration-300 flex flex-col bg-[#161616] h-auto flex justify-center"
        >
          <div className="px-10 gap-5 pt-16 pb-10 flex flex-col text-white">
            <h1 className="text-3xl font-bold">User Ratings</h1>
            <div className="flex flex-col gap-10 justify-start">
              <div className="flex flex-col gap-10 justify-center">
                <div className="flex gap-10 justify-start items-center">
                  <div className="flex gap-4 justify-center items-center">
                    <StarRating
                      starHeight={20}
                      starWidth={20}
                      styles={"flex justify-center"}
                      overallRating={calculateOverallRating()}
                    />
                    <h1 className="mt-[3px] text-xl">
                      {calculateOverallRating()}
                    </h1>
                  </div>
                  <h1 className="text-xl font-bold mt-[3px]">
                    Total Ratings: {ratings === null ? 0 : ratings.length}
                  </h1>
                </div>
                <RatingDistribution ratings={ratings} />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={ChangeReviewPage}
                  className="bg-[#000] shadow-lg shadow-black mt-10 md:mt-8 md:-mb-4 -mr-5 px-4 py-3 rounded-full"
                >
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </section>
        <section
          style={
            !isReviewPage
              ? { transform: "translateX(0%)" }
              : { transform: "translateX(-100%)" }
          }
          className="w-[100%] transition-all duration-300 flex items-center justify-center flex flex-col justify-center text-white bg-[#161616] h-auto"
        >
          <div className="flex flex-col gap-5 pt-16 pb-10">
            <div className="bg-[#121212] px-20 py-14 rounded-xl gap-5 flex flex-col">
              <a
                className={`flex justify-center ${isLoggedIn ? "hidden" : ""}`}
                href="/login"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className={`bi bi-box-arrow-in-right w-6 h-6 text-white animate-bounce`}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
              </a>
              <a
                href={`/u/${userInfo.username}`}
                className={`${
                  isLoggedIn ? "" : "hidden"
                } flex items-center gap-4 mb-6`}
              >
                <img
                  className="rounded-full w-[30px]"
                  src={
                    userInfo.profile_pic}
                  alt=""
                />
                <h1 className="font-bold">
                  {userInfo.first_name} {userInfo.last_name}
                </h1>
              </a>
              {UserCanRateOrNot()}
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              onClick={ChangeReviewPage}
              className="bg-black shadow-lg shadow-black -mt-4 mb-6 mr-5 px-4 py-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
            </button>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Rating;

export const ReviewForm = ({
  handleSubmitRating,
  userInfo,
  fetchRatings,
  fetchUserData,
  setIsReviewPage,
  setIsRatingPosting,
  send,
}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
const [isRatingMessageEmpty, setIsRatingMessageEmpty] = useState(false);
const [isStarSelected, setIsStarSelected] = useState(true);
const reviewSubmission = async () => {
    try {
      setIsRatingPosting(true);
      const CSRFResponse = await axios.get(
        `${import.meta.env.VITE_PRC_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const CSRFToken = CSRFResponse.data.csrf_token;
      const TokenResponse = await axios.get(
        `${import.meta.env.VITE_PR_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/post/rating/${CSRFToken}/${Token}/`,
        {
          rating: selectedRating,
          ratingMessage: ratingMessage,
          userUID: userInfo.uid,
        }
      );

      await fetchUserData(response.data.uid);
      await fetchRatings();
      setIsReviewPage(false);
      setIsRatingPosting(false);
    } catch (error) {
      setIsRatingPosting(false);
      send({
        type: "semiError",
        message: "Something went wrong, please try again",
        isPopUp: true,
      })
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedRating === 0) {
          setIsStarSelected(false);
          return;
        } else {
          setIsStarSelected(true);
          if (ratingMessage === "") {
            setIsRatingMessageEmpty(true);
            return;
          } else{
            setIsRatingMessageEmpty(false);
            reviewSubmission();
          }
        }
      }}
      className="flex flex-col gap-4 justify-center items-center"
    >
      <RatingSubmissionForm
        state={selectedRating}
        setState={setSelectedRating}
        onSubmit={handleSubmitRating}
        isStarSelected={isStarSelected}
      />
      <textarea
        className={`${isRatingMessageEmpty ? "border-red-500" : ""} w-full h-24 resize-none bg-transparent border-2 rounded-lg px-4 py-2 text-sm outline-none`}
        placeholder="Write your review"
        onChange={(e) => setRatingMessage(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
