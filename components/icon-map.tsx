import {
  Truck,
  MapPin,
  Clock,
  Package,
  CreditCard,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

// Map of icon names to Lucide icon components
export const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  "map-pin": MapPin,
  clock: Clock,
  package: Package,
  "credit-card": CreditCard,
  "life-buoy": LifeBuoy,
};
