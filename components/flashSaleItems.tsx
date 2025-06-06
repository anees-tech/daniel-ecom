"use client";

import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "@/components/item-card";
import TextBox from "@/components/text-box";
import Image from "next/image";
import ItemCardSkeleton from "./item-card-skeleton";
import { getFlashSaleItems, FlashSaleItem } from "@/lib/flashSaleItems";
import { Item } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
const FlashSaleCarousel = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<FlashSaleItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch flash sale items from Firestore
  useEffect(() => {
    async function fetchFlashSaleItems() {
      setLoading(true);
      const items = await getFlashSaleItems();
      setProducts(items);
      setLoading(false);
    }

    fetchFlashSaleItems();
  }, []);

  const settings = {
    mobileFirst: true,
    infinite: false,
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
    <div className="relative mt-120 md:mt-60 w-full">
      <div className="flex justify-between items-center pr-2 sm:pr-4 md:pr-8 lg:pr-12">
        <TextBox text={"Today's"} />
        <Link
          href={"/flashsaleproducts"}
          className="text-sm text-red-500 md:text-lg flex justify-center items-center gap-2 hover:bg-red-500 active:bg-red-500 active:text-white hover:text-white px-2 py-1 rounded-lg transition-all duration-300"
        >
          View All
          <IoIosArrowForward size={20} />
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 px-3 sm:px-4 lg:px-8 xl:px-12 mt-4">
        <h2 className="text-2xl font-bold">Flash Sales</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 bg-gray-200 hover:bg-red-500 active:bg-red-500 rounded-full cursor-pointer"
          >
            <FaChevronLeft
              size={16}
              className="text-gray-900 hover:text-white active:text-white"
            />
          </button>
          <button
            type="button"
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 bg-gray-200 hover:bg-red-500 active:bg-red-500 rounded-full cursor-pointer"
          >
            <FaChevronRight
              size={16}
              className="text-gray-900 hover:text-white active:text-white"
            />
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
        {loading
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="px-2">
                  <ItemCardSkeleton />
                </div>
              ))
          : // Show Real Products When Data is Loaded
            products?.map((product) => {
              if (!product.id) {
                console.warn("Product is missing an ID:", product);
                return null; // Skip rendering this product
              }

              return (
                <div key={product.id} className="px-2">
                  <ItemCard {...product} id={product.id.toString()} />
                </div>
              );
            })}
      </Slider>

      {/* Background Design */}
      <div className="absolute right-0 bottom-0 -z-50">
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
