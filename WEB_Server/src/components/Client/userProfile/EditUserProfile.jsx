import React, { useEffect, useState, useContext } from "react";
import { handleGender, fetchUserDatas, checkLocation } from "../userprofile";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import NotFound from "../Global/NotFound";
import { BackIcon } from "../Book/Borrow";
import ImageCropper from "./Edit/cropper";
import axios from "axios";
import PreLoader from "../Global/PreLoader";
import Loader from "../Global/loader";
import { UserContext } from "../Global/UserData";

const EditUserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [isPreLoading, setIsPreLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `Edit Profile(@${username}) - Library of Congress`;
    setIsPreLoading(true);
    const fetchData = async () => {
      const user = await fetchUserDatas({ username });
      setUser(user);
      setIsPreLoading(false);
    };
    fetchData();
  }, []);

  if (isPreLoading) {
    return <PreLoader />;
  } else {
    if (Cookies.get("remember") === user.session_code) {
      return (
        <section>
          <div
            className="h-[240px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${user.cover_pic})`,
            }}
          >
            <div className="h-[240px] bg-black/40">
              <a
                className="absolute z-10 top-2 left-2 p-2 rounded-md transition duration-300 hover:bg-gray-700"
                href={`/u/${username}`}
              >
                <BackIcon />
              </a>
            </div>
          </div>

          <div className="p-6  text-white -mt-[30px] rounded-t-[25px] bg-[#161616] lg:h-[250px]">
            <div className="flex lg:flex-row flex-col items-center">
              <img
                className="h-[200px] w-[200px] border-4 border-[#161616] lg:ml-20 -mt-[125px] lg:-mt-[200px] rounded-full"
                src={`${user.profile_pic}`}
                alt="display pic"
              />
              <div className="flex flex-col w-full gap-3 items-center lg:items-start">
                <p className="flex items-start gap-2 lg:ml-10 mt-6 text-2xl md:text-3xl  lg:text-4xl font-medium uppercase">
                  <span>
                    {user.first_name !== null && user.last_name !== null
                      ? user.first_name + " " + user.last_name
                      : "Not provided"}
                  </span>
                  {handleGender({ width: 20, height: 20, user: user })}
                </p>
                <div className="container mx-auto flex lg:flex-row flex-col lg:items-center my-7 lg:mt-4 lg:ml-10 lg:gap-40">
                  <a
                    href={`/u/${username}`}
                    className="flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      fill="currentColor"
                      className="bi bi-at"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
                    </svg>
                    <p className="text-sm font-light">{user.username}</p>
                  </a>

                  <a
                    target="_blank"
                    href={`https://www.google.com/maps?q=${user.city},+${user.state},+${user.country}`}
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-house"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                    </svg>
                    <p className="text-lg font-light">
                      {checkLocation({
                        user: user,
                        nullStyles: "text-sm",
                        cityStyles: "text-sm font-light",
                        countryStyles: "text-sm text-[#bebebe96] font-light",
                      })}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full bg-[#282828] h-auto text-white">
            <div className="absolute select-none flex items-center justify-center top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-t from-[#161616] to-[#282828] rounded-full border-2 border-gray-700 shadow-lg shadow-[black] w-96 h-12 ">
              <p className="text-lg font-medium">Edit Profile</p>
            </div>
            <div className="container h-full flex mx-auto">
              <EditUserForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                user={user}
              />
            </div>
          </div>
          {isLoading && (
          <div className="fixed top-[50%] left-[50%] transform translate-x-[-50%] -translate-y-1/2 z-[100]">
            <Loader width="100px" SvgWidth="40px" />
          </div>
        )}
        </section>
      );
    } else {
      return <NotFound />;
    }
  }
};

export default EditUserProfile;

