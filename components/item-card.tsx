"use client";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductCardProps {
  name: string;
  image: string;
  currentPrice: number | string;
  originalPrice: number | string;
  discount?: number;
  stock: number;
  rating: number;
  reviews: number;
  onAddToCart: () => void;
}

export default function ItemCard({
  name,
  image,
  currentPrice,
  originalPrice,
  discount,
  stock,
  rating,
  reviews,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full transition-all hover:shadow-md">
      {/* Image container */}
      <div className="p-2 sm:p-4 flex justify-center bg-[#f9f9f9] rounded-lg shadow">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={313}
          height={272}
          className="object-contain h-36 sm:h-40 md:h-48 w-full"
        />
      </div>

      {/* Desktop (md and above) */}
      <div className="hidden md:block p-4">
        {/* Product name and discount */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md md:text-lg font-bold text-gray-800 truncate w-full">
            {name}
          </h3>
          {discount && (
            <span className="bg-black text-white px-2 py-0 rounded-full text-sm md:text-md font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Price and Add to cart button */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-md font-bold text-green-500">
              ${currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-md md:text-md text-red-600 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="py-2 px-3 md:py-1 md:px-3 md:text-sm bg-[#ffa617] hover:bg-amber-500 text-white font-medium rounded-full transition-colors text-sm md:text-base"
          >
            Add to cart
          </button>
        </div>

        {/* Stock and Rating */}
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-700 text-sm md:text-md">Stock ({stock})</p>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-600 text-sm md:text-md">
              {rating} ({reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Mobile (sm) - Unchanged from previous version */}
      <div className="md:hidden p-2 sm:p-3 space-y-1 sm:space-y-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1">
            {name}
          </h3>
          {discount && (
            <span className="bg-black text-white px-1 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shrink-0">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-green-500">
            ${currentPrice}
          </span>
          {originalPrice > currentPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-700">Stock ({stock})</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm text-gray-600">{rating}</span>
          </div>
        </div>

        <button
          onClick={onAddToCart}
          className="w-full py-1 px-2 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-full transition-colors text-xs sm:text-sm"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
