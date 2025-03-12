"use client";

import { useState } from "react";
import Image from "next/image";
import products from "@/data/products";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

function Page({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id);
  const product = products.find((p) => p.id === productId) || products[0]; // Fallback to first product if not found

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(2); // Default to 2 as shown in the image
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState("XS"); // Default to XS as shown in the image

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="w-full">
      <NavBar />
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 bg-white rounded-lg shadow-sm pt-50 pb-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2 w-20">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`border-2 rounded-md overflow-hidden cursor-pointer ${
                  selectedImage === index
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg?height=80&width=80"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="md:flex-1">
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={
                  product.images[selectedImage] ||
                  "/placeholder.svg?height=400&width=400"
                }
                alt={product.name}
                width={400}
                height={400}
                className="object-contain w-full h-[300px]"
              />
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-2 mt-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-md overflow-hidden cursor-pointer flex-shrink-0 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=60&width=60"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="object-cover h-14 w-14"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div className="md:w-[350px]">
            <div className="space-y-4">
              <div>
                <h1 className="text-lg font-medium">{product.name}</h1>
                <p className="text-xs text-gray-500">{product.brand}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-500">
                  ${product.currentPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              </div>
              <div>
                <h3 className="font-medium">Details</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Brand</h3>
                <p className="text-sm">{product.brand}</p>
              </div>
              <div>
                <h3 className="font-medium">Colors</h3>
                <div className="flex gap-2 mt-1">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                        selectedColor === color.name
                          ? "border-gray-600"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Size</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <div className="relative">
                    <div
                      className={`flex px-3 py-1 cursor-pointer items-center justify-center rounded-full ${
                        selectedSize === "XS"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize("XS")}
                    >
                      XS
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex px-3 py-1 cursor-pointer items-center justify-center rounded-full ${
                        selectedSize === "S"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize("S")}
                    >
                      S
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex px-3 py-1 cursor-pointer items-center justify-center rounded-full ${
                        selectedSize === "M"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize("M")}
                    >
                      M
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex px-3 py-1 cursor-pointer items-center justify-center rounded-full ${
                        selectedSize === "L"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize("L")}
                    >
                      L
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex px-3 py-1 cursor-pointer items-center justify-center rounded-full ${
                        selectedSize === "XL"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize("XL")}
                    >
                      XL
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Quantity</h3>
                <div className="flex items-center mt-1">
                  <button
                    className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="px-5 py-1 flex items-center justify-center border-2 border-gray-400 rounded-full">
                    {quantity}
                  </div>
                  <button
                    className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-500 text-white rounded-full text-sm">
                  Buy now
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          {/* Delivery Options */}
          <div className="md:w-[250px] border rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Delivery options</h3>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Secure Packaging Method</span>
              <span className="ml-auto text-orange-500 text-xs">CHANGE</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M7 15h0"></path>
                <path d="M2 9h20"></path>
              </svg>
              <span>Standard Delivery</span>
              <span className="ml-auto text-xs text-gray-500">
                Estimated for 2 days after ship
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <span>Free Delivery</span>
              <span className="ml-auto text-xs text-gray-500">
                For orders above $200
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Personal Pickup</span>
              <span className="ml-auto text-xs text-gray-500">
                Collect your order at your own time
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Warranty</span>
              <span className="ml-auto text-xs text-gray-500">
                30 days warranty returns
              </span>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">
                Position seller ratings
              </h4>
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center">
                    <span className="text-sm font-bold">89%</span>
                  </div>
                  <span className="text-xs text-center block mt-1">
                    Shipping on time
                  </span>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center">
                    <span className="text-sm font-bold">95%</span>
                  </div>
                  <span className="text-xs text-center block mt-1">
                    Response rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
