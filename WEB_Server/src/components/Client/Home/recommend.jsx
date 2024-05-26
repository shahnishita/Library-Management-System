import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Global/UserData";
import Toast from "../Global/Toast";

const Recommend = ({
  title,
  genre,
  popularity,
  thumbnail,
  fullData,
  func,
  OpenBook,
}) => {
  const [ToastContent, setToastContent] = useState({});
  const { userInfo, isLoggedIn } = useContext(UserContext);

  const SaveBook = async (bookID, username, email) => {
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
        `http://127.0.0.1:8000/api/user/saved/books/${CSRFToken}/${Token}/?a=add`,
        {
          bookID: bookID,
          username: username,
          email: email,
        }
      );

      if (response.data) {
        setToastContent({
          type: "success",
          message: response.data.message,
          isShow: true,
        });
        func(userInfo.uid);
        setTimeout(() => {
          setToastContent({
            isShow: false,
          });
        }, 2000);
      }
    } catch (err) {
      return err;
    }
  };

  return (
    <>
      <section className="hidden md:grid grid-cols-12 border-2 border-t-[#161616] border-b-[#282828] border-l-0 border-r-0 ">
        <section className="col-span-6 flex flex-col justify-center text-white bg-[#161616] h-80 px-12 py-6">
          <h3 className="text-sm text-[#CCCCCC] mb-4">Recommended Book</h3>
          <h1 className="text-3xl mb-2 font-black truncate">{title}</h1>
          <div className="flex gap-12 max-w-[50%] justify-between">
            <h4 className="text-[11px] text-[#CCCCCC] mb-4">{genre}</h4>
            <h4 className="w-[1px] h-[16px] bg-[#CCCCCC]"></h4>
            <h4 className="text-[11px] text-[#CCCCCC] mb-4">
              Popularity: {popularity}+
            </h4>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                OpenBook({
                  title: fullData.book.title,
                  author: fullData.book.author,
                  genre: fullData.book.genre,
                  language: fullData.book.language,
                  description: fullData.book.description,
                  thumbnail: fullData.book.thumbnail,
                  id: fullData.book.bookID,
                  publish_date: fullData.book.publish_date,
                  publisher: fullData.book.publisher,
                  quantity: fullData.book.quantity,
                  isAvailable: fullData.book.isAvailable,
                  pages: fullData.book.pages,
                  ISBN: fullData.book.ISBN,
                  status: fullData.book.borrow_status,
                  userUID: userInfo.uid,
                  isPopUp: true,
                  closePopUp: () => OpenBook({ isPopUp: false }),
                });
              }}
              className="text-white bg-[#EE0000] rounded-full px-6 py-[5px] text-[12px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300"
            >
              Read
            </button>
            <button
              onClick={() => {
                !fullData?.is_saved
                  ? isLoggedIn
                    ? SaveBook(
                        fullData.book.bookID,
                        userInfo.username,
                        userInfo.email
                      )
                    : (setToastContent({
                        type: "info",
                        message: "Please Login First",
                        isShow: true,
                      }),
                      setTimeout(() => {
                        setToastContent({
                          isShow: false,
                        });
                      }, 2000))
                  : setToastContent({
                      type: "info",
                      message: "Book Already Saved",
                      isShow: true,
                    });
                setTimeout(() => {
                  setToastContent({
                    isShow: false,
                  });
                }, 2000);
              }}
              className="text-black bg-[white] rounded-full px-6 py-[5px] text-[12px] font-bold hover:bg-[#CCCCCC] hover:transition hover:duration-300"
            >
              {fullData?.is_saved ? "Saved" : "Save for Later"}
            </button>
          </div>
        </section>
        <section className="col-span-6 px-10 py-6 bg-[#282828] h-80 flex justify-center">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="shadow-xl shadow-[black] h-full"
          />
        </section>
        <div>
          <Toast
            visibility={ToastContent.isShow ? "block" : "hidden"}
            text={ToastContent.message}
            background={
              ToastContent.type === "success"
                ? "bg-green-500"
                : ToastContent.type === "info"
                ? "bg-blue-500"
                : "bg-red-500"
            }
          />
        </div>
      </section>
      <section className="relative grid md:hidden grid-cols-12 border-2 border-t-[#161616] border-b-[#282828] border-l-0 border-r-0       ">
        <section className=" col-span-12 flex flex-col justify-center text-white bg-[#161616] h-80 px-6 py-6">
          <div className="z-[1]">
            <h3 className="text-sm text-[#CCCCCC] mb-4">Recommended Book</h3>
            <h1 className="text-3xl mb-2 font-black truncate">{title}</h1>
            <div className="flex gap-12 max-w-[80%] justify-between">
              <h4 className="text-[11px] text-[#CCCCCC] mb-4">{genre}</h4>
              <h4 className="w-[1px] h-[16px] bg-[#CCCCCC]"></h4>
              <h4 className="text-[11px] text-[#CCCCCC] mb-4">
                Popularity: {popularity}+
              </h4>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  OpenBook({
                    title: fullData.book.title,
                    author: fullData.book.author,
                    genre: fullData.book.genre,
                    language: fullData.book.language,
                    description: fullData.book.description,
                    thumbnail: fullData.book.thumbnail,
                    id: fullData.book.bookID,
                    publish_date: fullData.book.publish_date,
                    publisher: fullData.book.publisher,
                    quantity: fullData.book.quantity,
                    isAvailable: fullData.book.isAvailable,
                    pages: fullData.book.pages,
                    ISBN: fullData.book.ISBN,
                    status: fullData.book.borrow_status,
                    userUID: userInfo.uid,
                    isPopUp: true,
                    closePopUp: () => OpenBook({ isPopUp: false }),
                  });
                }}
                className="text-white bg-[#EE0000] rounded-full px-6 py-[5px] text-[12px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300"
              >
                Read
              </button>
              <button
                onClick={() => {
                  !fullData?.is_saved
                    ? isLoggedIn
                      ? SaveBook(
                          fullData.book.bookID,
                          userInfo.username,
                          userInfo.email
                        )
                      : (setToastContent({
                          type: "info",
                          message: "Please Login First",
                          isShow: true,
                        }),
                        setTimeout(() => {
                          setToastContent({
                            isShow: false,
                          });
                        }, 2000))
                    : setToastContent({
                        type: "info",
                        message: "Book Already Saved",
                        isShow: true,
                      });
                  setTimeout(() => {
                    setToastContent({
                      isShow: false,
                    });
                  }, 2000);
                }}
                className="text-black bg-[white] rounded-full px-6 py-[5px] text-[12px] font-bold hover:bg-[#CCCCCC] hover:transition hover:duration-300"
              >
                {fullData?.is_saved ? "Saved" : "Save for Later"}
              </button>
            </div>
          </div>
          <div
            className="absolute inset-0 z-[0]"
            style={{
              WebkitMaskSize: "100% 100%",
              WebkitMaskImage:
                "-webkit-gradient(linear, left top, right bottom, color-stop(0, rgba(0,0,0,1)), color-stop(0, rgba(0,0,0,0)), color-stop(0.51, rgba(0,0,0,5%)), color-stop(1.00, rgba(0,0,0,30%)))",
            }}
          >
            <img
              src={thumbnail}
              className="w-full h-full inset-0 object-cover absolute"
              alt=""
            />
          </div>
        </section>
        <Toast
          visibility={ToastContent.isShow ? "block" : "hidden"}
          text={ToastContent.message}
          background={
            ToastContent.type === "success"
              ? "bg-green-500"
              : ToastContent.type === "info"
              ? "bg-blue-500"
              : "bg-red-500"
          }
        />
      </section>
    </>
  );
};

export default Recommend;
