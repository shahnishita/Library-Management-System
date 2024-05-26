import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const StaffConfirmation = () => {
  const [staffCode, setStaffCode] = useState('');

  const [isCode, setIsCode] = useState(false);
  const [isRedOrLime, setIsRedOrLime] = useState(false);
  const [ValidationMessage, setValidationMessage] = useState('');
  const CodeRef = useRef(null);  


  useEffect(() => {
    CodeRef.current.focus();
  })


  return (
    <div className="bg-gradient-to-b from-indigo-500 to-gray-400 h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full h-screen md:w-[80%]  mx-auto md:h-[450px] relative  md:rounded-b-lg bg-[#282828ab]">
          <div className="w-full h-6 bg-[#282828] flex items-center justify-center">
            <p className="select-none text-white font-bold text-[12px] justify-center flex gap-2 items-center">
              Terminal <span className="text-[10px]">◉</span> Staff Confirmation
            </p>
          </div>
          <div
            className={` w-full h-[calc(100%-1.5rem)] px-2`}
          >
            <div className="flex w-full gap-2">
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <span
                  className='text-white select-auto max-w-full'
                >
                  staff code:{""}
                </span>
              </p>
              <input
                type="text"
                ref={CodeRef}
                onChange={(e) => setStaffCode(e.target.value)}
                className="p-0 bg-transparent text-white outline-none w-[50%]"
              />
            </div>
            <div className={`flex w-full gap-2`}>
              <p className="text-[lime] flex gap-2 select-none">
                guest@user: <span className="text-white">~$</span>
                <button
                  onClick={async () => {
                    
                    if (staffCode === import.meta.env.VITE_STAFF_CODE) {
                      Cookies.set('staff_code', staffCode, { expires: new Date(new Date().getTime() + 5 * 60 * 1000) });
                      setIsCode(true);
                      setIsRedOrLime(true);
                      setValidationMessage('Staff code accepted, Redirecting...');
                      setTimeout(() => {
                        window.location.reload();
                        setIsCode(false);
                      }, 1000);
                    } else {
                      setIsCode(true);
                      setIsRedOrLime(false);
                      setValidationMessage('Staff code not accepted. Please try again.');
                     setTimeout(() => {
                      setIsCode(false);
                     }, 2000);
                    }
                  
                    
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-bar-right text-white"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                    />
                  </svg>
                </button>
              </p>
            </div>
          </div>
          <div
            className={`${
              isCode ? "h-[40%] md:h-6" : "h-0"
            } text-white transition-all duration-300 w-full rounded-t-lg md:rounded-t-none md:rounded-b-lg bg-[#282828] text-[14px] absolute bottom-0 left-0 flex items-start py-2 md:py-0 md:items-center px-2 font-mono ${
              isRedOrLime ? "text-[lime]" : "text-[#EE0000]"
            }  `}
          >
            <p
              className={`${
                isCode ? "opacity-100" : "opacity-0"
              } flex gap-1 items-center transition-all duration-500`}
            >
              <span className={`text-[lime] text-[15px] select-none`}>➣</span>
              <span
                className={`${isRedOrLime ? "text-[lime]" : "text-[orange]"}`}
              >
                {ValidationMessage}
              </span>
            </p>
          </div>
        </div>
      </div>
  );
};

export default StaffConfirmation;
