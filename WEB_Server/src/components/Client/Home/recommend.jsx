import React from "react";

const Recommend = ({ title, genre, search, thumbnail }) => {
  return (
    <>
      <section className="hidden md:grid grid-cols-12 border-2 border-t-[#161616] border-b-[#282828] border-l-0 border-r-0 ">
        <section className="col-span-6 flex flex-col justify-center text-white bg-[#161616] h-80 px-12 py-6">
          <h3 className="text-sm text-[#CCCCCC] mb-4">Recommended Book</h3>
          <h1 className="text-3xl mb-2 font-black truncate">{title}</h1>
          <div className="flex gap-12 max-w-[50%] justify-between">
            <h4 className="text-[11px] text-[#CCCCCC] mb-4">{genre}</h4>
            <h4 className="w-[1px] h-[16px] bg-[#CCCCCC]"></h4>
            <h4 className="text-[11px] text-[#CCCCCC] mb-4">
              Search: {search}+
            </h4>
          </div>
          <div className="flex gap-4 mt-6">
            <button className="text-white bg-[#EE0000] rounded-full px-6 py-[5px] text-[12px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300">
              Read
            </button>
            <button className="text-black bg-[white] rounded-full px-6 py-[5px] text-[12px] font-bold hover:bg-[#CCCCCC] hover:transition hover:duration-300">
              Save for Later
            </button>
          </div>
        </section>
        <section className="col-span-6 px-10 py-6 bg-[#282828] h-80 flex justify-center">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="shadow-xl shadow-[black] h-full"
          />
        </section>
      </section>
      <section className="relative grid md:hidden grid-cols-12 border-2 border-t-[#161616] border-b-[#282828] border-l-0 border-r-0       ">
        <section className=" col-span-12 flex flex-col justify-center text-white bg-[#161616] h-80 px-6 py-6">
          <div className="z-[1]">
            <h3 className="text-sm text-[#CCCCCC] mb-4">Recommended Book</h3>
            <h1 className="text-3xl mb-2 font-black truncate">{title}</h1>
            <div className="flex gap-12 max-w-[80%] justify-between">
              <h4 className="text-[11px] text-[#CCCCCC] mb-4">{genre}</h4>
              <h4 className="w-[1px] h-[16px] bg-[#CCCCCC]"></h4>
              <h4 className="text-[11px] text-[#CCCCCC] mb-4">
                Search: {search}+
              </h4>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="text-white bg-[#EE0000] rounded-full px-6 py-[5px] text-[12px] font-medium hover:bg-[#CC0000] hover:transition hover:duration-300">
                Read
              </button>
              <button className="text-black bg-[white] rounded-full px-6 py-[5px] text-[12px] font-bold hover:bg-[#CCCCCC] hover:transition hover:duration-300">
                Save for Later
              </button>
            </div>
          </div>
          <div
            className="absolute inset-0 z-[0]"
            style={{
              WebkitMaskSize: "100% 100%",
              WebkitMaskImage:
                "-webkit-gradient(linear, left top, right bottom, color-stop(0, rgba(0,0,0,1)), color-stop(0, rgba(0,0,0,0)), color-stop(0.51, rgba(0,0,0,5%)), color-stop(1.00, rgba(0,0,0,30%)))",
            }}
          >
            <img
              src={thumbnail}
              className="w-full h-full inset-0 object-cover absolute"
              alt=""
            />
          </div>
        </section>
      </section>
    </>
  );
};

Recommend.defaultProps = {
  title: "The Catcher in the Rye",
  genre: "Fiction",
  search: "49",
  thumbnail:
    "https://upload.wikimedia.org/wikipedia/commons/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg",
};

export default Recommend;
