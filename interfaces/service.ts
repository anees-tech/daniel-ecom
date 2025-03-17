export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string; // Icon name from Lucide
  images: string[];
  features: string[];
}
