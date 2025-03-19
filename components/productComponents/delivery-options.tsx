"use client";
import { MapPin, Truck, RotateCcw } from "lucide-react";

export default function DeliveryOptions() {
  return (
    <div className="md:w-[300px] border border-black rounded-3xl overflow-hidden">
      {/* Header with Location */}
      <div className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Delivery options</h3>
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500">
              Berlin, Hamburg, Munich, Stuttgart, Düsseldorf, Cologne,
            </p>
          </div>
          <button className="text-orange-500 text-sm font-medium">
            CHANGE
          </button>
        </div>

        {/* Delivery Methods */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="font-medium">Standard Delivery</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              Guaranteed 1 to 2 days order ship
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="font-medium">Free Delivery</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              You&apos;re Order Place Above 200$
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Personal Pickup</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              You can conveniently pick up your order from our office.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <span className="font-medium">Warranty</span>
            </div>
            <p className="text-sm text-gray-500 ml-7">
              15 Days Delivery Returns.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Position Seller Ratings */}
      <div className="p-4">
        <h4 className="font-medium mb-4">Position seller Ratings</h4>
        <div className="flex gap-6">
          <RatingCircle percentage={89} label="Shipping on time" />
          <RatingCircle percentage={95} label="Response rate" />
        </div>
      </div>
    </div>
  );
}

function RatingCircle({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center">
          <span className="font-bold text-lg">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}