const EditUserForm = ({ user, isLoading, setIsLoading }) => {
  const [ProfileEditInfo, setProfileEditInfo] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    city: user.city,
    state: user.state,
    country: user.country,
    email: user.email,
    address1: user.address1,
    address2: user.address2,
    pincode: user.pincode,
    gender: user.gender,
    profile_pic: "",
    cover_pic: "",
    session_code: Cookies.get("remember"),
  });
  const [EditResponse, setEditResponse] = useState({
    message: "",
    type: "",
    sub_message: "",
  })
  const { fetchUserData } = useContext(UserContext);


  const SubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const [CSRFResponse, TokenResponse] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_PRC_TOKEN}${
            import.meta.env.VITE_TOKEN_REQUEST_CODE
          }/`
        ),
        axios.get(
          `${import.meta.env.VITE_PR_TOKEN}${
            import.meta.env.VITE_TOKEN_REQUEST_CODE
          }/`
        ),
      ]);
      const CSRFToken = CSRFResponse.data.csrf_token;
      const Token = TokenResponse.data.token;

      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/profile/edit/${CSRFToken}/${Token}/?q=${Cookies.get(
          "remember"
        )}`,
        ProfileEditInfo
      );

      await fetchUserData(response.data.uid);
      setIsLoading(false);
      setEditResponse({
        message: response.data.message,
        type: response.data.status,
      })
    } catch (err) {
      setIsLoading(false);
      return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-14 my-16 mx-auto w-[88%] md:w-[75%] lg:w-[60%] xl:w-[50%]">
      <div className="w-full bg-[#161616] flex justify-between items-center rounded-lg p-4">
        <div className="flex items-center gap-4">
          <ProfilePic
            ProfileEditInfo={ProfileEditInfo}
            setProfileEditInfo={setProfileEditInfo}
            user={user}
            className={"h-16 md:h-24"}
          />
          <div>
            <h1 className="text-lg md:text-2xl font-bold">{user.username}</h1>
            <p className="text-[12px] md:text-sm">
              {user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        <label
          htmlFor="profilePic"
          className="cursor-pointer hover:bg-red-600 bg-red-500 h-9 flex items-center rounded-md px-2 md:px-4 py-2 text-sm md:text-md"
        >
          Change photo
        </label>
      </div>
      <div className="aspect-[16/9] h-full bg-[#161616] flex justify-between items-center rounded-lg p-4">
        <CoverPic
          user={user}
          className={"h-full w-full"}
          ProfileEditInfo={ProfileEditInfo}
          setProfileEditInfo={setProfileEditInfo}
        />
      </div>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">First Name</label>
          <input
            onChange={(e) =>
              setProfileEditInfo({
                ...ProfileEditInfo,
                first_name: e.target.value,
              })
            }
            defaultValue={user.first_name ? user.first_name : ""}
            className="w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">Last Name</label>
          <input
            onChange={(e) =>
              setProfileEditInfo({
                ...ProfileEditInfo,
                last_name: e.target.value,
              })
            }
            defaultValue={user.last_name ? user.last_name : ""}
            className="w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">Username</label>
          <input
            disabled={true}
            defaultValue={user.username ? user.username : ""}
            className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">Email</label>
          <input
            onChange={(e) => {
              user.account_type === "google"
                ? null
                : setProfileEditInfo({
                    ...ProfileEditInfo,
                    email: e.target.value,
                  });
            }}
            disabled={user.account_type === "google" ? true : false}
            defaultValue={user.email ? user.email : ""}
            className="disabled:cursor-not-allowed disabled:opacity-90 lowercase w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          />
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6 md:col-span-4 flex flex-col gap-2">
            <label className="text-md font-bold">Country</label>
            <input
              onChange={(e) =>
                setProfileEditInfo({
                  ...ProfileEditInfo,
                  country: e.target.value,
                })
              }
              defaultValue={user.country ? user.country : ""}
              className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
              type="text"
            />
          </div>
          <div className="col-span-6 md:col-span-4 flex flex-col gap-2">
            <label className="text-md font-bold">State</label>
            <input
              onChange={(e) =>
                setProfileEditInfo({
                  ...ProfileEditInfo,
                  state: e.target.value,
                })
              }
              defaultValue={user.state ? user.state : ""}
              className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
              type="text"
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
            <label className="text-md font-bold">City</label>
            <input
              onChange={(e) =>
                setProfileEditInfo({ ...ProfileEditInfo, city: e.target.value })
              }
              defaultValue={user.city ? user.city : ""}
              className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
              type="text"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-6 flex flex-col gap-2">
            <label className="text-md font-bold">Address 1</label>
            <input
              onChange={(e) =>
                setProfileEditInfo({
                  ...ProfileEditInfo,
                  address1: e.target.value,
                })
              }
              defaultValue={user.address1 ? user.address1 : ""}
              className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
              type="text"
            />
          </div>
          <div className="col-span-6 flex flex-col gap-2">
            <label className="text-md font-bold">Address 2</label>
            <input
              onChange={(e) =>
                setProfileEditInfo({
                  ...ProfileEditInfo,
                  address2: e.target.value,
                })
              }
              defaultValue={user.address2 ? user.address2 : ""}
              className="disabled:cursor-not-allowed disabled:opacity-90 w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">Zip Code</label>
          <input
            onChange={(e) =>
              setProfileEditInfo({
                ...ProfileEditInfo,
                pincode: e.target.value,
              })
            }
            defaultValue={user.pincode ? user.pincode : ""}
            className=" w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md font-bold">Gender</label>
          <select
            onChange={(e) =>
              setProfileEditInfo({ ...ProfileEditInfo, gender: e.target.value })
            }
            defaultValue={user.gender ? user.gender : "O"}
            className=" w-full text-md bg-[#161616] px-4 py-3 outline-none rounded-lg"
            type="text"
          >
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        {
          EditResponse.message !== "" ? (<p>
            <span className={EditResponse.type === "success" ? "text-green-500" : "text-red-500"}>{EditResponse.message}</span>
          </p>) : ("")
        }
        <button
          onClick={SubmitHandler}
          className="bg-red-500 text-md hover:bg-red-600 mt-5 w-[40%] self-end text-white px-4 py-3 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export const ProfilePic = ({
  user,
  className,
  setProfileEditInfo,
  ProfileEditInfo,
}) => {
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(user.profile_pic);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleProfilePic = async (data) => {
    setProfilePic(data.src);

    const newProfilePic = await resizeImage({
      imgWidth: 1000,
      imgHeight: 1000,
      base64Str: data.src,
    });

    setProfileEditInfo({ ...ProfileEditInfo, profile_pic: newProfilePic });
  };

  return (
    <form
      className={className}
      style={file !== null ? { zIndex: 10 } : { zIndex: 0 }}
    >
      <div className="relative aspect-[1/1] h-full">
        <img className="rounded-full" src={profilePic} alt="" />
        <input
        accept=".jpg, .jpeg, .png"
          id="profilePic"
          className="mt-10 hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      {file !== null ? (
        <ImageCropper
          aspectRatio={1 / 1}
          file={file}
          onCropComplete={handleProfilePic}
        />
      ) : null}
    </form>
  );
};

