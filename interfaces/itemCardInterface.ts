interface ItemCardInterface {
  id: string; // Change id type to string
  name: string;
  image: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  material: string;
  onBuyNow?: () => void;
}
export default ItemCardInterface;
