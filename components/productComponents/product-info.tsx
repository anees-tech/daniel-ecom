"use client";

import { Star, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";

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

  return (
    <div className="md:w-[400px] lg:w-auto space-y-4">
      {/* Title and Rating */}
      <div>
        <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex">
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
          <span className="text-gray-500 text-sm">
            ({product.reviewsCount} Reviews)
          </span>
          <span className="text-green-500 text-sm">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">
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
        <h2 className="text-xl font-medium mb-2">Details</h2>
        <p className="text-gray-500">{product.description}</p>
      </div>

      {/* Brand */}
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-xl font-medium">Brand</h2>
        <p className="text-gray-700">"{product.brand}"</p>
      </div>

      {/* Colors */}
      <div>
        <h2 className="text-xl font-medium mb-2">Colors</h2>
        <div className="flex gap-3">
          {product.colors.map((color: { name: string; hex: string }) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`w-8 h-8 rounded-full ${
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
        <h2 className="text-xl font-medium mb-2">Size</h2>
        <div className="flex gap-3">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-8 rounded-full border ${
                selectedSize === size
                  ? "bg-red-500 text-white border-red-500"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h2 className="text-xl font-medium mb-2">Quantity</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          className="flex-1 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white py-2 rounded-full hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={product.stock === 0}
          onClick={() =>
            console.log(
              `Buying Product: ${product.id}, Color: ${selectedColor}, Size: ${selectedSize}, Quantity: ${quantity}`
            )
          }
        >
          Buy Now
        </button>

        <button
          className="flex-1 bg-[#ffa100] text-white py-2 rounded-full hover:bg-orange-400 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={product.stock === 0}
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
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
