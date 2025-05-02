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

  return (
    <div className="w-full space-y-6">
      {/* Title and Rating */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                  key={`full-${i}`}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              {hasHalfStar && (
                <div className="relative">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <Star
                    className="w-5 h-5 absolute top-0 left-0 fill-white text-yellow-400"
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
            <span className="text-gray-500 line-through text-lg">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Category, Brand, Material */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Category</h2>
          <p className="text-gray-600">{product.category}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Brand</h2>
          <p className="text-gray-600">{product.brand}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Material</h2>
          <p className="text-gray-600">{product.material}</p>
        </div>
      </div>

      {/* Features */}
      {(product.features ?? []).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {(product.features ?? []).map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Details</h2>
        <p className="text-gray-600">{product.description}</p>
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

      {/* Colors and Sizes */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Colors */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-xl font-semibold text-gray-800">Brand</h2>
            <p className="text-gray-700">"{product.brand}"</p>
          </div>

          {/* Colors */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Colors</h2>
            <div className="flex gap-3">
              {product.colors?.map((color: { name: string; hex: string }) => (
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

        {/* Sizes */}
        <div className="space-y-6">
          {/* Size */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Size</h2>
            <div className="flex gap-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-8 rounded-full border font-medium transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-red-500 text-white border-red-500 shadow-md"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
        <ProductReviewModal product={product} />
      </div>
    </div>
  );
}
