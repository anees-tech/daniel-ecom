"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

interface CarouselProps {
  data: { id: number; image: string; title?: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots flex justify-center gap-2 absolute bottom-4 w-full",
  };

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-4 py-2">
            <Image
              src={item.image}
              alt={item.title || "Carousel Image"}
              width={300} // Increased width for better image quality
              height={200} // Increased height
              className="w-50 md:w-70 lg:w-80 h-auto object-contain m-auto"
            />
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-15 md:left-5 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md transition-all duration-300 
  hover:bg-gray-300 hover:bg-opacity-90 hover:shadow-lg 
  active:bg-gray-700 active:shadow-md cursor-pointer"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft
          size={20}
          className="text-gray-900 transition-colors duration-300 hover:text-white"
        />
      </button>

      <button
        className="absolute right-15 md:right-5 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md transition-all duration-300 
  hover:bg-gray-300 hover:bg-opacity-90 hover:shadow-lg 
  active:bg-gray-400 active:shadow-md cursor-pointer"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight
          size={20}
          className="text-gray-700 transition-colors duration-300 hover:text-white"
        />
      </button>
    </div>
  );
};

export default Carousel;
