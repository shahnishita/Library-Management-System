import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../Global/SideBar";
import { UserContext } from "../../Client/Global/UserData";
import PreLoader from "../../Client/Global/PreLoader";
import axios from "axios";
import Loader from "../../Client/Global/loader";
import styles from "./AddBook/addBook.module.css";
import ImageCropper from "../../Client/userProfile/Edit/cropper";
import { resizeImage } from "../../Client/userProfile/EditUserProfile";
import QRCodeGenerator from "../Global/QrCodeGen";
import Cookies from "js-cookie";
import NotFound from "../../Client/Global/NotFound";

const AddBook = () => {
  const { EncryptedRequestData } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [isPreLoading, setIsPreLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { DecodeUserData } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsPreLoading(true);
      document.title = `Request - Library of Congress`;
      try {
        await DecodeUserData();
        setIsPreLoading(false);
      } catch (error) {
        setIsPreLoading(false);
      }
    };

    fetchData();
  }, []);

  const nonStaffTypes = ["guest", "member", "VIP"];

  if (isPreLoading) {
    return <PreLoader />;
  }

  if ((!Cookies.get("remember") || !localStorage.getItem("localData")) || (nonStaffTypes.includes(Cookies.get("user_type")))) {
    return <NotFound />;
  }

  return (
    <div className="flex">
      <SideBar activeAddTab={true} activeDashboardTab={false} />
      <div className="flex-grow">
        <Body />
        {/* <Loader SvgWidth="25px" width="70px" /> */}
      </div>
    </div>
  );
};

export default AddBook;

export const Body = () => {
  const [addBookInfo, setAddBookInfo] = useState({
    title: "",
    author: "",
    ISBN: "",
    thumbnail: "",
    website: "",
    publisher: "",
    publishedDate: "",
    genre: "",
    language: "",
    pages: 0,
    description: "",
    quantity: 0,
  });

  const SubmitBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/admins/book/add/`,
        addBookInfo
      );

      console.log(response);
      if (response.status === 200) {
        console.log(response.data.id);
        const qr = await QRCodeGenerator({
          url: "http://127.0.0.1:8000/",
          identifier: response.data.id,
          width: 720,
          height: 720,
        });
        console.log(qr);
        const pushLabel = await axios.post(
          `http://127.0.0.1:8000/admins/book/label/add/`,
          {
            label: qr,
          }
        );
      }
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="ml-[80px] lg:ml-[240px] w-[calc(100% - 80px)] lg:w-[calc(100% - 240px)] bg-[#161616] min-h-screen h-full py-5 px-5 text-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="col-span-3">
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
                    addBookInfo={addBookInfo}
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
                    onChange={(e) =>
                      setAddBookInfo({
                        ...addBookInfo,
                        publishedDate: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="1997"
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
                <button onClick={SubmitBook}>Add Book</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Thumbnail = ({ className, setAddBookInfo, addBookInfo }) => {
  const [file, setFile] = useState(null);
  const [thumbnailPic, setThumbnailPic] = useState();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleThumbnailPic = async (data) => {
    setThumbnailPic(data.src);
    const newThumbnailPic = await resizeImage({
      imgWidth: 800,
      imgHeight: 1200,
      base64Str: data.src,
    });

    setAddBookInfo({ ...addBookInfo, thumbnail: newThumbnailPic });
  };

  return (
    <div
      className={className}
      style={file !== null ? { zIndex: 10 } : { zIndex: 0 }}
    >
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
