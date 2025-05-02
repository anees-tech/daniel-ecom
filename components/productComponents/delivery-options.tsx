"use client";
import { MapPin, Truck, RotateCcw } from "lucide-react";
import { useState, useEffect, JSX } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig"; // Assuming this is your firebase config path
import { DeliveryOptionsSkeleton } from "./delivery-option-skeleton-loader"; // Import the skeleton

// Define the structure of your Firestore data
interface DeliveryWarrantyData {
  freeDelivery?: {
    description: string;
    enabled: boolean;
    threshold?: number; // Optional threshold
  };
  personalPickup?: {
    description: string;
    enabled: boolean;
  };
  standardDelivery?: {
    description?: string; // Make description optional if guarantee is used
    enabled: boolean;
    guarantee?: string; // Use guarantee field
  };
  warranty?: {
    description?: string; // Make description optional if period is used
    enabled: boolean;
    period?: string; // Use period field
  };
}

// Define the structure for the displayed options
interface DisplayOption {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

// Map Firestore keys to titles and icons
const optionDetailsMap: {
  [key: string]: { title: string; icon: JSX.Element };
} = {
  standardDelivery: {
    title: "Standard Delivery",
    icon: <Truck className="w-5 h-5 text-gray-600" />,
  },
  freeDelivery: {
    title: "Free Delivery",
    icon: <Truck className="w-5 h-5 text-gray-600" />,
  },
  personalPickup: {
    title: "Personal Pickup",
    icon: <MapPin className="w-5 h-5 text-gray-600" />,
  },
  warranty: {
    title: "Warranty",
    icon: <RotateCcw className="w-5 h-5 text-gray-600" />,
  },
};

export default function DeliveryOptions() {
  const [deliveryData, setDeliveryData] = useState<DeliveryWarrantyData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(firestore, "settings", "deliveryWarranty");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDeliveryData(docSnap.data() as DeliveryWarrantyData);
        } else {
          console.warn("DeliveryWarranty document does not exist!");
          setError("Could not load delivery options.");
        }
      } catch (err) {
        console.error("Error fetching delivery options:", err);
        setError("Failed to load delivery options.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryData();
  }, []);

  // Transform fetched data into displayable options, filtering disabled ones
  const displayOptions: DisplayOption[] = deliveryData
    ? Object.entries(deliveryData)
        .filter(([key, value]) => value?.enabled && optionDetailsMap[key]) // Only include enabled and mapped options
        .map(([key, value]) => {
          const details = optionDetailsMap[key];
          let description = "";
          // Use specific fields if available, otherwise fallback to description
          if (key === "standardDelivery" && value?.guarantee) {
            description = value.guarantee;
          } else if (key === "warranty" && value?.period) {
            description = value.period;
          } else if (key === "freeDelivery" && value?.threshold) {
            description = `${value.description || ""} ${value.threshold}`; // Combine description and threshold
          } else {
            description = value?.description || "Details not available";
          }

          return {
            id: key,
            title: details.title,
            icon: details.icon,
            description: description,
          };
        })
    : [];

  if (isLoading) {
    return <DeliveryOptionsSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-full border border-gray-300 rounded-3xl overflow-hidden bg-white p-5 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full border border-gray-300 rounded-3xl overflow-hidden bg-white">
      {/* Delivery Methods */}
      <div className="p-5 space-y-5">
        <div className="space-y-4">
          {displayOptions.length > 0 ? (
            displayOptions.map((option) => (
              <div
                key={option.id}
                className="space-y-1 p-3 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-medium">{option.title}</span>
                </div>
                <p className="text-sm text-gray-500 ml-7">
                  {option.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No delivery options available.
            </p>
          )}
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Seller Ratings */}
      <div className="p-5">
        <h4 className="font-medium mb-4 text-gray-800">Seller Ratings</h4>
        <div className="flex gap-6 justify-center">
          {/* Keep RatingCircle static for now, or fetch if needed */}
          <RatingCircle percentage={89} label="Shipping on time" />
          <RatingCircle percentage={95} label="Response rate" />
        </div>
      </div>
    </div>
  );
}

// Improved Rating Circle with hover effect (Keep this function as is)
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
