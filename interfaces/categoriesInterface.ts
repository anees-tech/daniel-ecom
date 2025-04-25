interface CategoryProductsInterface {
  id: string;
  name: string;
  category: string;
  images: string[];
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  sku: string;
  sizes: (string | number)[];
  outOfStockSizes?: (string | number)[];
  description: string;
  material: string;
  features: string[];
  onBuyNow?: () => void;
}

export default CategoryProductsInterface;
