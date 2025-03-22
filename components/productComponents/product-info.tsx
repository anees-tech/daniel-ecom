"use client";

import { Star, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import ProductReviewModal from "./product-reiw-modal";
import Button from "../button";
import { toast } from "sonner";

interface ProductInfoProps {
  product: any;
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

  const handleAddReview = (review: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    // In a real application, you would send this to your API
    console.log("New review:", review);

    // This would need to be implemented with proper state management
    console.log("Would update product with new review:", review);
  };

  return (
    <div className="w-full md:w-[300px] lg:w-auto space-y-6 p-5 rounded-lg bg-white">
      {/* Title and Rating */}
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

      {/* Details */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Details</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>

      {/* Brand */}
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-xl font-semibold text-gray-800">Brand</h2>
        <p className="text-gray-700">"{product.brand}"</p>
      </div>

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
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Quantity</h2>
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

      {/* Action Buttons */}
      <div className="flex flex-row gap-3 pt-4 justify-start items-center">
        <div className="w-auto">
          <ProductReviewModal product={product} onAddReview={handleAddReview} />
        </div>
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
