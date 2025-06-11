"use client";

import { Star, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import Button from "../button";
import { toast } from "sonner";
import PaymentModal from "../paymentComponents/paymentModal";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { useUser } from "@/context/userContext";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    currentPrice: number;
    originalPrice: number;
    discount?: number;
    stock: number;
    rating: number;
    reviewsCount: number;
    brand: string;
    sku: string;
    sizes: string[];
    outOfStockSizes?: string[];
    colors: { name: string; hex: string }[];
    description: string;
    material?: string;
    features?: string[];
    image: string;
    images: string[];
    reviews?: any[];
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
  const [modal, setModal] = useState(false);
  const { user } = useUser();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const outOfStock = Array.isArray(product.outOfStockSizes)
    ? product.outOfStockSizes
    : [];

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      const firstAvailable = availableSizes.find(
        (size) => !outOfStock.includes(size)
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
      }
    }
  }, [availableSizes, outOfStock, selectedSize, setSelectedSize]);

  return (
    <div className="w-full space-y-6">
      {/* Title and Rating */}
      <div className="flex flex-col md:justify-between md:items-start gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-500">
                €{product.currentPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-red-500 line-through text-lg">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
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
            <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <span>({product.reviewsCount} Reviews)</span>
              <span
                className={`font-medium ${
                  product.stock > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Details</h2>
          <pre className="text-gray-600 mb-4 mr-5 whitespace-pre-wrap font-sans">
            {product.description}
          </pre>
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <strong>SKU:</strong> {product.sku || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Category</h2>
          <div className="text-gray-600">
            {product.category.charAt(0).toUpperCase() +
              product.category.slice(1).toLowerCase()}
          </div>
        </div>
        {product.subcategory && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Subcategory</h2>
            <div className="text-gray-600">
              {product.subcategory.charAt(0).toUpperCase() +
                product.subcategory.slice(1).toLowerCase()}
            </div>
          </div>
        )}
      </div>

      {/* Brand and Material */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-2">
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
          <ul className="grid gap-2 text-gray-700 text-sm">
            {product.features!.map((feature: string, index: number) => (
              <li
                key={index}
                className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
              >
                <span className="text-green-500 text-lg">✓</span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Colors and Sizes */}
      <div className="flex flex-col gap-2">
        {/* Colors */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Colors</h2>
          <div className="flex gap-3">
            {product.colors?.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-9 h-9 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer ${
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

        {/* Sizes */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Size</h2>
          <div className="flex flex-wrap gap-3">
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => {
                const isOutOfStock = outOfStock.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`w-auto px-2 h-8 rounded-full border font-medium transition-all duration-300 cursor-pointer ${
                      selectedSize === size && !isOutOfStock
                        ? "bg-red-500 text-white border-red-500 shadow-md"
                        : isOutOfStock
                        ? "border-gray-300 text-gray-400 bg-gray-200 line-through cursor-not-allowed"
                        : "border-gray-300 text-gray-700 hover:bg-orange-400 hover:text-white"
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quantity</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-red-500 cursor-pointer"
            >
              <Minus className="w-5 h-5 hover:text-white" />
            </button>
            <span className="w-12 text-center text-lg font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:bg-red-500 cursor-pointer"
            >
              <Plus className="w-5 h-5 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row gap-3 pt-4 justify-start items-center">
        <Button
          text={"Add to Cart"}
          onClick={() => {
            if (!selectedSize) {
              toast("Please Select Size to Add Item to the Cart");
              return;
            }
            addToCart({
              id: product.id,
              name: product.name,
              price: product.currentPrice,
              image: product.image,
              quantity,
              color: selectedColor,
              size: selectedSize,
            });
            toast.success("Product has been added to cart");
          }}
        />
        <Button
          text={"Buy Now"}
          onClick={() => {
            if (!user) {
              setModal(true);
              setIsPaymentModalOpen(false);
              toast.error(
                "User Must be logged in to make any kind of Payments."
              );
            } else {
              setIsPaymentModalOpen(true);
            }
          }}
        />
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        taxRate={5}
        products={[
          {
            id: product.id,
            color: selectedColor,
            size: selectedSize,
            quantity,
            name: product.name,
            price: product.currentPrice,
            image: product.image,
          },
        ]}
      />
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
    </div>
  );
}
