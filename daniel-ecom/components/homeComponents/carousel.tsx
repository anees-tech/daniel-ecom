import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoPaperPlane } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    dotsClass: "slick-dots slick-thumb",
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden">
      {/* Background Shape & Icon */}


      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-8 py-6">
            <img
              src={item.image}
              alt={item.title || "Carousel Image"}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 p-4 bg-gray-800/50 text-white rounded-full hover:bg-gray-900 transition"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft size={24} />
      </button>

      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 p-4 bg-gray-800/50 text-white rounded-full hover:bg-gray-900 transition"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
