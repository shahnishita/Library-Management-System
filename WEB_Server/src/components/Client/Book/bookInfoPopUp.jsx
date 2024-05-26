import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

const BookInfoPopUp = ({ bookInfo }) => {
  const [mainAuthor, setMainAuthor] = useState("");
  const [Genre, setGenre] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedDescription, setTruncatedDescription] = useState("");
  const [publishDate, setPublishDate] = useState("");

  useEffect(() => {
    const extractMainAuthor = () => {
      if (bookInfo.author) {
        const authors = bookInfo.author.split("$");
        setMainAuthor(authors[0]);
      }
    };
    const extractGenre = () => {
      if (bookInfo.genre) {
        const genres = bookInfo.genre.split("$");
        setGenre(genres);
      }
    };

    const truncateDescription = () => {
      if (bookInfo.description && bookInfo.description.length > 350) {
        setTruncatedDescription(bookInfo.description.slice(0, 350));
      } else {
        setTruncatedDescription(bookInfo.description);
      }
    };

    const formatDate = () => {
      if (bookInfo.publish_date) {
        const date = new Date(bookInfo.publish_date);

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        setPublishDate(
          `${
            monthNames[date.getMonth()]
          } ${date.getDate()}, ${date.getFullYear()}`
        );
      }
    };

    extractGenre();
    extractMainAuthor();
    truncateDescription();
    formatDate();
  }, [bookInfo]);

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="z-[10] overflow-auto rounded-xl px-7 py-6 text-white fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-55%] md:translate-y-[-52%] w-[90%]  h-[85%] md:h-[90%] bg-[#161616]">
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-10">
          <img
            className="col-span-3 rounded-lg border-2 border-white"
            src={bookInfo.thumbnail}
            alt="book thumbnail"
          />
          <div className="col-span-6 flex flex-col">
            <p className="text-3xl font-bold">{bookInfo.title}</p>
            <p className="text-md">By {mainAuthor}</p>
            <hr className="mt-6 mb-10 border-[#bebebe96]" />
            {isExpanded ? (
              <p className="text-[18px]">
                {bookInfo.description} <br />
                <span
                  className="text-red-500 cursor-pointer font-bold"
                  onClick={handleToggleExpansion}
                >
                  ...
                </span>
              </p>
            ) : (
              <>
                <p className="text-[18px]">{truncatedDescription}</p>
                {bookInfo.description && bookInfo.description.length > 350 && (
                  <span
                    className="text-red-500 cursor-pointer font-bold"
                    onClick={handleToggleExpansion}
                  >
                    ...
                  </span>
                )}
              </>
            )}
            <hr className="mt-10 mb-6 border-[#bebebe96]" />
            <InfoSwiper bookInfo={bookInfo} />
            <hr className="my-6 border-[#bebebe96]" />
          </div>
          <div className="flex flex-col aspect-[2.5/4] justify-between px-3 py-3 bg-[#292929] col-span-3 rounded-lg shadow-sm shadow-[black]">
            <div className="flex flex-wrap gap-2">
              {Genre.map((genre, i) => (
                <p
                  className="bg-[#161616] rounded-full px-4 py-2 xl:text-sm md:text-xs lg:text-[10px] shadow-lg"
                  key={i}
                >
                  {genre}
                </p>
              ))}
            </div>
            {bookInfo.status !== "Pending" ? (
              bookInfo.isAvailable ? (
                <a
                  href={`/book/borrow/submit/${btoa(JSON.stringify(bookInfo))}`}
                >
                  <button className="lg:text-md md:text-sm text-sm px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]">
                    Borrow this book
                  </button>
                </a>
              ) : (
                <button
                  disabled={true}
                  className="lg:text-md md:text-sm text-sm disabled:opacity-70 disabled:hover:bg-[#EE0000] px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]"
                >
                  Not available
                </button>
              )
            ) : (
              <a href={`/book/borrow/cancel/${btoa(JSON.stringify(bookInfo))}`}>
                <button className="px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]">
                  Cancel Request
                </button>
              </a>
            )}
          </div>
        </div>
        <BookDetails bookInfo={bookInfo} publishDate={publishDate} />
      </div>

      <div className="block lg:hidden">
        <div className="grid grid-rows-3 grid-cols-6 align-middle gap-10">
          <div className="row-span-3 col-span-6">
            <p className="text-2xl font-bold">{bookInfo.title}</p>
            <p className="text-md">By {mainAuthor}</p>
          </div>
          <div className="row-span-3 col-span-6 flex justify-center items-center">
            <img
              className="rounded-lg w-[50%] h-auto shadow border-2 border-white"
              src={bookInfo.thumbnail}
              alt="book thumbnail"
            />
          </div>
          <div className="row-span-1 col-span-6 flex flex-wrap gap-2 mt-6">
            {Genre.map((genre, i) => (
              <p
                className="bg-[#292929] rounded-full px-4 py-2 text-sm shadow-lg"
                key={i}
              >
                {genre}
              </p>
            ))}
          </div>
          <div className="row-span-1 col-span-6">
            {bookInfo.status !== "Pending" ? (
              bookInfo.isAvailable ? (
                <a
                  href={`/book/borrow/submit/${btoa(JSON.stringify(bookInfo))}`}
                >
                  <button className="lg:text-md md:text-sm text-sm px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]">
                    Borrow this book
                  </button>
                </a>
              ) : (
                <button
                  disabled={true}
                  className="lg:text-md md:text-sm text-sm disabled:opacity-70 disabled:hover:bg-[#EE0000] px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]"
                >
                  Not available
                </button>
              )
            ) : (
              <a href={`/book/borrow/cancel/${btoa(JSON.stringify(bookInfo))}`}>
                <button className="px-4 py-2 w-full bg-[#EE0000] text-white font-bold shadow-lg rounded-full mb-2 hover:bg-[#be0000]">
                  Cancel Request
                </button>
              </a>
            )}
          </div>

          <div className="col-span-6">
            <hr className="mt-10 mb-6 border-[#bebebe96]" />

            <InfoSwiper bookInfo={bookInfo} />
            <hr className="mt-6 border-[#bebebe96]" />
          </div>

          <div className="col-span-6 flex flex-col">
            {isExpanded ? (
              <p className="text-[18px]">
                {bookInfo.description} <br />
                <span
                  className="text-red-500 cursor-pointer font-bold"
                  onClick={handleToggleExpansion}
                >
                  ...
                </span>
              </p>
            ) : (
              <>
                <p className="text-[18px]">{truncatedDescription}</p>
                {bookInfo.description && bookInfo.description.length > 350 && (
                  <span
                    className="text-red-500 cursor-pointer font-bold"
                    onClick={handleToggleExpansion}
                  >
                    ...
                  </span>
                )}
              </>
            )}
            <hr className="mt-8 mb-4 border-[#bebebe96]" />
          </div>
        </div>

        <BookDetails
          bookInfo={bookInfo}
          publishDate={publishDate}
          margin="mt-10"
        />
      </div>
    </div>
  );
};

