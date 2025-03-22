import { LoaderCircle } from "lucide-react";
export default function ItemCardSkeleton() {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 border-[0.25px] border-gray-300 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 p-4 flex items-center justify-center">
        {/* <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg"></div> */}
        <div className="animate-spin">
          <LoaderCircle className="h-12 w-12 text-orange-600" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="w-20 h-4 bg-gray-200 rounded mb-1"></div>
        <div className="w-2/3 h-5 bg-gray-300 rounded mb-2"></div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="w-8 h-3 bg-gray-200 rounded"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
          <div className="w-12 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 transition-transform duration-300 border-none shadow-xl">
        <div className="w-full h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}
