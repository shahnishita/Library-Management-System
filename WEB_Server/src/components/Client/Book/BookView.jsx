import React, { useEffect, useState } from "react";
import axios from "axios";

const Main = ({
  func,
  books,
  UserInfo,
  ToastContent,
  OpenBook,
  compoTitle,
}) => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [FilterByAuthor, setFilterByAuthor] = useState("");

  useEffect(() => {
    const uGenres = new Set();
    const uAuthors = new Set();

    books.forEach((book) => {
      book.genre.split("$ ").forEach((genre) => {
        const normalizedGenre = genre.toLowerCase();
        uGenres.add(normalizedGenre);
      });
      book.author.split("$ ").forEach((author) => {
        uAuthors.add(author);
      });
    });

    setGenres([...uGenres]);
    setAuthors([...uAuthors]);
  }, [books]);

  const filterBooksByAuthor = () => {
    let filtered = books;

    if (FilterByAuthor.length > 0) {
      filtered = filtered.filter((book) =>
        book.author
          .split("$ ")
          .some((author) => FilterByAuthor.includes(author))
      );
    }

    setFilteredBooks(filtered.length > 0 ? filtered : books);
  };
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
        ToastContent({
          type: "success",
          message: response.data.message,
          isShow: true,
        });
        func();
        setTimeout(() => {
          ToastContent({
            isShow: false,
          });
        }, 2000);
      }
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    filterBooksByAuthor();
  }, [books, FilterByAuthor]);

  return (
    <div className="w-full bg-[#161616] text-white">
      <div>
        <h1 className="text-3xl md:text-5xl font-black px-5 md:px-12 pt-12">
          {compoTitle || "Books"}
        </h1>
        <hr className="border-[#bebebe90] mx-5 md:mx-12 my-4 pb-6 md:pb-12" />
        <div className="grid grid-cols-12 px-5 md:px-12">
          <div className="flex flex-col col-span-12 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[18px] md:text-[23px] font-bold">
                Filter Results
              </span>
              <h2 className="block md:hidden text-[15px] md:text-[16px] font-bold mr-8">
                Result {filteredBooks.length}
              </h2>
            </div>
            <div className="flex justify-between items-center w-full">
              <select
                onChange={(e) => {
                  setFilterByAuthor(e.target.value);
                  filterBooksByAuthor();
                }}
                className="min-w-[250px] appearance-none capitalize text-black px-3 md:px-4 py-[8px] md:py-[10px] rounded-full bg-[#282828] text-white text-[15px] outline-none border-0"
                name="author"
              >
                <option value="">All Authors</option>
                {authors.map((author, i) => (
                  <option className="capitalize" key={i} value={author}>
                    {author}
                  </option>
                ))}
              </select>
              <h2 className="hidden md:block text-[16px] font-bold mr-8">
                Result {filteredBooks.length}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col grid grid-cols-4 md:grid-cols-8 xl:grid-cols-12 gap-10 px-7 pt-12 pb-16">
          {filteredBooks.map((book, i) => (
            <div
              onClick={() => {
                OpenBook({
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
                  status: book.borrow_status,
                  userUID: UserInfo.uid,
                  isPopUp: true,
                  closePopUp: () => OpenBook({ isPopUp: false }),
                });
              }}
              key={i}
              className="cursor-pointer relative col-span-4 shadow-md shadow-[black] px-3 py-3 h-[230px] md:h-[250px] lg:h-[280px] hover:scale-105 transition hover:duration-300 bg-[#282828] rounded-lg"
            >
              <div
                className={`${book.borrow_status ? "px-2 py-1" : ""} ${
                  book.borrow_status === "Approved"
                    ? "bg-[limegreen] text-black"
                    : book.borrow_status === "Pending"
                    ? "bg-[lightblue] text-black"
                    : book.borrow_status === "Rejected"
                    ? "bg-[red] text-white"
                    : book.borrow_status === "borrowed"
                    ? "bg-[darkblue] text-white"
                    : book.borrow_status === "Overdue"
                    ? "bg-[darkred] text-white"
                    : book.borrow_status === "Cancelled"
                    ? "bg-[gray] text-white"
                    : book.borrow_status === "Returned"
                    ? "bg-[green] text-white"
                    : ""
                } absolute top-0 left-0 lowercase text-sm rounded-tl-lg rounded-br-lg`}
              >
                {book.borrow_status ? book.borrow_status : ""}
              </div>
              <div className="w-full h-full flex gap-4">
                <img
                  className="h-full aspect-[2.5/4] rounded-lg shadow-sm shadow-[black]"
                  src={book.thumbnail}
                  alt=""
                />
                <div className="relative flex flex-col gap-1 overflow-hidden w-full">
                  <p className="text-sm">
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
                  <p className="text-sm truncate ">
                    <span className="font-bold">Language:</span>{" "}
                    {book.genre.replaceAll("$ ", ", ")}
                  </p>
                  <p className="text-sm text-[#c82eff] font-black">
                    <span className="font-medium text-white">Available:</span>{" "}
                    {book.quantity}
                  </p>
                  <div className="absolute flex bottom-0 gap-3">
                    <button className="bg-white text-black flex hover:bg-[#dbdbdb] transition-all duration-300 gap-[5px] justify-center items-center px-3 py-1 md:px-3 md:py-[5px] lg:px-4 lg:py-[6px] rounded-md text-[13px] font-bold">
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
                        book.is_saved
                          ? (ToastContent({
                              type: "info",
                              message: "Already saved",
                              isShow: true,
                            }),
                            setTimeout(() => {
                              ToastContent({ isShow: false });
                            }, 2000))
                          : SaveBook(
                              book.bookID,
                              UserInfo.username,
                              UserInfo.email
                            );
                      }}
                      className="flex items-center gap-1 border border-white hover:bg-white hover:text-black transition-all duration-300 text-[13px] font-bold px-3 py-1 md:px-3 md:py-[5px] lg:px-4 lg:py-[6px] rounded-md"
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
                        {book.is_saved ? "Saved" : "Save"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
