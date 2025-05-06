"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import { toast } from "sonner";
import ProductDetailModal from "./product-detail-modal";

interface ProductCardProps {
  product: any;
}

export default function ProductCardWithModal({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.currentPrice,
      image: product.image || product.images?.[0],
      quantity: 1,
      color: product.colors?.[0]?.name || "",
      size: product.sizes?.[0] || "",
    });

    toast.success("Product added to cart");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image || product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />

            {/* Quick actions overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={handleQuickView}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Quick view"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Discount badge */}
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-bold text-gray-900">
                ${product.currentPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
