import React, { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "./item-card";
import Button from "./button";
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
    reviews: 98,
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
    reviews: 120,
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
    reviews: 75,
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
    reviews: 130,
  },
  {
    id: 5,
    name: "Women’s Handbag",
    category: "women",
    image: "/pngegg.png",
    currentPrice: 280,
    originalPrice: 350,
    discount: 15,
    stock: 5,
    rating: 4.7,
    reviews: 130,
  },
];

const FlashSaleCarousel = () => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      <div className="relative px-12">
        {/* Header Section with Title & Navigation */}
        <div className="flex justify-between items-center mb-4 mt-3 px-2">
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
        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <ItemCard
                image={product.image}
                name={product.name}
                discount={product.discount}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                stock={0}
                onAddToCart={() => {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          ))}
        </Slider>
        <div className="flex justify-center my-4">
          {" "}
          <Button text="View All" />
        </div>
      </div>
      <div className="relative w-full -z-50">
        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          className="absolute right-0 -top-30"
        />
      </div>
    </div>
  );
};

export default FlashSaleCarousel;
