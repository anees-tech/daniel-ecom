"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  product?: {
    name?: string;
    images?: string[];
  };
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export default function ProductImages({
  product = { name: "Product", images: [] },
  selectedImage = 0,
  setSelectedImage,
}: ProductImagesProps) {
  // Ensure product and images exist with fallbacks
  const images = product?.images || [];
  const productName = product?.name || "Product";

  // State for thumbnail navigation
  const [desktopStartIndex, setDesktopStartIndex] = useState(0);
  const [mobileStartIndex, setMobileStartIndex] = useState(0);

  // Number of visible thumbnails
  const visibleThumbnails = 4;

  // Maximum start index
  const maxStartIndex = Math.max(0, images.length - visibleThumbnails);

  // Handle desktop navigation (vertical)
  const handleDesktopNext = () => {
    const newIndex = Math.min(maxStartIndex, desktopStartIndex + 1);
    setDesktopStartIndex(newIndex);
  };

  const handleDesktopPrev = () => {
    const newIndex = Math.max(0, desktopStartIndex - 1);
    setDesktopStartIndex(newIndex);
  };

  // Handle mobile navigation (horizontal)
  const handleMobileNext = () => {
    const newIndex = Math.min(maxStartIndex, mobileStartIndex + 1);
    setMobileStartIndex(newIndex);
  };

  const handleMobilePrev = () => {
    const newIndex = Math.max(0, mobileStartIndex - 1);
    setMobileStartIndex(newIndex);
  };

  // If there are no images, render a placeholder
  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-[400px] h-auto">
          <div className="border rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="No product image available"
              width={400}
              height={400}
              className="object-contain w-[300px] h-[300px]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Desktop Thumbnails (Vertical) */}
      <div className="hidden md:flex flex-col w-[100px] relative order-2 md:order-1">
        {/* Up button - only show if there are previous images */}
        {desktopStartIndex > 0 && (
          <button
            onClick={handleDesktopPrev}
            className="mx-auto mb-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Show previous"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}

        <div className="h-[412px] overflow-hidden">
          <div
            className="flex flex-col gap-[2px]"
            style={{
              transform: `translateY(-${desktopStartIndex * 102}px)`, // 100px height + 2px gap
              transition: "transform 0.3s ease-in-out", // Smooth animation
            }}
          >
            {images.map((image: string, index: number) => (
              <div
                key={index}
                className={cn(
                  "border rounded-md overflow-hidden cursor-pointer h-[100px]",
                  selectedImage === index ? "border-red-500" : "border-gray-200"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg?height=100&width=100"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Down button - only show if there are more images to display */}
        {desktopStartIndex < maxStartIndex && (
          <button
            onClick={handleDesktopNext}
            className="mx-auto mt-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Show more"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Image */}
      <div className="w-full max-w-[400px] h-auto order-1 md:order-2">
        <div className="border rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={
              images[selectedImage] || "/placeholder.svg?height=400&width=400"
            }
            alt={productName}
            width={400}
            height={400}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Mobile Thumbnails (Horizontal) */}
        <div className="md:hidden relative mt-4">
          {/* Left button - only show if there are previous images */}
          {mobileStartIndex > 0 && (
            <button
              onClick={handleMobilePrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Show previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div className="overflow-hidden">
            <div
              className="flex gap-[2px]"
              style={{
                transform: `translateX(-${mobileStartIndex * 102}px)`, // 100px width + 2px gap
                transition: "transform 0.3s ease-in-out", // Smooth animation
              }}
            >
              {images.map((image: string, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "border rounded-md overflow-hidden cursor-pointer w-[100px] h-[100px] flex-shrink-0",
                    selectedImage === index
                      ? "border-red-500"
                      : "border-gray-200"
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${productName} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right button - only show if there are more images to display */}
          {mobileStartIndex < maxStartIndex && (
            <button
              onClick={handleMobileNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Show more"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
