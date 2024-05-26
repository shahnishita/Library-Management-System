import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";


const Gallery = ({ libImg }) => {

  if (!libImg || libImg.length === 0) {
    return null;
  }

  return (
    <div className="w-full pb-16 md:pb-20 pt-12 md:pt-14 px-5 md:px-12 bg-[#161616]">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-8 md:mb-10">Library Gallery</h1>
      <div className="">
        <Swiper
          breakpoints={{
            340: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            700: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
          }}
          freeMode={true}
          modules={[FreeMode]}
        >
          {libImg.map((item, index) => (
            item ? (
              <SwiperSlide key={index}>
                <div className="h-[220px] group cursor-grab shadow-3xl shadow-[black]">
                  <div
                    className="absolute rounded-lg inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item})` }}
                  />
                  <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-50" />
                </div>
              </SwiperSlide>
            ) : null
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Gallery;