export default BookInfoPopUp;

export const Details = ({ path, svg, text, label }) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-[13px]">{label}</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className={`${svg ? "hidden" : ""}`}
        viewBox="0 0 16 16"
      >
        {path}
      </svg>
      {svg}
      <p className="text-[13px] font-bold text-center">{text}</p>
    </div>
  );
};

export const InfoSwiper = ({ bookInfo }) => {
  const [Publisher, setPublisher] = useState([]);

  useEffect(() => {
    const extractPublisher = () => {
      if (bookInfo.publisher) {
        const publishers = bookInfo.publisher.split("$");
        setPublisher(publishers);
      }
    };

    extractPublisher();
  }, [bookInfo]);

  return (
    <div className="flex select-none cursor-grab">
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          700: {
            slidesPerView: 4,
            spaceBetween: 8,
          },
        }}
        freeMode={true}
        modules={[FreeMode]}
      >
        <SwiperSlide>
          <Details
            path={
              <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
            }
            text={bookInfo.pages}
            label={"Pages"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Details
            path={
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
            }
            text={bookInfo.language}
            label={"Language"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Details
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar3"
                viewBox="0 0 16 16"
              >
                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
            }
            text={bookInfo.publish_date}
            label={"Publish Date"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Details
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-buildings"
                viewBox="0 0 16 16"
              >
                <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
              </svg>
            }
            text={Publisher[0]}
            label={"Publisher"}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Details
            path={
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.37 5.11V4.001h5.308V5.15L7.42 12H6.025l3.317-6.82v-.07H5.369Z" />
            }
            text={bookInfo.quantity}
            label={"Quantity"}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export const BookDetails = ({ bookInfo, publishDate, margin = "mt-16" }) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${margin} mb-5`}>
      <p className="font-semibold text-2xl">Book Details:</p>
      <div className="flex flex-col ml-4 gap-[0.3rem]">
        <p className="text-sm">
          <span className="font-bold">Authors: </span>
          {bookInfo.author ? bookInfo.author.replaceAll("$", ", ") : ""}
        </p>
        <p className="text-sm">
          <span className="font-bold">Publisher: </span>
          {bookInfo.publisher ? bookInfo.publisher.replaceAll("$", ", ") : ""}
        </p>
        <p className="text-sm">
          <span className="font-bold">Language: </span>
          {bookInfo.language ? bookInfo.language.replaceAll("$", ", ") : ""}
        </p>
        <p className="text-sm">
          <span className="font-bold">Genre: </span>
          {bookInfo.genre ? bookInfo.genre.replaceAll("$", ", ") : ""}
        </p>
        <p className="text-sm">
          <span className="font-bold">Pages: </span> {bookInfo.pages}
        </p>
        <p className="text-sm">
          <span className="font-bold">ISBN: </span>
          {bookInfo.ISBN ? bookInfo.ISBN.replaceAll("$", ", ") : ""}
        </p>
        <p className="text-sm">
          <span className="font-bold">Publish Date: </span> {publishDate}
        </p>
      </div>
    </div>
  );
};
