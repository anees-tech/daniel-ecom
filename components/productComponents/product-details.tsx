"use client";

import { useState } from "react";
import NavBar from "@/components/navbar";
import products from "@/data/ItemProductDetail";
import ProductImages from "./product-images";
import ProductInfo from "./product-info";
import { use } from "react";
import DeliveryOptions from "./delivery-options";
import ProductReviews from "../reviewsComponents/product-reviews";
import TextBox from "../text-box";
import Image from "next/image";
import RelativeItems from "../relativeComponent/relative-items";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number.parseInt(id);
  const product = products.find((p) => p.id === productId) || products[0]; // Fallback to first product if not found

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
    <div className="w-full overflow-hidden">
      <NavBar />
      <div>
        <div className="px-1 sm:px-2 md:px-4 lg:px-8 pt-50 pb-20">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 sm:p-6 md:p-8 rounded-xl justify-center">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <ProductImages
                product={product}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
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
        <div className="relative">
          <TextBox text={"Reviews"} />
          <Image
            src="/bubble.svg"
            alt="No product image available"
            width={400}
            height={400}
            className="absolute right-0 w-30 h-30 md:w-60 md:h-60 top-5"
          />
          <div className="px-2 sm:px-4 md:px-8 lg:px-12">
            <ProductReviews product={product} />
          </div>
        </div>
        <div>
          <RelativeItems category={product.category} />
        </div>
      </div>
    </div>
  );
}
