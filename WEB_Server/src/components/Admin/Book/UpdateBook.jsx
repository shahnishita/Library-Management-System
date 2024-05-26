import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../Global/SideBar";
import { UserContext } from "../../Client/Global/UserData";
import PreLoader from "../../Client/Global/PreLoader";
import axios from "axios";
import Loader from "../../Client/Global/loader";
import "./Book.css";
import Cookies from "js-cookie";
import NotFound from "../../Client/Global/NotFound";
import { Thumbnail } from "./AddBook";

const UpdateBook = () => {
  const { id } = useParams();
  const [isPreLoading, setIsPreLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { DecodeUserData } = useContext(UserContext);
  const [bookData, setBookData] = useState({
    type: "",
    data: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsPreLoading(true);
      document.title = `Request - Library of Congress`;
      try {
        await DecodeUserData();
        id !== undefined && (await fetchBookData());
        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBookData = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/admins/book/info/?q=${id}`
      );
      setBookData({
        ...bookData,
        type: "found",
        data: res.data,
      });
    } catch (error) {
      setBookData({
        ...bookData,
        type: "not-found",
        data: null,
      });
    }
  };

  const { data } = bookData;

  const nonStaffTypes = ["guest", "member", "VIP"];

  if (isPreLoading) {
    return <PreLoader />;
  }

  if (
    !Cookies.get("remember") ||
    !localStorage.getItem("localData") ||
    nonStaffTypes.includes(Cookies.get("user_type"))
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar activeBookDrawer={"updateBook"} activeDashboardTab={false} />
      <div className="flex-grow">
        {id === undefined ? (
          <SearchBook />
        ) : bookData.type === "found" ? (
          <Body setIsLoading={setIsLoading} id={id} currentBookInfo={data} />
        ) : (
          <NoBookFound />
        )}
        <div
          className={`${
            isLoading ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center`}
        >
          <Loader SvgWidth="25px" width="70px" />
        </div>{" "}
      </div>
    </div>
  );
};

export default UpdateBook;

export const NoBookFound = () => {
  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col w-full h-full min-h-screen justify-center items-center">
              <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-bold">
                Book Not Found
              </h1>
              <p className="text-sm sm:text-md md:text-lg text-center">
                Sorry, the requested book could not be found.{" "}
                <span className="text-blue-400 cursor-pointer hover:text-blue-600">
                  <a href="/admin/book/update">Search Again</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SearchBook = () => {
  const [id, setId] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Update Book</h1>
              <form className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1 items-start">
                  <label htmlFor="BookTitle">Book ID</label>
                  <input
                    className={`${
                      isEmpty ? "border-red-500" : "border-[#282828]"
                    } appearance-none transition-all duration-300 px-3 py-2.5 border-2`}
                    type="number"
                    placeholder="123456"
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <button
                    className="outline-none hover:scale-110 transition-all duration-300 rounded-md px-3 py-1.5  bg-blue-500 text-white text-[12px] hover:bg-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      if (id === 0) {
                        setIsEmpty(true);
                        return;
                      }
                      window.location.href = `http://localhost:5173/admin/book/update/${id}`;
                    }}
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Body = ({ setIsLoading, currentBookInfo, id }) => {
  const [updateBookInfo, setUpdateBookInfo] = useState({
    title: currentBookInfo?.title,
    author: currentBookInfo?.author,
    ISBN: currentBookInfo?.ISBN,
    thumbnail: "",
    website: currentBookInfo?.website,
    publisher: currentBookInfo?.publisher,
    publishedDate: currentBookInfo?.publish_date,
    genre: currentBookInfo?.genre,
    language: currentBookInfo?.language,
    pages: currentBookInfo?.pages,
    description: currentBookInfo?.description,
    quantity: currentBookInfo?.quantity,
  });

  const [serverResponse, setServerResponse] = useState(null);

  const SubmitData = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const {
        data: { csrf_token: CSRFToken },
      } = await axios.get(
        `${import.meta.env.VITE_PRC_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );
      const {
        data: { token: Token },
      } = await axios.get(
        `${import.meta.env.VITE_PR_TOKEN}${
          import.meta.env.VITE_TOKEN_REQUEST_CODE
        }/`
      );

      const response = await axios.post(
        `http://127.0.0.1:8000/admins/book/update/${CSRFToken}/${Token}/?id=${id}`,
        updateBookInfo
      );

      setIsLoading(false);
      setServerResponse({
        type: response.data.status,
        message: response.data.message,
      });

      setTimeout(() => {
        setServerResponse(null);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setServerResponse({
        type: error.response.data.status,
        message: error.response.data.message,
      });

      setTimeout(() => {
        setServerResponse(null);
      }, 1500);
    }
  };

  useEffect(() => {
    if (serverResponse?.type === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [serverResponse]);

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Update Book</h1>
              <form
                className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5"
                onSubmit={SubmitData}
              >
                <h1 className="lg:col-span-2 text-xl font-bold">
                  Book Information
                </h1>
                <div className="flex flex-col">
                  <label htmlFor="BookTitle">Book Title</label>
                  <input
                    type="text"
                    placeholder="Harry Potter"
                    defaultValue={currentBookInfo?.title || ""}
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Author">Author</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        author: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.author || ""}
                    type="text"
                    placeholder="J.K. Rowling"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="ISBN">ISBN</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        ISBN: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.ISBN || ""}
                    type="text"
                    placeholder="1234567890"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Thumbnail">Thumbnail</label>
                  <Thumbnail
                    thumbnail={currentBookInfo?.thumbnail}
                    setAddBookInfo={setUpdateBookInfo}
                    updateBookInfo={updateBookInfo}
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Website">Website</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        website: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.website || ""}
                    type="text"
                    placeholder="https://"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Publisher">Publisher</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        publisher: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.publisher || ""}
                    type="text"
                    placeholder="Bloomsbury"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Published">Published</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        publishedDate: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.publish_date || ""}
                    type="date"
                    placeholder="1997"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Genre">Genre</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        genre: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.genre || ""}
                    type="text"
                    placeholder="Fantasy"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Language">Language</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        language: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.language || ""}
                    type="text"
                    placeholder="English"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="NoOfPage">No of pages</label>
                  <input
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        pages: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.pages || ""}
                    type="number"
                    placeholder="400"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    onChange={(e) =>
                      setUpdateBookInfo({
                        ...updateBookInfo,
                        description: e.target.value,
                      })
                    }
                    defaultValue={currentBookInfo?.description || ""}
                    rows={5}
                    placeholder="Leave a description here"
                  ></textarea>
                </div>
                <div className="lg:col-span-2">
                  <hr className="mx-20 my-10 border-[1px] border-[#303030]" />
                  <h1 className="text-xl font-bold mb-4">
                    Additional Information
                  </h1>
                  <div className="flex flex-col">
                    <label htmlFor="Quantity">Quantity</label>
                    <input
                      onChange={(e) =>
                        setUpdateBookInfo({
                          ...updateBookInfo,
                          quantity: e.target.value,
                        })
                      }
                      defaultValue={currentBookInfo?.quantity || ""}
                      type="number"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 my-5">
                  <button
                    type="submit"
                    className="outline-none hover:scale-105 rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="response"
        className={`${
          serverResponse
            ? serverResponse.type === "success"
              ? "bg-[#d4edda] text-[#155724] h-10"
              : "bg-[#f8d7da] text-[#721c24] h-10"
            : "h-0"
        } w-full font-bold left-[80px] px-2 transition-all duration-300 capitalize text-[15px] flex items-center z-10 lg:left-[240px] fixed top-0`}
      >
        {serverResponse ? serverResponse.message : null}
      </div>
    </div>
  );
};
