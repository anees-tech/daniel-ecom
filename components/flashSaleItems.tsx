"use client";

import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "@/components/item-card";
import TextBox from "@/components/text-box";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Lady Bag",
    category: "women",
    image: "/pngegg.png",
    currentPrice: 375,
    originalPrice: 400,
    discount: 25,
    stock: 10,
    rating: 4.3,
    reviewsCount: 98,
  },
  {
    id: 2,
    name: "Men's Jacket",
    category: "men",
    image: "/pngegg.png",
    currentPrice: 120,
    originalPrice: 150,
    discount: 20,
    stock: 15,
    rating: 4.6,
    reviewsCount: 120,
  },
  {
    id: 3,
    name: "Kids Sneakers",
    category: "kids",
    image: "/pngegg.png",
    currentPrice: 55,
    originalPrice: 70,
    discount: 10,
    stock: 25,
    rating: 4.5,
    reviewsCount: 75,
  },
  {
    id: 4,
    name: "Women’s Handbag",
    category: "women",
    image: "/pngegg.png",
    currentPrice: 280,
    originalPrice: 350,
    discount: 15,
    stock: 5,
    rating: 4.7,
    reviewsCount: 130,
  },
  {
    id: 5,
    name: "Smart Watch",
    category: "electronics",
    image: "/pngegg.png",
    currentPrice: 199,
    originalPrice: 250,
    discount: 20,
    stock: 8,
    rating: 4.8,
    reviewsCount: 200,
  },
];

const FlashSaleCarousel = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    infinite: true, // Ensures smooth looping
    speed: 500,
    slidesToShow: isMobile ? 2 : 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="relative container mx-auto px-4">
      <TextBox text={"Today's"} />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Flash Sales</h2>
        <div className="flex gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slider */}
      <Slider
        ref={sliderRef}
        {...settings}
        key={isMobile ? "mobile" : "desktop"}
      >
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <ItemCard
              {...product}
              onAddToCart={() => console.log(`Added ${product.name} to cart`)}
            />
          </div>
        ))}
      </Slider>

      {/* Background Design */}
      <div className="absolute right-0 -top-20 -z-10">
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

export default FlashSaleCarousel;
