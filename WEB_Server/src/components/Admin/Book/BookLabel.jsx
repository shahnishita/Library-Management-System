import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../Global/SideBar";
import { UserContext } from "../../Client/Global/UserData";
import PreLoader from "../../Client/Global/PreLoader";
import axios from "axios";
import Loader from "../../Client/Global/loader";
import "./Book.css";
import QRCodeGenerator from "../Global/QrCodeGen";
import Cookies from "js-cookie";
import NotFound from "../../Client/Global/NotFound";


const BookLabel = () => {
  const { id, type } = useParams();
  const { DecodeUserData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [serverResponse, setServerResponse] = useState({
    type: "",
    data: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      document.title = `Request - Library of Congress`;
      try {
        await DecodeUserData();
        if (id !== undefined) await fetchBookData();
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBookData = async () => {
    try {
      let res;
      if (type === "get") {
        res = await axios.get(
          `http://127.0.0.1:8000/admins/book/label/?id=${id}&type=get`
        );
      } else if (type === "generate") {
        const bookDataRes = await axios.get(
          `http://127.0.0.1:8000/admins/book/info/?q=${id}`
        );

        const qr = await QRCodeGenerator({
          url: `http://127.0.0.1:5173/admin/book/update/${bookDataRes.data.bookID}`,
          identifier: bookDataRes.data.bookID,
          width: 720,
          height: 720,
        });

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

        res = await axios.post(
          `http://127.0.0.1:8000/admins/book/label/?id=${id}&type=create&csrf_token=${CSRFToken}&token=${Token}`,
          {
            label: qr,
            identifier: bookDataRes.data.BookUID,
            title: bookDataRes.data.BookTitle,
          }
        );
      }
      setServerResponse({ type: "found", data: res.data });
    } catch (error) {
      setServerResponse({ type: "not-found", data: error.response.data });
      console.error("Error fetching book data:", error);
    }
  };

  const nonStaffTypes = ["guest", "member", "VIP"];

  if (loading) return <PreLoader />;
  if (
    !Cookies.get("remember") ||
    !localStorage.getItem("localData") ||
    nonStaffTypes.includes(Cookies.get("user_type"))
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar activeBookDrawer="bookLabel" activeDashboardTab={false} />
      <div className="flex-grow">
        {id === undefined || type === undefined ? (
          <SearchBook />
        ) : serverResponse.type === "found" ? (
          type === "get" ? (
            <Body
              pageTitle={"Book Label"}
              title={serverResponse.data.title}
              label={serverResponse.data.label}
              id={serverResponse.data.id}
            />
          ) : type === "generate" ? (
            <Body
              pageTitle={"New Generated Book Label"}
              title={serverResponse.data.title}
              label={serverResponse.data.label}
              id={serverResponse.data.id}
            />
          ) : (
            <NoBookFound message={serverResponse.data.message} sub_message={serverResponse.data.sub_message} />
          )
        ) : (
          serverResponse.type === "not-found" && <NoBookFound message={serverResponse.data.message} sub_message={serverResponse.data.sub_message} />
        )}
        <div
          className={`${
            loading ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center`}
        >
          <Loader SvgWidth="25px" width="70px" />
        </div>
      </div>
    </div>
  );
};

export default BookLabel;

export const NoBookFound = ({ message, sub_message }) => {
  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col w-full h-full min-h-screen justify-center items-center">
              <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-bold">
                {message}
              </h1>
              <p className="text-sm sm:text-md md:text-lg text-center">
                {sub_message}{" "}
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
  const [id, setId] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedOption, setSelectedOption] = useState("getLabel");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    if (selectedOption === "getLabel") {
      window.location.href = `http://localhost:5173/admin/book/label/${id}/get`;
    } else if (selectedOption === "generateLabel") {
      window.location.href = `http://localhost:5173/admin/book/label/${id}/generate`;
    }
  };

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Search</h1>
              <form
                className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-1 items-start">
                  <label htmlFor="BookID">Book ID</label>
                  <input
                    className={`${
                      isEmpty ? "border-red-500" : "border-[#282828]"
                    } appearance-none transition-all duration-300 px-3 py-2.5 border-2`}
                    type="number"
                    placeholder="123456"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor="select_get"
                  >
                    <span
                      className={`${
                        selectedOption === "getLabel" ? "border-blue-500" : ""
                      } border-4 cursor-pointer w-5 h-5 inline-block bg-black rounded-full`}
                      onClick={() => setSelectedOption("getLabel")}
                    ></span>
                    <span className="mt-[1.5px] text-[16px]">Get Label</span>
                  </label>
                  <input
                    id="select_get"
                    className="hidden"
                    type="radio"
                    checked={selectedOption === "getLabel"}
                    onChange={() => setSelectedOption("getLabel")}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor="select_gen"
                  >
                    <span
                      className={`${
                        selectedOption === "generateLabel"
                          ? "border-blue-500"
                          : ""
                      } border-4 cursor-pointer w-5 h-5 inline-block bg-black rounded-full`}
                      onClick={() => setSelectedOption("generateLabel")}
                    ></span>
                    <span className="mt-[1.5px] text-[16px]">
                      Generate New Label
                    </span>
                  </label>
                  <input
                    id="select_gen"
                    className="hidden"
                    type="radio"
                    checked={selectedOption === "generateLabel"}
                    onChange={() => setSelectedOption("generateLabel")}
                  />
                </div>
                <div className="lg:col-span-2">
                  <button
                    className="outline-none hover:scale-110 transition-all duration-300 rounded-md px-3 py-1.5 bg-blue-500 text-white text-[15px] hover:bg-blue-600"
                    type="submit"
                  >
                    Search
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

export const Body = ({ label, id, title, pageTitle }) => {
  const downloadLabel = async () => {
    try {
      const response = await fetch(label, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the label image:", error);
    }
  };

  const printLabel = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Label</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            }
            body {
              background-color: white;
              color: black;
              text-align: center;
              margin: 0;
              padding: 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border: 2px solid black;
              border-radius: 20px;
            }
          </style>
        </head>
        <body>
          <img src="${label}" alt="Book Label" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{pageTitle}</h1>
              <form className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="flex flex-col lg:col-span-2 gap-1 items-start">
                  <label>Book Title</label>
                  <input
                    disabled
                    className={`appearance-none lg:w-1/2 transition-all duration-300 px-3 py-2.5`}
                    defaultValue={title}
                  />
                </div>

                <div className="flex lg:col-span-2 flex-col gap-1 items-start">
                  <label>Book ID</label>
                  <input
                    disabled
                    className={`appearance-none lg:w-1/2 transition-all duration-300 px-3 py-2.5`}
                    defaultValue={id}
                  />
                </div>

                <div className="flex lg:col-span-2 flex-col gap-1 items-start">
                  <label>Label</label>
                  <img
                    src={label}
                    className="appearance-none w-full sm:w-1/2 lg:w-[40%] xl:w-[30%] transition-all duration-300"
                  />
                </div>
                <div className="lg:col-span-2 flex gap-4 mt-2 mb-8">
                  <button
                    type="button"
                    onClick={printLabel}
                    className="text-[15px] min-w-[100px] outline-none hover:scale-110 transition-all duration-300 rounded-md px-3 py-1.5 bg-[#404040] text-white text-[12px] hover:bg-[#505050]"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={downloadLabel}
                    className="text-[15px] min-w-[100px] outline-none hover:scale-110 transition-all duration-300 rounded-md px-3 py-1.5 bg-blue-500 text-white text-[12px] hover:bg-blue-600"
                  >
                    Download
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
