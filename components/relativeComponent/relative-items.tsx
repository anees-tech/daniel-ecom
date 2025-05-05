"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "@/components/item-card";
import ItemCardSkeleton from "@/components/item-card-skeleton"; // Importing your existing skeleton
import TextBox from "@/components/text-box";
import Image from "next/image";
import productsDetails from "@/data/ItemProductDetail";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";
import { getProducts } from "@/lib/products";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface RelativeItemsProps {
  category?: string;
}

const RelativeItems: React.FC<RelativeItemsProps> = ({ category }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<CategoryProductsInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const items = await getProducts();

      // Map Firestore products to match ItemCardInterface
      const mappedProducts: CategoryProductsInterface[] = items
        .filter(
          (product) =>
            product.category.toLowerCase() === category?.toLowerCase()
        )
        .map((product) => ({
          ...product,
          id: String(product.id), // Convert number to string
          brand: product.brand || "Unknown Brand",
          material: product.material || "Unknown Material",
        }));

      setProducts(mappedProducts);
      setIsLoading(false);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simulating data fetch delay
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handlePrev = () => {
    if (sliderRef.current) sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    if (sliderRef.current) sliderRef.current.slickNext();
  };

  const filteredProducts = category
    ? productsDetails.filter((product) => product.category === category)
    : productsDetails;

  const displayProducts = filteredProducts.slice(0, 8);

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
    <div className="relative mt-20 md:mt-10 w-full mb-20">
      <div className="flex justify-between items-center pr-2 sm:pr-4 md:pr-8 lg:pr-12">
        <TextBox text={"Relative"} />
        <Link
          href={`/category/${category}`}
          className="text-sm text-red-500 md:text-lg font-bold flex justify-center items-center gap-2 hover:bg-red-500 hover:text-white px-2 py-1 rounded-lg transition-all duration-300"
        >
          View All
          <IoIosArrowForward size={20} />
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 px-3 sm:px-4 lg:px-8 xl:px-12 mt-2">
        <h2 className="text-2xl font-bold">
          {category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
            : "Related Products"}
        </h2>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 bg-gray-200 hover:bg-red-500 rounded-full cursor-pointer"
          >
            <FaChevronLeft size={16} className="hover:text-white" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 bg-gray-200 hover:bg-red-500 rounded-full cursor-pointer"
          >
            <FaChevronRight size={16} className="hover:text-white" />
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
        {loading ? (
          Array(products.length)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="px-2">
                <ItemCardSkeleton /> {/* Using existing skeleton */}
              </div>
            ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="px-2">
              <ItemCard {...product} />
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
