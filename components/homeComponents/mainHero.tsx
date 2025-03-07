import React from "react";
import Link from "next/link";
import "../../style/HeroStyle.css";
import Button from "../button";
import Carousel from "./carousel";
import Image from "next/image";

const carouselData = [
  {
    id: 1,
    image: "/bag.png",
  },
  {
    id: 2,
    image: "/shirt.png",
  },
  {
    id: 3,
    image: "/pngegg.png",
  },
];

const Hero = () => {
  return (
    <div>
      <div className="h-screen flex justify-center items-center  m-0 p-0 md:mt-25 px-2 md:p-0">
        <div className="text-center md:text-left flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between h-screen">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 h-1/2 md:h-screen relative pt-40 md:pt-30 lg:pt-40 md:p-10 pr-0 md:pr-20">
            <h1 className="text-xl text-center md:text-left md:text-4xl font-semibold bg-clip-text leading-tight bg-gradient-to-r text-transparent inline-block from-[#EB1E24] via-[#F05021] to-[#F8A51B]">
              Providing a high-quality textile range for your senior centers
              according to your wishes.
            </h1>
            <p className="mt-3 text-md text-gray-700">
              Find the best this season 🔥
            </p>
            <Link href="/shop" className="mt-8 inline-block">
              <Button text="Shop Now" />
            </Link>
            <Image
              src={"/compass.svg"}
              width={80}
              height={80}
              alt={"Compass"}
              className="w-10 h-10 md:w-20 md:h-20 absolute bottom-0 right-30 md:top-75 md:right-40 md:hidden lg:block"
            />
          </div>

          {/* Right Side - Carousel Component */}
          <div className="w-full md:w-1/2 h-1/2 md:h-screen relative">
            <Image
              src={"/location1.svg"}
              width={80}
              height={80}
              alt={"location"}
              className="w-10 h-10 md:w-20 md:h-20 absolute top-5 left-0 md:left-50"
            />
            <Image
              src={"/location2.svg"}
              width={40}
              height={40}
              alt={"location"}
              className="w-5 h-5 md:w-10 md:h-10 absolute right-0 top-5 md:right-20 md:top-20 lg:top-30 lg:right-60"
            />
            <Image
              src={"/cart1.svg"}
              width={130}
              height={130}
              alt={"cart"}
              className="w-30 h-30 md:w-50 md:h-50 absolute right-0 bottom-0 md:bottom-20"
            />
            <Image
              src={"/rectangle.svg"}
              width={100}
              height={100}
              alt={"rectangle"}
              className="w-10 h-10 md:w-25 md:h-25 absolute bottom-0 md:bottom-20 left-5"
            />
            <div>
              <div className="relative flex justify-center items-center top-40 right-0 md:top-65 md:right-10 lg:top-75 lg:right-25">
                <Image
                  src={"/product.svg"}
                  width={380}
                  height={380}
                  alt={"rectangle"}
                  className="w-50 h-50 md:w-70 md:h-70 lg:w-90 lg:h-90 absolute"
                />
                <div className="absolute">
                  <Carousel data={carouselData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
