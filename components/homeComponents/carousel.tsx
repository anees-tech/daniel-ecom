import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

interface CarouselProps {
  data: { id: number; image: string; title?: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const sliderRef = React.useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dotsClass: "slick-dots flex justify-center gap-2 absolute bottom-4 w-full",
  };

  return (
    <div className="relative w-full max-w-md m-auto overflow-hidden">
      {/* Background Shape & Icon */}

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-4 py-2">
            <Image
              src={item.image}
              alt={item.title || "Carousel Image"}
              width={100} // Increased for iPad
              height={100}
              className="w-1/3 md:w-1/3 lg:w-1/2 h-auto object-contain m-auto"
            />
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-20 sm:left-20 md:left-5 top-1/2 -translate-y-1/2 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-900 transition"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft size={18} color="black hover:white" />
      </button>

      <button
        className="absolute right-20 sm:right-20 md:right-5 top-1/2 -translate-y-1/2 p-2 bg-gray-800/50 text-white rounded-full hover:bg-gray-900 transition"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight size={18} color="black hover:white" />
      </button>
    </div>
  );
};

export default Carousel;
