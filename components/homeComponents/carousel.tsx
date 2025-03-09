import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

interface CarouselProps {
  data: { id: number; image: string; title?: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [sliderInstance, setSliderInstance] = useState<Slider | null>(null);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderInstance(sliderRef.current);
    }
  }, []);

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
    <div className="relative z-10 w-full max-w-md m-auto overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-4 py-2">
            <Image
              src={item.image}
              alt={item.title || "Carousel Image"}
              width={100}
              height={100}
              className="w-1/3 md:w-1/3 lg:w-1/2 h-auto object-contain m-auto"
            />
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-5 z-10 top-1/2 -translate-y-1/2 p-2  rounded-full hover:bg-gray-400 transition"
        onClick={() => sliderInstance?.slickPrev()}
      >
        <FaChevronLeft size={18} />
      </button>

      <button
        className="absolute right-5 top-1/2 z-10 -translate-y-1/2 p-2  rounded-full hover:bg-gray-400 transition"
        onClick={() => sliderInstance?.slickNext()}
      >
        <FaChevronRight size={18} />
      </button>
    </div>
  );
};

export default Carousel;
