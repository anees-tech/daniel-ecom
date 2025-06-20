"use client";
// import React, { useEffect, useRef, useState } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Image from "next/image";
// import { getCarouselImages } from "@/lib/carouselImg"; // Adjust path as needed
// import Loading from "@/app/loading";

// interface CarouselImage {
//   id: string;
//   url: string;
// }

// const Carousel: React.FC = () => {
//   const sliderRef = useRef<Slider>(null);
//   const [images, setImages] = useState<CarouselImage[] | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const data = await getCarouselImages();
//         const formattedData = data.map(
//           (item: { id: string; url?: string }) => ({
//             id: item.id,
//             url: item.url || "", // Provide a default value if url is missing
//           })
//         );
//         setImages(formattedData);
//       } catch (error) {
//         console.error("Error fetching carousel images:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     arrows: false,
//     dotsClass: "slick-dots flex justify-center gap-2 absolute bottom-4 w-full",
//   };

//   if (loading)
//     return (
//       <div className="text-center py-10">
//         <Loading />
//       </div>
//     );
//   if (!images || images.length === 0)
//     return <div className="text-center py-10">No carousel images found.</div>;

//   return (
//     <div className="relative w-full max-w-md mx-auto overflow-hidden">
//       <Slider ref={sliderRef} {...settings}>
//         {images.map((item) => (
//           <div key={item.id} className="px-4 py-2">
//             <Image
//               src={item.url}
//               alt={"Carousel Image"}
//               width={400}
//               height={300}
//               quality={100}
//               className="w-50 md:w-80 lg:w-90 h-auto object-contain m-auto"
//             />
//           </div>
//         ))}
//       </Slider>

//       {/* Custom Navigation Buttons */}
//       <button
//         className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md transition-all duration-300 hover:bg-red-500 active:bg-red-500 active:shadow-lg hover:shadow-lg focus::bg-yellow-300 cursor-pointer"
//         onClick={() => sliderRef.current?.slickPrev()}
//       >
//         <FaChevronLeft
//           size={20}
//           className="text-gray-900 hover:text-white active:text-white"
//         />
//       </button>

//       <button
//         className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-60 rounded-full shadow-md transition-all duration-300 hover:bg-red-500 active:bg-red-500 hover:shadow-lg focus::bg-yellow-300 cursor-pointer"
//         onClick={() => sliderRef.current?.slickNext()}
//       >
//         <FaChevronRight
//           size={20}
//           className="text-gray-900 hover:text-white active:text-white"
//         />
//       </button>
//     </div>
//   );
// };

// export default Carousel;
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { getCarouselImages } from "@/lib/carouselImg"; // Adjust path as needed
import Loading from "@/app/loading";

interface CarouselImage {
  id: string;
  url: string;
}

const Carousel: React.FC = () => {
  const sliderRef = useRef<Slider>(null);
  const [images, setImages] = useState<CarouselImage[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getCarouselImages();
        const formattedData = data.map(
          (item: { id: string; url?: string }) => ({
            id: item.id,
            url: item.url || "", // Provide a default value if url is missing
          })
        );
        setImages(formattedData);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
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
    dotsClass:
      "slick-dots flex justify-center gap-3 absolute bottom-8 w-full z-20",
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!images || images.length === 0)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">No carousel images found.</div>
      </div>
    );

  return (
    <div className="relative w-full h-full bg-white">
      <Slider ref={sliderRef} {...settings} className="w-full h-full">
        {images.map((item) => (
          <div key={item.id} className="w-full h-full">
            <div className="w-full h-screen flex items-center justify-center p-4">
              <Image
                src={item.url || "/placeholder.svg"}
                alt={"Carousel Image"}
                width={800}
                height={600}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white bg-opacity-80 rounded-full shadow-lg transition-all duration-300 hover:bg-red-500 hover:bg-opacity-90 active:bg-red-600 hover:shadow-xl z-30"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <FaChevronLeft
          size={24}
          className="text-gray-800 hover:text-white transition-colors duration-300"
        />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white bg-opacity-80 rounded-full shadow-lg transition-all duration-300 hover:bg-red-500 hover:bg-opacity-90 active:bg-red-600 hover:shadow-xl z-30"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <FaChevronRight
          size={24}
          className="text-gray-800 hover:text-white transition-colors duration-300"
        />
      </button>
    </div>
  );
};

export default Carousel;
