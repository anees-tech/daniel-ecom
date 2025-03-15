"use client";

import { useState } from "react";
import NavBar from "@/components/navbar";
import products from "@/data/ItemProductDetail";
import ProductImages from "./product-images";
import ProductInfo from "./product-info";
import { use } from "react";
import DeliveryOptions from "./delivery-options";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  console.log(productId);
  const id = Number.parseInt(productId);
  const product = products.find((params) => params.id === id) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState("XS");

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="w-full">
      <NavBar />
      <div className="px-1 sm:px-2 md:px-4 lg:px-8 rounded-lg shadow-xl pt-50 pb-50">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 sm:p-6 md:p-8 rounded-xl justify-center">
          {/* Product Images */}
          <ProductImages
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          {/* Product Details */}
          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
          />

          {/* Delivery Options */}
          <DeliveryOptions />
        </div>
      </div>
    </div>
  );
}
