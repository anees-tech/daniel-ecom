"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "@/components/item-card";
import TextBox from "@/components/text-box";
import Image from "next/image";
import productsDetails from "@/data/ItemProductDetail";

interface RelativeItemsProps {
  category?: string;
}

const RelativeItems: React.FC<RelativeItemsProps> = ({ category }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    if (sliderRef.current) sliderRef.current.slickNext();
  };

  // Filter products by category if provided
  const filteredProducts = category
    ? productsDetails.filter((product) => product.category === category)
    : productsDetails;

  // Limit to 8 products for better performance
  const displayProducts = filteredProducts.slice(0, 8);

  const settings = {
    mobileFirst: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    touchMove: true,
    draggable: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="relative mt-20 md:mt-10 w-full mb-20">
      <TextBox text={"Relative"} />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 px-3 sm:px-4 lg:px-8 xl:px-12 mt-2">
        <h2 className="text-2xl font-bold">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
            : "Related Products"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <Slider
        className="px-2 sm:px-4 lg:px-8 xl:px-12"
        ref={sliderRef}
        {...settings}
        key={isMobile ? "mobile" : "desktop"}
      >
        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <div key={product.id} className="px-2">
              <ItemCard
                {...product}
                onBuyNow={() => console.log(`Added ${product.name} to cart`)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            No products found in this category.
          </div>
        )}
      </Slider>

      {/* Background Design */}
      <div className="absolute right-0 -bottom-48 -z-50">
        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          priority
        />
      </div>
    </div>
  );
};

export default RelativeItems;
