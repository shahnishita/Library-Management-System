import React, { useEffect, useState, useContext } from "react";
import SideBar from "../Global/SideBar";
import { UserContext } from "../../Client/Global/UserData";
import PreLoader from "../../Client/Global/PreLoader";
import axios from "axios";
import Loader from "../../Client/Global/loader";
import "./Book.css";
import ImageCropper from "../../Client/userProfile/Edit/cropper";
import { resizeImage } from "../../Client/userProfile/EditUserProfile";
import QRCodeGenerator from "../Global/QrCodeGen";
import NotFound from "../../Client/Global/NotFound";
import Cookies from "js-cookie";

const AddBook = () => {
  const [isPreLoading, setIsPreLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { DecodeUserData } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsPreLoading(true);
      document.title = `Add Book - Library of Congress`;
      try {
        await DecodeUserData();
        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isPreLoading) {
    return <PreLoader />;
  } else {
    const nonStaffTypes = ["guest", "member", "VIP"];
    if (nonStaffTypes.includes(Cookies.get("user_type"))) {
      return <NotFound />;
    }
    return (
      <div className="flex">
        <SideBar activeBookDrawer={"addBook"} activeDashboardTab={false} />
        <div className="flex-grow z-0">
          <Body setIsLoading={setIsLoading} />
        </div>
        <div
          className={`${
            isLoading ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full flex items-center justify-center`}
        >
          <Loader SvgWidth="25px" width="70px" />
        </div>
      </div>
    );
  }
};

export default AddBook;

export const Body = ({ setIsLoading }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const [addBookInfo, setAddBookInfo] = useState({
    title: "",
    author: "",
    ISBN: "",
    thumbnail: "",
    website: "",
    publisher: "",
    publishedDate: new Date().toISOString().split("T")[0],
    genre: "",
    language: "",
    pages: 0,
    description: "",
    quantity: 0,
  });

  const [addedBookLabel, setAddedBookLabel] = useState({
    label: "",
    identifier: "",
  });

  const SubmitBook = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        `http://127.0.0.1:8000/admins/book/add/${CSRFToken}/${Token}/`,
        addBookInfo
      );

      if (response.status === 200) {
        const qr = await QRCodeGenerator({
          url: `http://127.0.0.1:5173/admin/book/update/${response.data.id}`,
          identifier: response.data.id,
          width: 720,
          height: 720,
        });

        setAddedBookLabel({
          label: qr,
          identifier: response.data.id,
        });

        await axios.post(`http://127.0.0.1:8000/admins/book/label/add/`, {
          label: qr,
          identifier: response.data.id,
          title: addBookInfo.title,
        });
      }
      setServerResponse({
        type: response.data.status,
        message: response.data.message,
      });
      setTimeout(() => {
        setServerResponse(null);
      }, 1500);
    } catch (error) {
      if (error.response.data.message) {
        setServerResponse({
          type: error.response.data.status,
          message: error.response.data.message,
        });
        setTimeout(() => {
          setServerResponse(null);
        }, 1500);
      } else {
        setServerResponse({
          type: "error",
          message: "Something went wrong",
        });
        setTimeout(() => {
          setServerResponse(null);
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const DownloadQR = async (base64Str, title, identifier) => {
    const convertBase64ToBlob = (base64Data) => {
      const base64 = base64Data.split(",")[1] || base64Data;
      const padding = "=".repeat((4 - (base64.length % 4)) % 4);
      const base64Cleaned = (base64 + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64Cleaned);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return new Blob([outputArray], { type: "image/png" });
    };

    const blob = convertBase64ToBlob(base64Str);
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${title}-${identifier}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  const printQR = (base64Str) => {
    const qrImage = new Image();
    qrImage.src = base64Str;
    qrImage.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;
      context.drawImage(qrImage, 0, 0);
      const imageData = canvas.toDataURL("image/png");

      const windowContent = "<!DOCTYPE html>";
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.open();
      printWindow.document.write(windowContent);
      printWindow.document.write(
        "<html><head><title>Print QR Code</title></head><body>"
      );
      printWindow.document.write(`<img src="${imageData}" />`);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    };
  };

  useEffect(() => {
    if (addedBookLabel) {
      if (addedBookLabel.label) {
        document.body.style.overflow = "hidden";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [addedBookLabel]);

  useEffect(() => {
    const handleEscKey = (event) => {
      addedBookLabel && addedBookLabel.label && event.key === "Escape"
        ? (setAddedBookLabel(null), (document.body.style.overflow = "auto"))
        : null;
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [addedBookLabel, setAddedBookLabel]);

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3 relative">
          <div className="lg:w-[80%] mx-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">Add Book</h1>
              <form className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <h1 className="lg:col-span-2 text-xl font-bold">
                  Book Information
                </h1>
                <div className="flex flex-col">
                  <label htmlFor="BookTitle">Book Title</label>
                  <input
                    type="text"
                    placeholder="Harry Potter"
                    onChange={(e) =>
                      setAddBookInfo({ ...addBookInfo, title: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Author">Author</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({ ...addBookInfo, author: e.target.value })
                    }
                    type="text"
                    placeholder="J.K. Rowling"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="ISBN">ISBN</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({ ...addBookInfo, ISBN: e.target.value })
                    }
                    type="text"
                    placeholder="1234567890"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Thumbnail" className="">
                    Thumbnail
                  </label>
                  <Thumbnail
                    setAddBookInfo={setAddBookInfo}
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Website">Website</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({
                        ...addBookInfo,
                        website: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="https://"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="Publisher">Publisher</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({
                        ...addBookInfo,
                        publisher: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Bloomsbury"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="Published">Published</label>
                  <input
                    onChange={(e) => {
                      setAddBookInfo({
                        ...addBookInfo,
                        publishedDate: e.target.value,
                      });
                    }}
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="Genre">Genre</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({ ...addBookInfo, genre: e.target.value })
                    }
                    type="text"
                    placeholder="Fantasy"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="Language">Language</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({
                        ...addBookInfo,
                        language: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="English"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="NoOfPage">No of page</label>
                  <input
                    onChange={(e) =>
                      setAddBookInfo({ ...addBookInfo, pages: e.target.value })
                    }
                    type="number"
                    placeholder="400"
                  />
                </div>
                <div className="flex flex-col lg:col-span-2">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    onChange={(e) =>
                      setAddBookInfo({
                        ...addBookInfo,
                        description: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Leave a description here"
                  ></textarea>
                </div>
                <div className="lg:col-span-2">
                  <hr className="mx-20 my-10 border-[1px] border-[#303030]" />
                  <h1 className="text-xl font-bold mb-4">
                    Additional Information
                  </h1>
                  <div className="flex flex-col ">
                    <label htmlFor="Quantity">Quantity</label>
                    <input
                      onChange={(e) =>
                        setAddBookInfo({
                          ...addBookInfo,
                          quantity: e.target.value,
                        })
                      }
                      type="number"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 my-5">
                  <button
                    className="outline-none hover:scale-105 rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                    onClick={SubmitBook}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
            <div
              onClick={() => {
                setAddedBookLabel(null);
                document.body.style.overflow = "auto";
              }}
              className={`${
                addedBookLabel
                  ? addedBookLabel.label
                    ? "flex"
                    : "hidden"
                  : "hidden"
              } items-center justify-center  w-full h-screen absolute backdrop-blur-sm top-0 left-0`}
            >
              <div
                className="bg-[#161616] p-4 md:p-5 rounded-lg relative w-auto h-auto sm:h-[85%] sm:w-[70%] md:h-[50%] md:w-[80%] lg:w-[60%] xl:w-[50%] border-2 border-[#282828]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  className="sm:h-auto sm:w-full md:w-auto md:h-full xl:w-auto xl:h-full"
                  src={addedBookLabel ? addedBookLabel.label : ""}
                  alt={addedBookLabel ? addedBookLabel.title : ""}
                />
                <div className="absolute flex sm:flex-col flex-row-reverse top-5 right-5 gap-2 sm:bottom-5 sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-40px)] md:w-[30%] md:top-5 md:right-5 md:translate-x-1/2">
                  <button
                    className="text-[12px] sm:text-sm px-3 py-[2px] md:px-4 md:py-1 border-2 border-blue-500 transition-all duration-200 hover:bg-blue-600 bg-blue-500 rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      DownloadQR(
                        addedBookLabel.label,
                        addedBookLabel.title,
                        addedBookLabel.identifier
                      );
                    }}
                  >
                    Download
                  </button>
                  <button
                    className="text-[12px] sm:text-sm px-3 py-[2px] md:px-4 md:py-1 border-2 border-[#161616] transition-all duration-200 hover:bg-[#161616]/80 bg-[#161616] sm:bg-transparent sm:border-white sm:hover:bg-white sm:hover:text-[#161616] rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      printQR(addedBookLabel.label);
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
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
            : "bg-[#d4edda] text-[#155724] h-0"
        } w-full font-bold left-[80px] px-2 transition-all duration-300 capitalize text-[15px] flex items-center z-10 lg:left-[240px] fixed top-0`}
      >
        {serverResponse ? serverResponse.message : null}
      </div>
    </div>
  );
};

export const Thumbnail = ({
  thumbnail,
  className,
  setAddBookInfo,
}) => {
  const [file, setFile] = useState(null);
  const [thumbnailPic, setThumbnailPic] = useState(thumbnail || "");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleThumbnailPic = async (data) => {
    setFile(null);
    setThumbnailPic(data.src);
    const newThumbnailPic = await resizeImage({
      imgWidth: 800,
      imgHeight: 1200,
      base64Str: data.src,
    });

    setAddBookInfo((prev) => ({
      ...prev,
      thumbnail: newThumbnailPic,
    }));
  };

  return (
    <div className={className} style={file !== null ? { zIndex: 10 } : {}}>
      <div className="relative w-auto rounded-lg h-auto bg-[#282828] flex items-center justify-center">
        <img className=" h-[300px] rounded-lg" src={thumbnailPic} alt="" />
        <input
          accept=".jpg, .jpeg, .png"
          id="thumbnailPic"
          className="mt-10 hidden"
          type="file"
          onChange={handleFileChange}
        />
        <label
          htmlFor="thumbnailPic"
          className="absolute cursor-pointer w-full h-[300px] flex items-center justify-center top-0 left-0 rounded-lg hover:bg-[#00000080] transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-upload w-8 h-8"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
          </svg>
        </label>
      </div>
      {file !== null ? (
        <ImageCropper
          aspectRatio={2 / 3}
          file={file}
          onCropComplete={handleThumbnailPic}
        />
      ) : null}
    </div>
  );
};
