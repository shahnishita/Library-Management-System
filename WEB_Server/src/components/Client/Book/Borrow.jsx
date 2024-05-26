import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../Global/NotFound";
import { UserContext } from "../Global/UserData";

const Borrow = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { EncryptedBookInfo, Request } = useParams();
  const bookInfo = JSON.parse(atob(EncryptedBookInfo));
  const [isBookDetailsExpanded, setIsBookDetailsExpanded] = useState(false);
  const [isBorrowFormExpanded, setIsBorrowFormExpanded] = useState(false);
  const [BorrowReqInfo, setBorrowReqInfo] = useState({
    userUID: "",
    bookID: "",
    borrowed_for: 7,
    request_message: "",
  });


  const toggleBookDetails = () => {
    setIsBookDetailsExpanded(!isBookDetailsExpanded);
    setIsBorrowFormExpanded(false);
  };

  const toggleBorrowForm = () => {
    setIsBorrowFormExpanded(!isBorrowFormExpanded);
    setIsBookDetailsExpanded(true);
  };

  useEffect(() => {
    setBorrowReqInfo({
      ...BorrowReqInfo,
      userUID: bookInfo.userUID,
      bookID: bookInfo.id,
    });
  }, []);


  const submitBorrowRequest = async (e) => {
    e.preventDefault();

    try {
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
        `http://127.0.0.1:8000/api/book/borrow/${CSRFToken}/${Token}/?m=submit`,
        BorrowReqInfo
      );

      if (response.status === 200) {
        window.location.replace(`/books`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (Request === "submit") {
    if (!isLoggedIn) {
      return (
<div className='w-full h-screen bg-[#161616] text-white gap-4 flex flex-col justify-center items-center'>
    <p className='text-center text-xl sm:text-2xl md:text-3xl font-bold'>Login Required</p>
    <p className='text-sm sm:text-md md:text-lg text-center'>You need to log in to request a book. <span className='text-blue-400 cursor-pointer hover:text-blue-600'><a href='/login'>Go back to Login</a></span></p>
</div>

      );
    } else {
      return (
        <section className="bg-[#161616] h-screen relative">
          <a
            className="absolute z-10 top-2 left-2 p-2 rounded-md transition duration-300 hover:bg-gray-700"
            href="/books"
          >
          <BackIcon/>
          </a>
          <div className="lg:grid -h-screen lg:grid-cols-12">
            <section className="overflow-hidden relative h-[210px] flex lg:h-screen items-center justify-center bg-[#282828] lg:col-span-5 xl:col-span-5">
              <img
                alt=""
                src={bookInfo.thumbnail}
                className=" w-[90%] lg:w-auto lg:h-[75%] opacity-80 shadow-xl shadow-black"
              />
              <div className="absolute lg:hidden block top-0 left-0 w-full h-full bg-[#000000]/20" />
            </section>

            <main className="flex items-start bg-[#161616] justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-7">
              <div className="max-w-xl lg:max-w-3xl mt-10 lg:mt-0">
                <div
                  onClick={toggleBookDetails}
                  className="relative cursor-pointer col-span-6 w-full h-12 text-white flex items-center justify-center rounded-md shadow-sm bg-[#282828]"
                >
                  <p className="absolute left-3 font-bold">Book Details</p>
                  <button
                    onClick={toggleBookDetails}
                    className={`${
                      isBookDetailsExpanded ? "rotate-180" : ""
                    } absolute right-3 p-[3px] transition-all duration-300 rounded-sm`}
                  >
                    <ExpendCollapse />
                  </button>
                </div>

                <form
                  className={`${
                    isBookDetailsExpanded ? "h-0" : "h-full"
                  } overflow-hidden mt-8 grid grid-cols-12 lg:grid-cols-6 gap-6`}
                >
                  <div className="col-span-12 lg:col-span-6">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-white"
                    >
                      Title
                    </label>

                    <input
                      value={bookInfo.title}
                      type="text"
                      id="title"
                      name="title"
                      disabled={true}
                      className="disabled:cursor-not-allowed disabled:opacity-80 mt-1 px-3 py-[15px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white shadow-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-white"
                    >
                      Author
                    </label>

                    <input
                      value={bookInfo.author.split("$")[0]}
                      type="text"
                      id="author"
                      name="author"
                      disabled={true}
                      className="disabled:cursor-not-allowed disabled:opacity-80 mt-1 px-3 py-[15px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white/80 shadow-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-white"
                    >
                      Language
                    </label>

                    <input
                      value={bookInfo.language.split("$")[0]}
                      type="text"
                      id="language"
                      name="language"
                      disabled={true}
                      className="disabled:cursor-not-allowed disabled:opacity-80 mt-1 px-3 py-[15px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white/80 shadow-sm"
                    />
                  </div>

                  <div className=" col-span-12 lg:col-span-6 mb-12 ">
                    <label
                      htmlFor="isbn"
                      className="block text-sm font-medium text-white"
                    >
                      {" "}
                      ISBN{" "}
                    </label>

                    <input
                      value={bookInfo.ISBN.split("$")[0]}
                      type="number"
                      id="isbn"
                      name="isbn"
                      disabled={true}
                      className="disabled:cursor-not-allowed disabled:opacity-80 mt-1 px-3 py-[15px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white/80 shadow-sm"
                    />
                  </div>
                </form>

                <div
                  onClick={toggleBorrowForm}
                  className="cursor-pointer relative mt-2 col-span-6 w-full h-12 text-white flex items-center justify-center rounded-md shadow-sm bg-[#282828]"
                >
                  <p className="absolute left-3 font-bold">Borrow Form</p>
                  <button
                    onClick={toggleBorrowForm}
                    className={`${
                      !isBorrowFormExpanded ? "rotate-180" : ""
                    } absolute right-3 p-[3px] transition-all duration-300 rounded-sm`}
                  >
                    <ExpendCollapse />
                  </button>
                </div>

                <form
                  className={`${
                    isBorrowFormExpanded ? "h-full" : "h-0"
                  } overflow-hidden mt-8 grid grid-cols-6 gap-6`}
                >
                  <div className="col-span-6">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-white"
                    >
                      Borrowed For
                    </label>

                    <select
                      onChange={(e) =>
                        setBorrowReqInfo({
                          ...BorrowReqInfo,
                          borrowed_for: parseInt(e.target.value),
                        })
                      }
                      name="time"
                      defaultValue={7}
                      className=" mt-1 px-3 py-[12px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white shadow-sm"
                    >
                      <option value={5}>5 Days</option>
                      <option value={7}>7 Days</option>
                      <option value={10}>10 Days</option>
                      <option value={15}>15 Days</option>
                      <option value={20}>20 Days</option>
                      <option value={30}>30 Days</option>
                    </select>
                  </div>

                  <div className="col-span-6 relative">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-white"
                    >
                      Message
                    </label>

                    <textarea
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue.length <= 250) {
                          setBorrowReqInfo({
                            ...BorrowReqInfo,
                            request_message: inputValue,
                          });
                        }
                      }}
                      placeholder="Enter a message..."
                      type="text"
                      name="message"
                      rows={5}
                      value={BorrowReqInfo.request_message}
                      className="resize-none mt-1 px-3 py-[15px] w-full rounded-md outline-none  bg-[#282828] text-[15px] text-white/80 shadow-sm"
                    />
                    <div className="absolute right-0 bottom-[8px] px-2 py-1 rounded-br-md rounded-tl-md text-white text-[13px] bg-[#282828]">
                      <span>{250 - BorrowReqInfo.request_message.length}</span>{" "}
                      / 250
                    </div>
                  </div>
                </form>
                <form className={` mt-8 grid grid-cols-6 gap-6`}>
                  <button
                    onClick={submitBorrowRequest}
                    className="col-span-6 px-4 py-2 w-full bg-[#EE0000] text-white font-bold rounded-full mb-2 hover:bg-[#be0000]"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </main>
          </div>
        </section>
      );
    }
  } else if (Request === "cancel") {
    const [CancelResponse, setCancelResponse] = useState({
      message: "Canceling Request",
    });

    const CancelBorrowRequest = async () => {
      try {
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
          `http://127.0.0.1:8000/api/book/borrow/${CSRFToken}/${Token}/?m=cancel`,
          {
            userUID: bookInfo.userUID,
            bookID: bookInfo.id,
          }
        );

        setCancelResponse(response.data);
      } catch (err) {
        return null;
      }
    };

    useEffect(() => {
      CancelBorrowRequest();
    }, []);

    return (
      <div className="w-full h-screen bg-[#161616] text-white gap-4 flex flex-col justify-center items-center">
        <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
          {!CancelResponse
            ? "Something went wrong, please try again!"
            : CancelResponse.message}
        </p>
        <p className="text-sm sm:text-md md:text-lg text-center">
          <span className="text-blue-400 cursor-pointer hover:text-blue-600">
            <a href="/books">Go back</a>
          </span>
        </p>
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default Borrow;

export const ExpendCollapse = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-caret-down-fill"
      viewBox="0 0 16 16"
    >
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
  );
};


export const BackIcon = () => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="bi bi-arrow-left text-white"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
    />
  </svg>
  )
}