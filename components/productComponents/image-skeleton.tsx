import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

export default function ProductImagesSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Desktop Thumbnails (Vertical) */}
      <div className="hidden md:flex flex-col w-[110px] relative order-2 md:order-1">
        <button
          className="mx-auto mb-2 p-2 rounded-full bg-gray-100 opacity-50 cursor-not-allowed"
          disabled
        >
          <ChevronUp className="w-5 h-5 text-gray-400" />
        </button>

        <div className="h-[440px] overflow-hidden">
          <div className="flex flex-col gap-3">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden h-[100px] w-[100px]"
                >
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                </div>
              ))}
          </div>
        </div>

        <button
          className="mx-auto mt-2 p-2 rounded-full bg-gray-100 opacity-50 cursor-not-allowed"
          disabled
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative w-full max-w-full h-auto order-1 md:order-2">
        <div className="border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative aspect-square">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
        </div>

        {/* Mobile Thumbnails (Horizontal) */}
        <div className="md:hidden relative mt-4">
          <button
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 opacity-50 cursor-not-allowed"
            disabled
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>

          <div className="overflow-x-auto scroll-y-hidden scrollbar-hide">
            <div className="flex gap-3">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden w-[100px] h-[100px] flex-shrink-0"
                  >
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                  </div>
                ))}
            </div>
          </div>

          <button
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 opacity-50 cursor-not-allowed"
            disabled
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
