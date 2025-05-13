import { Star } from "lucide-react";
import React from "react";

export default function ProductInfoSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Title and Rating Skeleton */}
      <div className="flex flex-col md:justify-between md:items-start gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center gap-3">
            {/* Title Skeleton */}
            <div className="h-9 w-3/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>

            {/* Price Skeleton */}
            <div className="flex items-center gap-3 ml-1">
              <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
            </div>
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-200" />
                ))}
            </div>
            <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div>
          <div className="h-7 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
          <div className="space-y-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"
                  style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                ></div>
              ))}
          </div>

          {/* SKU Skeleton */}
          <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mt-4"></div>
        </div>
      </div>

      {/* Category, Brand, Material Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
              <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
            </div>
          ))}
      </div>

      {/* Features Skeleton */}
      <div>
        <div className="h-7 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
        <div className="grid gap-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-lg"
              ></div>
            ))}
        </div>
      </div>

      {/* Colors and Sizes Skeleton */}
      <div className="flex flex-col gap-4">
        {/* Colors Skeleton */}
        <div>
          <div className="h-7 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
          <div className="flex gap-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"
                ></div>
              ))}
          </div>
        </div>

        {/* Sizes Skeleton */}
        <div>
          <div className="h-7 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
          <div className="flex flex-wrap gap-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"
                ></div>
              ))}
          </div>
        </div>

        {/* Quantity Skeleton */}
        <div>
          <div className="h-7 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
            <div className="w-12 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-row gap-3 pt-4 justify-start items-center">
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-md"></div>
      </div>
    </div>
  );
}
