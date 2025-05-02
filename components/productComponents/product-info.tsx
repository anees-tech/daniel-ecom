"use client";

import { Star, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import ProductReviewModal from "./product-reiw-modal";
import Button from "../button";
import { toast } from "sonner";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    category: string;
    currentPrice: number;
    originalPrice: number;
    discount?: number;
    stock: number;
    rating: number;
    reviewsCount: number;
    brand: string;
    sku: string; // Added SKU
    sizes: string[]; // Added sizes
    outOfStockSizes?: string[]; // Added outOfStockSizes (optional)
    colors: { name: string; hex: string }[];
    description: string;
    material?: string; // Added material (optional)
    features?: string[]; // Added features (optional)
    image: string; // Assuming image is a URL string
    images: string[]; // Assuming images is an array of URL strings
    reviews?: any[]; // Assuming reviews exist
  };
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  handleQuantityChange: (quantity: number) => void;
}

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  handleQuantityChange,
}: ProductInfoProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Ensure product.sizes is an array, default to empty if not
  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  // Ensure product.outOfStockSizes is an array, default to empty if not
  const outOfStock = Array.isArray(product.outOfStockSizes) ? product.outOfStockSizes : [];

  return (
    <div className="w-full space-y-6">
      {/* Title and Rating */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-gray-900">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                  key={`full-${i}`}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-110"
                />
              ))}
              {hasHalfStar && (
                <div className="relative">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star
                    className="w-5 h-5 absolute top-0 left-0 fill-white text-yellow-400 overflow-hidden"
                    style={{
                      clipPath: "polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%)",
                    }}
                  />
                </div>
              )}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
              ))}
            </div>
            <span className="text-gray-600 text-sm">
              ({product.reviewsCount} Reviews)
            </span>
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            ${product.currentPrice.toFixed(2)}
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Details</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        {/* Display SKU, Brand, Material */}
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
          <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
          {product.material && <p><strong>Material:</strong> {product.material}</p>}
        </div>
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Colors */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Colors</h2>
            <div className="flex gap-3">
              {product.colors.map((color: { name: string; hex: string }) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-9 h-9 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedColor === color.name
                      ? "ring-2 ring-offset-2 ring-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Size - Now Dynamic */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Size</h2>
            <div className="flex flex-wrap gap-3"> {/* Added flex-wrap */}
              {availableSizes.length > 0 ? (
                availableSizes.map((size) => {
                  const isOutOfStock = outOfStock.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock} // Disable button if size is out of stock
                      className={`w-12 h-8 rounded-full border font-medium transition-all duration-300 ${
                        selectedSize === size && !isOutOfStock
                          ? "bg-red-500 text-white border-red-500 shadow-md" // Selected style
                          : isOutOfStock
                          ? "border-gray-300 text-gray-400 bg-gray-100 line-through cursor-not-allowed" // Out of stock style
                          : "border-gray-300 text-gray-700 hover:bg-gray-100" // Default style
                      }`}
                    >
                      {size}
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No sizes available.</p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Quantity
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-lg font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-gray-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-3 pt-4 justify-start items-center">
        <Button
          text={"Add to Cart"}
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.currentPrice,
              image: product.image,
              quantity,
              color: selectedColor,
              size: selectedSize,
            });
            toast("Item has been added to cart");
          }}
        />
      </div>
    </div>
  );
}
