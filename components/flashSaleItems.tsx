import React, { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "./item-card";
import Button from "./button";
import TextBox from "@/components/text-box";

const products = [
  {
    id: 1,
    image: "/pngegg.png",
    name: "Lady Bag",
    price: 375,
    oldPrice: 400,
    rating: "4.9",
    reviews: "98",
  },
  {
    id: 2,
    image: "/pngegg.png",
    name: "Lady Bag",
    price: "$375",
    oldPrice: "$400",
    rating: "4.9",
    reviews: "98",
  },
  {
    id: 3,
    image: "/pngegg.png",
    name: "Lady Bag",
    price: "$375",
    oldPrice: "$400",
    rating: "4.9",
    reviews: "98",
  },
  {
    id: 4,
    image: "/pngegg.png",
    name: "Lady Bag",
    price: "$375",
    oldPrice: "$400",
    rating: "4.9",
    reviews: "98",
  },
  {
    id: 5,
    image: "/pngegg.png",
    name: "Lady Bag",
    price: "$375",
    oldPrice: "$400",
    rating: "2.9",
    reviews: "98",
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
    <div className="relative px- container mx-auto">
      <TextBox text={"Today's"} />
      {/* Header Section with Title & Navigation */}
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

      {/* Carousel */}
      <Slider ref={sliderRef} {...settings}>
        {products.map((product) => (
          <ItemCard
            key={product.id}
            image={product.image}
            name={product.name}
            currentPrice={product.price}
            originalPrice={product.oldPrice}
            rating={parseFloat(product.rating)}
            reviews={parseInt(product.reviews)}
            stock={0}
            onAddToCart={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ))}
      </Slider>
      <div className="flex justify-center my-4">
        {" "}
        <Button text="View All" />
      </div>
    </div>
  );
};

export default FlashSaleCarousel;
