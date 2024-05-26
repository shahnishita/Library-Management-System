import React from "react";

const Toast = ({background, text, visibility}) => {
  return (
    <div className={`${visibility} fixed inset-x-0 mx-auto bottom-0 z-50 p-4 w-[90%] md:w-[40%]`}>
      <div className={`${background} relative flex items-center justify-between gap-4 rounded-full px-4 py-3 text-white shadow-lg`}>
        <p className="text-sm font-bold">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Toast;
