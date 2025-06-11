"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import products from "@/data/ItemProductDetail";
import ProductImages from "./product-images";
import ProductInfo from "./product-info";
import DeliveryOptions from "./delivery-options";
import ProductReviews from "../reviewsComponents/product-reviews";
import TextBox from "../text-box";
import TextField from "../text-field";
import HomeLink from "../home-link";
import RelativeItems from "../relativeComponent/relative-items";
import Loading from "../categoryComponents/loading";

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
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const processProductData = (productData: any) => {
      if (!productData) {
        return null;
      }
      let updatedImages = productData.images ? [...productData.images] : [];
      if (productData.image && !updatedImages.includes(productData.image)) {
        updatedImages.unshift(productData.image); // Prepend the main image
      }
      return { ...productData, images: updatedImages };
    };

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const { productId } = await params;
        const firestoreProduct = await getProductById(productId);

        const processedProduct = processProductData(firestoreProduct);
        setProduct(processedProduct);
        setSelectedColor(processedProduct?.colors?.[0]?.name || "");
      } catch (error) {
        console.error("Error fetching product:", error);

        try {
          const { productId } = await params;
          const oProductId = Number.parseInt(productId);
          const foundProduct =
            products.find((p) => p.id === oProductId) || products[0];

          const processedFallbackProduct = processProductData(foundProduct);
          setProduct(processedFallbackProduct);
          setSelectedColor(processedFallbackProduct?.colors?.[0]?.name || "");
        } catch (fallbackError) {
          console.error("Even fallback failed:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };
  console.log("Product Detail Page Rendered", product);
  if (isLoading) {
    return <Loading/>; // 👈 only one global loader
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="pt-5 pb-20">
        {/* Breadcrumb */}
        <div className="text-sm md:text-xl font-small mb-10 capitalize flex gap-1 md:gap-2 px-2 sm:px-4 md:px-8 lg:px-12">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={`/category/${product.category}`}
            className="text-gray-500 hover:text-gray-700"
          >
            {product.category}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">{product.name}</span>
        </div>

        <TextField text={product.name} />

        <div className="px-0 sm:px-2 md:px-4 lg:px-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 sm:p-6 md:p-8 rounded-xl justify-center shadow-sm md:shadow-md">
            <div className="w-full lg:w-1/2">
              <ProductImages
                product={product}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
            <div className="px-0 sm:px-2 md:px-4 lg:px-8 mb-8 w-full md:w-1/3">
              <div className="bg-white p-4 sm:p-6 md:p-8">
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
            <div className="w-full lg:w-1/4">
              <DeliveryOptions />
            </div>
          </div>
        </div>

        {/* Features Section */}
        {(product?.features ?? []).length > 0 && (
          <div className="mt-10">
            <TextBox text="Features" />
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm md:shadow-md mt-4">
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
          </div>
        )}

        {/* Reviews Section */}
        <div className="relative mt-10">
          <TextBox text="Reviews" />
          <Image
            src="/bubble.svg"
            alt="Bubble graphic"
            width={400}
            height={400}
            className="absolute right-0 w-30 h-30 md:w-60 md:h-60 top-5"
          />
          <div className="px-2 sm:px-4 md:px-8 lg:px-12">
            <ProductReviews product={product} />
          </div>
        </div>

        {/* Related Items */}
        <div>
          <RelativeItems category={product.category} />
        </div>
      </div>
    </div>
  );
}