export const CoverPic = ({
  user,
  className,
  setProfileEditInfo,
  ProfileEditInfo,
}) => {
  const [file, setFile] = useState(null);
  const [coverPic, setCoverPic] = useState(user.cover_pic);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleCoverPic = async (data) => {
    setCoverPic(data.src);
    const newCoverPic = await resizeImage({
      imgWidth: 1280,
      imgHeight: 720,
      base64Str: data.src,
    });

    setProfileEditInfo({ ...ProfileEditInfo, cover_pic: newCoverPic });
  };

  return (
    <form
      className={className}
      style={file !== null ? { zIndex: 10 } : { zIndex: 0 }}
    >
      <div className="relative w-auto h-auto">
        <img
          className="aspect-[16/9] h-full w-full rounded-lg"
          src={coverPic}
          alt=""
        />
        <input
        accept=".jpg, .jpeg, .png"
          id="coverPic"
          className="mt-10 hidden"
          type="file"
          onChange={handleFileChange}
        />
        <label
          htmlFor="coverPic"
          className="absolute cursor-pointer aspect-[16/9] h-full flex items-center justify-center top-0 left-0 rounded-lg hover:bg-[#00000070] transition-all duration-200"
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
          aspectRatio={16 / 9}
          file={file}
          onCropComplete={handleCoverPic}
        />
      ) : null}
    </form>
  );
};

export const resizeImage = async ({ base64Str, imgWidth, imgHeight }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = imgWidth;
      const MAX_HEIGHT = imgHeight;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = base64Str;
  });
};
