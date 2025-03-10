"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  sku: string;
  sizes: (string | number)[]; // ✅ Allow both string and number
  outOfStockSizes: (string | number)[]; // ✅ Adjust this too
  description: string;
  material: string;
  features: string[];
  onAddToCart?: () => void;
}

export default function ItemCard({
  name,
  image,
  currentPrice,
  originalPrice,
  discount,
  stock,
  rating,
  reviewsCount,
  onAddToCart,
}: Product) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden max-w-sm w-full">
      {/* Image */}
      <div className="p-4 flex justify-center bg-gray-100 rounded-lg">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="px-2 py-1 md:p-5 md:py-1">
        {/* Name + Discount */}
        <div className="flex justify-between items-center mb-1 md:mb-2 gap-1">
          <h3
            className="text-lg font-stretch-extra-condensed md:font-semibold text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis"
            title={name}
          >
            {name}
          </h3>

          {discount > 0 && (
            <span className="bg-black text-white px-1 md:px-2 py-1 rounded-full text-xs font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Price + Add to Cart */}
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ${currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-sm text-red-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          <div className="md:hidden flex flex-col justify-between items-start text-sm text-gray-600 gap-1 mt-0">
            <p>{stock > 0 ? `Stock: ${stock}` : "Out of Stock"}</p>
            <div className="flex items-center justify-between gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                {rating} ({reviewsCount} reviews)
              </span>
            </div>
          </div>
          <button
            onClick={onAddToCart}
            className="py-1 px-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full text-sm transition w-full md:w-auto"
          >
            Add to cart
          </button>
        </div>

        {/* Stock + Rating */}
        <div className="hidden md:flex justify-between items-center text-sm text-gray-600">
          <p>{stock > 0 ? `Stock: ${stock}` : "Out of Stock"}</p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>
              {rating} ({reviewsCount} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
