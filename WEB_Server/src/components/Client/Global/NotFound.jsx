import React, { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);
  return (
    <div className="w-full h-screen bg-[#161616] text-white gap-4 flex flex-col justify-center items-center">
      <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold">
        Sorry, this page isn't available
      </p>
      <p className="text-sm sm:text-md md:text-lg text-center">
        The link you followed may be broken, or the page may have been removed.{" "}
        <span className="text-blue-400 cursor-pointer hover:text-blue-600">
          <a href="/">Go back to Homepage</a>
        </span>
      </p>
    </div>
  );
};

export default NotFound;
