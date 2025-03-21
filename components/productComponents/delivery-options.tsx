"use client";
import { MapPin, Truck, RotateCcw } from "lucide-react";

export default function DeliveryOptions() {
  return (
    <div className="md:w-[320px] border border-gray-300 rounded-3xl overflow-hidden bg-white">
      {/* Header with Location */}
      <div className="p-5 space-y-5">
        <h3 className="font-semibold text-lg text-gray-800">
          Delivery Options
        </h3>
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            <MapPin className="w-5 h-5 mt-0.5 text-gray-600 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Berlin, Hamburg, Munich, Stuttgart, Düsseldorf, Cologne
            </p>
          </div>
          <button className="text-orange-500 text-sm font-semibold hover:underline transition">
            CHANGE
          </button>
        </div>

        {/* Delivery Methods */}
        <div className="space-y-4">
          {deliveryOptions.map((option, index) => (
            <div
              key={index}
              className="space-y-1 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="font-medium">{option.title}</span>
              </div>
              <p className="text-sm text-gray-500 ml-7">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Seller Ratings */}
      <div className="p-5">
        <h4 className="font-medium mb-4 text-gray-800">Seller Ratings</h4>
        <div className="flex gap-6">
          <RatingCircle percentage={89} label="Shipping on time" />
          <RatingCircle percentage={95} label="Response rate" />
        </div>
      </div>
    </div>
  );
}

// Delivery options array
const deliveryOptions = [
  {
    title: "Standard Delivery",
    description: "Guaranteed 1 to 2 days order ship",
    icon: <Truck className="w-5 h-5 text-gray-600" />,
  },
  {
    title: "Free Delivery",
    description: "You're Order Place Above $200",
    icon: <Truck className="w-5 h-5 text-gray-600" />,
  },
  {
    title: "Personal Pickup",
    description: "You can conveniently pick up your order from our office.",
    icon: <MapPin className="w-5 h-5 text-gray-600" />,
  },
  {
    title: "Warranty",
    description: "15 Days Delivery Returns.",
    icon: <RotateCcw className="w-5 h-5 text-gray-600" />,
  },
];

// Improved Rating Circle with hover effect
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
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center shadow-md hover:shadow-lg transition">
          <span className="font-bold text-lg text-gray-800">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}
