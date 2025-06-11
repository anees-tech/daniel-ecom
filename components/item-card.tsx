"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ProductQuickViewButton from "./product-quick-view-button";
import { useState } from "react";
import { ShoppingBag, Star } from "lucide-react";

interface ProductCardEnhancedProps {
  id: string;
  subcategory:string;
  name: string;
  category: string;
  images: string[];
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  sku: string;
  sizes: (string | number)[];
  outOfStockSizes?: (string | number)[];
  description: string;
  material: string;
  features: string[];
}

export default function ItemCard(props: ProductCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-md md:rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-[0.25px] border-gray-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative aspect-square overflow-hidden bg-gray-100 p-4"
        style={{ position: "relative" }}
      >
        <Link
          href={`/product/${props.id}`}
          className="block relative w-full h-full"
        >
          <Image
            src={props.image || "/placeholder.svg"}
            alt={props.name}
            width={500}
            height={500}
            quality={100}
            className={cn(
              "object-cover transition-transform duration-500 p-4 shadow-sm",
              isHovered ? "scale-105" : "scale-100"
            )}
          />
        </Link>
        {props.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full text-sm">
            {(
              ((props.originalPrice - props.currentPrice) /
                props.originalPrice) *
              100
            ).toFixed(0)}
            % OFF
          </Badge>
        )}
        {props.id.startsWith("sale") && (
          <div className="absolute top-0 right-0 w-full h-full">
            {/* Sale Ribbon */}
            <div className="absolute right-[-30px] top-2 bg-green-600 text-white text-xs font-bold py-1 px-8 transform rotate-45 shadow-md">
              SALE
            </div>
          </div>
        )}

        {/* Stock indicator */}
        {props.stock <= 5 && props.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-amber-100 text-amber-900 text-sm px-2 py-1 rounded-full">
            Only {props.stock} left
          </div>
        )}
        {props.stock === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-100 text-red-900 text-sm px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground mb-1">
            {props.category.charAt(0).toUpperCase() +
              props.category.slice(1).toLowerCase()}
          </div>
          <div className="flex flex-col gap-4 z-0">
            <ProductQuickViewButton product={props} iconOnly />
          </div>
        </div>
        <h3 className="font-medium text-lg mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">
          {props.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(props.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({props.reviewsCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {props.originalPrice && props.originalPrice > props.currentPrice ? (
            <>
              <span className="font-semibold text-green-500">
                 €{props.currentPrice.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm line-through text-red-500">
                 €{props.originalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-green-500">
               €{props.currentPrice.toFixed(2)}
            </span>
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
            href={`/product/${props.id}`}
          >
            <ShoppingBag className="h-4 w-4" />
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
