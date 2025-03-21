export default function ProductInfoSkeleton() {
  return (
    <div className="md:w-[400px] lg:w-auto space-y-6 p-5 rounded-lg bg-white animate-pulse">
      {/* Title and Rating */}
      <div>
        <div className="h-8 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-300 rounded-full"></div>
              ))}
          </div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
        <div className="h-5 w-16 bg-gray-300 rounded"></div>
      </div>

      {/* Details */}
      <div>
        <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
        <div className="h-16 w-full bg-gray-300 rounded"></div>
      </div>

      {/* Brand */}
      <div className="flex flex-row gap-2 items-center">
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Colors */}
      <div>
        <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
        <div className="flex gap-3">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="w-9 h-9 bg-gray-300 rounded-full"></div>
            ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="h-6 w-16 bg-gray-300 rounded mb-2"></div>
        <div className="flex gap-3">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="w-12 h-8 bg-gray-300 rounded-full"></div>
            ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <div className="h-6 w-20 bg-gray-300 rounded mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <div className="flex-1 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 h-12 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
