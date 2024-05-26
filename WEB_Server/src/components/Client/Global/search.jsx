import React from "react";
import { useState } from "react";

const Search = ({ close, isOpen }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const resetSearch = () => {
    document.getElementById("searchForm").reset();
    setIsChecked(false);
  };

  const search = () => {
    if (!author && !title) {
      alert("Please enter either author or title.");
      return;
    }
    const blockedSymbolsPattern = /[<>&"\(\){};\|*#]/g;

    if (
      author.match(blockedSymbolsPattern) ||
      title.match(blockedSymbolsPattern)
    ) {
      alert("Please do not enter any special characters in the search.");
      return;
    }

    window.location.href = `/books/search/${encodeURIComponent(
      author === "" ? "all" : author
    )}/${encodeURIComponent(title === "" ? "all" : title)}/${
      isChecked ? "available" : "all"
    }`;
  };

  return (
    <div className={`${!isOpen ? "hidden" : "block"}`}>
      <div
        onClick={close}
        className="w-full h-full absolute top-0 left-0 backdrop-blur-[20px] z-[50]"
      ></div>
      <div className="fixed text-white right-3 top-2 z-[100]">
        <button onClick={close}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </button>
      </div>
      <div className="z-[100] flex flex-col fixed top-1/2 left-1/2 px-6 text-white py-4 transform -translate-x-1/2 -translate-y-1/2 rounded-lg md:w-[30rem] w-[22rem] h-[30rem] bg-[#161616]">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Search</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="16"
            height="16"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
        <hr className="my-2 border-[#4a4a4a]" />
        <form id="searchForm" onSubmit={search}>
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="flex flex-col col-span-12 md:col-span-6">
              <label
                htmlFor="author"
                className="mb-1 text-[#CCCCCC] text-[0.7rem] md:text-[0.9rem]"
              >
                Author
              </label>
              <input
                onChange={(e) => setAuthor(e.target.value)}
                type="text"
                className="bg-[#383838] text-white rounded-sm px-2 md:px-1 text-[0.7rem] md:text-[0.8rem] py-2 md:py-1 outline-none"
                placeholder="Enter author name"
              />
            </div>

            <div className="flex flex-col col-span-12 md:col-span-6">
              <label
                htmlFor="author"
                className="mb-1 text-[#CCCCCC] text-[0.7rem] md:text-[0.9rem]"
              >
                Book Title
              </label>
              <input
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                type="text"
                className="bg-[#383838] text-white rounded-sm px-2 md:px-1 text-[0.7rem] md:text-[0.8rem] py-2 md:py-1 outline-none"
                placeholder="Enter book title"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-4">
            <label
              className={`flex cursor-pointer flex-col rounded-lg gap-2 items-center justify-center mt-4 mb-4 col-span-4 border ${
                isChecked ? "border-[lime]" : "border-[#4a4a4a]"
              } px-2 py-3`}
              htmlFor="custom-checkbox"
            >
              <input
                type="checkbox"
                id="custom-checkbox"
                className="hidden"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="select-none text-center text-[#CCCCCC] text-[0.6rem] md:text-[0.9rem] font-black">
                Available
              </span>
            </label>
          </div>
        </form>
        <div className="w-full self-end py-5 pl-10 absolute flex justify-between bottom-0">
          <button
            onClick={resetSearch}
            className="text-white rounded-full px-4 text-[14px] md:text-[15px] font-bold"
          >
            Reset
          </button>
          <button
            onClick={search}
            className="text-white bg-[#EE0000] rounded-full px-4 py-[4px] text-[14px] md:text-[15px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
