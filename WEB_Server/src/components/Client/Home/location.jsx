import React, { useState } from "react";

export const Time = ({ day, time }) => {
  return (
    <div className="flex gap-10 justify-between">
      <h1 className=" text-md font-bold w-[5.50rem]">{day}</h1>
      <span className="text-md font-bold">{time}</span>
    </div>
  );
};


const Location = () => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    <section className="grid grid-cols-12 border-2 md:bg-transparent  bg-gradient-to-t from-[#161616] to-[#282828] border-b-[#282828] border-t-[#282828] border-l-0 border-r-0">
      <section className="flex flex-col col-span-12 md:col-span-6 px-5 md:px-10 py-8 md:py-9 bg-transparent md:bg-[#282828] h-[450px] flex justify-center">
        <h1 className="mb-6 text-2xl md:text-3xl font-bold text-white">
          Operating Hours & Location
        </h1>
        <iframe
          className="cursor-pointer h-[90%] w-[100%] md:w-[90%] rounded-xl mb-6"
          title="map"
          src="../../../map/index.html"
          frameBorder="0"
        ></iframe>
        <h2 className="text-white text-sm md:text-md mt-1">101 Independence Ave SE</h2>
        <h2 className="text-white text-sm md:text-md">Washington, DC</h2>
      </section>
      <section className="flex items-center items-center justify-center col-span-12 md:col-span-6 flex flex-col justify-center text-white bg-transparent md:bg-[#161616] h-[270px] md:h-[450px] px-8 md:px-12 py-6">
        <div className="flex flex-col w-full md:w-auto gap-1">
            <Time day={"Monday"} time={"9:00 AM - 5:00 PM"} />
            <Time day={"Tuesday"} time={"9:00 AM - 5:00 PM"} />
            <Time day={"Wednesday"} time={"9:00 AM - 5:00 PM"} />
            <Time day={"Thursday"} time={"9:00 AM - 5:00 PM"} />
            <Time day={"Friday"} time={"9:00 AM - 4:00 PM"} />
            <Time day={"Saturday"} time={"9:00 AM - 2:30 PM"} />
            <Time day={"Sunday"} time={"Closed"} />
        </div>
      </section>
    </section>
  );
};

export default Location;
