import React, { useEffect } from "react";
import PreLoaderVid from "../../../assets/video/dark_gray.mp4";

const PreLoader = () => {
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      if (event.keyCode === 123) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#171617] flex items-center justify-center select-none">
      <video
        src={PreLoaderVid}
        autoPlay
        loop
        muted
        className="w-auto h-[30%] object-cover"
      ></video>
    </div>
  );
};

export default PreLoader;
