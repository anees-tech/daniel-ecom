"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import ProductImages from "../productComponents/product-images";
import ProductInfo from "../productComponents/product-info";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.length > 0 ? product.colors[0].name : ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length > 0 ? product.sizes[0] : "XS"
  );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] p-0 overflow-auto max-h-[90vh] scrollbar-hide bg-white">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="relative">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-none">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-6 gap-6 p-4 md:p-6 mx-auto">
            {/* Product Images - 3/7 width on medium screens and above */}
            <div className="md:col-span-3">
              <ProductImages
                product={product}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>

            {/* Product Info - 3/7 width on medium screens and above */}
            <div className="md:col-span-3">
              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
