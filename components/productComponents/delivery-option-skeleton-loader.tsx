export function DeliveryOptionsSkeleton() {
  return (
    <div className="md:w-[320px] border border-gray-200 rounded-3xl overflow-hidden bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="p-5 space-y-5">
        <div className="h-5 w-32 bg-gray-300 rounded"></div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>

        {/* Delivery Methods Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1 p-3 rounded-xl bg-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
              </div>
              <div className="h-3 w-56 bg-gray-300 rounded ml-7"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Seller Ratings Skeleton */}
      <div className="p-5">
        <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>
        <div className="flex gap-6">
          <SkeletonCircle />
          <SkeletonCircle />
        </div>
      </div>
    </div>
  );
}

// Skeleton Circle for Ratings
function SkeletonCircle() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-300"></div>
      <div className="h-3 w-20 bg-gray-300 rounded mt-2"></div>
    </div>
  );
}
