"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardEnhancedProps {
  id: number;
  name: string;
  image: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  material: string;
}

export default function ItemCard({
  id,
  name,
  currentPrice,
  originalPrice,
  image,
  category = "Fashion",
  discount = 0,
  stock = 10,
  rating = 4.5,
  reviewsCount = 24,
}: ProductCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-[0.25px] border-gray-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
        <Link href={`/product/${id}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className={cn(
              "object-contain transition-transform duration-500 p-4 shadow-sm",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
        </Link>
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full text-sm">
            {discount}% OFF
          </Badge>
        )}

        {/* Stock indicator */}
        {stock <= 5 && stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-900 text-sm px-2 py-1 rounded-full">
            Only {stock} left
          </div>
        )}
        {stock === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-100 text-red-900 text-sm px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{category}</div>
        <h3 className="font-medium text-lg mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({reviewsCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {originalPrice && originalPrice > currentPrice ? (
            <>
              <span className="font-semibold text-red-500">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm line-through">
                ${originalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-semibold">${currentPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white p-3 transition-transform duration-300 border-none shadow-xl",
          isHovered ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="w-full flex justify-center">
          <Link
            className="w-full gap-2 flex flex-row justify-center items-center py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white transform transition-transform active:scale-95 rounded-full"
            href={`/product/${id}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
