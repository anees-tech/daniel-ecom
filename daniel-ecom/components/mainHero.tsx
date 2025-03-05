import React from "react";
import Link from "next/link";
import "../style/HeroStyle.css";
import Button from "./button";
import Carousel from "./carousel";

const carouselData = [
  {
    id: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb9TLhXcU6Srf4SLRkwjR7aKyAKOe0rswx0g&s",
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnxJSlKNqYpOb_xfruGqakuQgZHsd9QYB4zQ&s",
  },
  {
    id: 3,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOhJouwhU2vo6FZIukPCgR_5lVHJ3xkxWQg&s",
  },
];

const Hero = () => {
  return (
    <div className="mainBackground">
      <div className="h-[85vh] flex justify-center items-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 text-white">
            <h1 className="text-6xl md:text-6xl font-semibold bg-clip-text leading-tight bg-gradient-to-b text-transparent inline-block from-[#EB1E24] via-[#F05021] to-[#F8A51B]">
              Providing a high-quality textile range for your senior centers
              according to your wishes.
            </h1>
            <p className="mt-3 text-2xl text-gray-700">
              Find the best this season 🔥
            </p>
            <Link href="/shop" className="mt-10 inline-block">
              <Button text="Shop Now" />
            </Link>
          </div>

          {/* Right Side - Carousel Component */}
          <div className="md:w-1/2 flex justify-center">
            <Carousel data={carouselData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
