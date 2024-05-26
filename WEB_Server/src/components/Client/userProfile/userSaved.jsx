import React, { useState } from "react";
import axios from "axios";

const UserSaved = ({ username, send, optionalFunc, saved }) => {
  const PRCT_URL = import.meta.env.VITE_PRC_TOKEN;
  const PRT_URL = import.meta.env.VITE_PR_TOKEN;
  const TOKEN_REQ_CODE = import.meta.env.VITE_TOKEN_REQUEST_CODE;
  const [removedIndex, setRemovedIndex] = useState([]);

  const removeSave = async (id, username, email, index) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const CSRFResponse = await axios.get(`${PRCT_URL}${TOKEN_REQ_CODE}/`);
      const CSRFToken = CSRFResponse.data.csrf_token;
      const TokenResponse = await axios.get(`${PRT_URL}${TOKEN_REQ_CODE}/`);
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/saved/books/${CSRFToken}/${Token}/?a=remove`,
        {
          bookID: id,
          username: username,
          email: email,
        }
      );

      if (response.data) {
        send({
          isSavedRemoveProcessEnabled: true,
          responseMessage: response.data.message,
          isError: false,
        });
        setRemovedIndex([...removedIndex, index]);
        setTimeout(() => {
          send({ isSavedRemoveProcessEnabled: false });
        }, 2000);
      }
    } catch (err) {
      send({
        isSavedRemoveProcessEnabled: true,
        responseMessage: err.response.data.message,
        isError: true,
      });
      setTimeout(() => {
        send({ isSavedRemoveProcessEnabled: false });
      }, 2000);
      return null;
    }
  };

  if (saved.length === 0) {
    return (
      <div className="text-white h-auto container mx-auto px-4 md:px-0 w-full py-40">
        <p className="text-white text-center">You haven't saved any book yet</p>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto text-white md:mt-4">
        <div className="flex w-full flex-col grid grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-10 px-7 py-12">
          {saved.map((saveData, i) => {
            const { book } = saveData;
            return (
              <div
                onClick={() => {
                  send({
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    language: book.language,
                    description: book.description,
                    thumbnail: book.thumbnail,
                    id: book.bookID,
                    publish_date: book.publish_date,
                    publisher: book.publisher,
                    quantity: book.quantity,
                    isAvailable: book.isAvailable,
                    pages: book.pages,
                    ISBN: book.ISBN,
                    isPopUp: true,
                    closePopUp: () => send({ isPopUp: false }),
                  });
                  document.body.style.overflow = "hidden";
                }}
                key={i}
                className={`${
                  removedIndex.includes(i) ? "remove-animation" : ""
                } relative w-full col-span-4 shadow-md shadow-[black] px-3 py-3 h-[250px] hover:scale-105 transition hover:duration-300 bg-[#161616] rounded-lg`}
              >
                <div
                  className={`${saveData.borrow_status ? "px-2 py-1" : ""} ${
                    saveData.borrow_status === "Approved"
                      ? "bg-[limegreen] text-black"
                      : saveData.borrow_status === "Pending"
                      ? "bg-[lightblue] text-black"
                      : saveData.borrow_status === "Rejected"
                      ? "bg-[red] text-white"
                      : saveData.borrow_status === "borrowed"
                      ? "bg-[darkblue] text-white"
                      : saveData.borrow_status === "Overdue"
                      ? "bg-[darkred] text-white"
                      : saveData.borrow_status === "Cancelled"
                      ? "bg-[gray] text-white"
                      : saveData.borrow_status === "Returned"
                      ? "bg-[green] text-white"
                      : ""
                  } absolute top-0 left-0 lowercase text-sm rounded-tl-lg rounded-br-lg`}
                >
                  {saveData.borrow_status ? saveData.borrow_status : ""}
                </div>
                <div className="w-full h-full flex gap-4">
                  <img
                    className="h-full aspect-[2.5/4] rounded-lg shadow-sm shadow-[black]"
                    src={book.thumbnail}
                    alt=""
                  />
                  <div className="relative w-full flex flex-col gap-1 overflow-hidden">
                    <p className="text-sm truncate">
                      <span className="font-bold">Title:</span> {book.title}
                    </p>
                    <p className="text-sm truncate">
                      <span className="font-bold">Author:</span>{" "}
                      {book.author.replaceAll("$ ", ", ")}
                    </p>
                    <p className="text-sm truncate">
                      <span className="font-bold">Genre:</span>{" "}
                      {book.genre.replaceAll("$ ", ", ")}
                    </p>
                    <p className="text-sm truncate">
                      <span className="font-bold">Language:</span>{" "}
                      {book.language.replaceAll("$ ", ", ")}
                    </p>
                    <p className="text-sm text-[#c82eff] font-black">
                      <span className="font-medium text-white">Available:</span>{" "}
                      {book.quantity}
                    </p>
                    <div className="absolute flex bottom-0 gap-3">
                      <button className="bg-white text-black flex hover:bg-[#dbdbdb] transition-all duration-300 gap-[5px] justify-center items-center text-[12px] px-3 md:px-3 py-0 rounded-md md:text-[13px] font-bold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-book-half w-[14px] h-[14px]"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                        </svg>
                        <span className="mt-[1px]">Read</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSave(
                            book.bookID,
                            saveData.username,
                            saveData.email,
                            i
                          );
                        }}
                        className="flex items-center gap-1 border border-white hover:bg-white hover:text-black transition-all duration-300 text-[12px] px-3 py-1 md:text-[13px] font-bold md:px-3 md:py-[4px] rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-bookmark-fill w-3 h-3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                        </svg>
                        <span className="mt-[1.5px]">
                          {saveData.isSaved == true ? "Saved" : "Save"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default UserSaved;
