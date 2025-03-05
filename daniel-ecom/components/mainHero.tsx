import React from "react";
import Link from "next/link";
import "../style/HeroStyle.css";

const Hero = () => {
  return (
    <>
      <div className="mainBackground">
        <div className=" py-16">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
            {/* Left Side - Text Content */}
            <div className="md:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text leading-tight bg-gradient-to-b text-transparent inline-block from-[#EB1E24] via-[#F05021] to-[#F8A51B] ">
                Providing a high-quality textile range for your senior centers
                according to your wishes. <br />
              </h1>
              <p className="mt-4 text-lg">Find the best this season 🔥</p>
              <Link href="/shop">
                <button className="bg-white text-red-500 font-semibold px-6 py-3 mt-6 rounded-lg shadow-md hover:bg-gray-200">
                  Shop Now
                </button>
              </Link>
            </div>

            {/* Right Side - Placeholder for Carousel */}
            <div className="md:w-1/2 flex justify-center">
              {/* Your carousel component will go here */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                {/* Placeholder for the carousel */}
                <span className="text-gray-500">Carousel Component</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
