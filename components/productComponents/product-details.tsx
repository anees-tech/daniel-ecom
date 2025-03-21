"use client";

import { useState, useEffect } from "react";
import products from "@/data/ItemProductDetail";
import ProductImages from "./product-images";
import ProductInfo from "./product-info";
import DeliveryOptions from "./delivery-options";
import ProductReviews from "../reviewsComponents/product-reviews";
import TextBox from "../text-box";
import Image from "next/image";
import RelativeItems from "../relativeComponent/relative-items";
import Link from "next/link";
import TextField from "../text-field";
import HomeLink from "../home-link";
import ProductImagesSkeleton from "./image-skeleton";
import ProductInfoSkeleton from "./product-info-skeleton-card";
import { DeliveryOptionsSkeleton } from "./delivery-option-skeleton-loader";
import ProductReviewsSkeleton from "../reviewsComponents/review-skeleton";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("XS");

  useEffect(() => {
    async function fetchProduct() {
      const { productId } = await params;
      const oProductId = Number.parseInt(productId);
      const foundProduct =
        products.find((p) => p.id === oProductId) || products[0];

      setProduct(foundProduct);
      setSelectedColor(foundProduct?.colors[0]?.name || "");
      setIsLoading(false);
    }

    fetchProduct();
  }, [params]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="pt-40 pb-20">
        {/* Breadcrumb */}
        <div className="text-sm md:text-xl font-small mb-10 capitalize flex gap-1 md:gap-2 px-2 sm:px-4 md:px-8 lg:px-12">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          {!isLoading ? (
            <>
              <Link
                href={`/category/${product.category}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {product.category}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-red-500">{product.name}</span>
            </>
          ) : (
            <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
          )}
        </div>

        {/* Product Title */}
        <TextField text={!isLoading ? product.name : "Loading..."} />

        {/* Product Content */}
        <div className="px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 sm:p-6 md:p-8 rounded-xl justify-center shadow-xl">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              {isLoading ? (
                <ProductImagesSkeleton />
              ) : (
                <ProductImages
                  product={product}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              )}
            </div>

            {/* Product Details */}
            {isLoading ? (
              <ProductInfoSkeleton />
            ) : (
              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
              />
            )}

            {/* Delivery Options */}
            {isLoading ? <DeliveryOptionsSkeleton /> : <DeliveryOptions />}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="relative mt-10">
          <TextBox text={"Reviews"} />
          <Image
            src="/bubble.svg"
            alt="No product image available"
            width={400}
            height={400}
            className="absolute right-0 w-30 h-30 md:w-60 md:h-60 top-5"
          />
          <div className="px-2 sm:px-4 md:px-8 lg:px-12">
            {isLoading ? (
              <ProductReviewsSkeleton />
            ) : (
              <ProductReviews product={product} />
            )}
          </div>
        </div>

        {/* Related Items */}
        <div>{!isLoading && <RelativeItems category={product.category} />}</div>
      </div>
    </div>
  );
}
