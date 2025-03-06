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
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden max-w-sm w-full">
      <div className="p-4 flex justify-center bg-[#f9f9f9] rounded-lg shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={400}
          height={300}
          className="object-contain"
        />
      </div>

      <div className="p-5">
        {/* Name + Discount */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
          {discount && (
            <span className="bg-black text-white px-2 py-1 rounded-full text-sm font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Price + Add to Cart Button */}
        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-500">
              ${currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-xl text-red-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="py-1 px-3 bg-[#ffa300] hover:bg-amber-500 text-white font-medium rounded-full transition-colors"
          >
            Add to cart
          </button>
        </div>

        {/* Stock + Rating */}
        <div className="flex justify-between items-center mt-5 w-full">
          <p className="text-gray-700">Stock ({stock})</p>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-600">
              {rating} ({reviews} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
