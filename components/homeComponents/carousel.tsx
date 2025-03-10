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
              className="w-1/3 md:w-1/3 lg:w-1/2 h-auto object-contain m-auto"
            />
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-20 md:left-10 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md hover:bg-opacity-100 transition"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        className="absolute right-20 md:right-10 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md hover:bg-opacity-100 transition"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
};

export default Carousel;
