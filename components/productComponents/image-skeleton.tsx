import { Skeleton } from "@/components/ui/skeleton";

export default function ProductImagesSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Desktop Thumbnails Skeleton */}
      <div className="hidden md:flex flex-col w-[110px] relative order-2 md:order-1">
        <div className="h-[420px] overflow-hidden flex flex-col gap-3">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="h-[100px] w-[100px] rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"
              />
            ))}
        </div>
      </div>

      {/* Main Image Skeleton */}
      <div className="relative w-full max-w-full h-auto order-1 md:order-2">
        <Skeleton className="w-full h-[400px] rounded-lg bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
      </div>

      {/* Mobile Thumbnails Skeleton */}
      <div className="md:hidden relative mt-4">
        <div className="overflow-x-auto scroll-y-hidden scrollbar-hide flex gap-3">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-[100px] h-[100px] rounded-lg flex-shrink-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
