import React from "react";

export default function ProductInfoSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Title and Rating */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="h-8 w-3/4 bg-gray-300 rounded" />
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-5 w-5 bg-gray-300 rounded" />
              ))}
            </div>
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-gray-300 rounded" />
          <div className="h-6 w-16 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Category, Brand, Material */}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index}>
            <div className="h-6 w-24 bg-gray-300 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded mb-2" />
        <div className="space-y-2">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="h-4 w-1/2 bg-gray-300 rounded" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-full bg-gray-300 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-300 rounded" />
      </div>

      {/* Colors and Sizes */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Colors */}
        <div className="space-y-6">
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded mb-2" />
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-9 w-9 bg-gray-300 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-6">
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded mb-2" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-12 bg-gray-300 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
              <div className="h-8 w-12 bg-gray-300 rounded" />
              <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-3 pt-4">
        <div className="h-10 w-40 bg-gray-300 rounded" />
        <div className="h-10 w-40 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
