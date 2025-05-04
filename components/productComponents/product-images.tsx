"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
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
  const images = product?.images || [];
  const productName = product?.name || "Product";

  const [desktopStartIndex, setDesktopStartIndex] = useState(0);
  const [mobileStartIndex, setMobileStartIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const visibleThumbnails = 4;
  const maxStartIndex = Math.max(0, images.length - visibleThumbnails);

  const handleDesktopNext = () =>
    setDesktopStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  const handleDesktopPrev = () =>
    setDesktopStartIndex((prev) => Math.max(0, prev - 1));
  const handleMobileNext = () =>
    setMobileStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  const handleMobilePrev = () =>
    setMobileStartIndex((prev) => Math.max(0, prev - 1));

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

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
    <div className="flex flex-col md:flex-row gap-6">
      {/* Desktop Thumbnails (Vertical) */}
      <div className="hidden md:flex flex-col w-[110px] relative order-2 md:order-1">
        {desktopStartIndex > 0 && (
          <button
            onClick={handleDesktopPrev}
            className="mx-auto mb-2 p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        <div className="h-[440px] overflow-hidden">
          <div
            className="flex flex-col gap-3"
            style={{
              transform: `translateY(-${desktopStartIndex * 110}px)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-lg overflow-hidden cursor-pointer h-[100px] w-[100px] transition transform hover:scale-105",
                  selectedImage === index ? "border-red-500" : "border-gray-300"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {desktopStartIndex < maxStartIndex && (
          <button
            onClick={handleDesktopNext}
            className="mx-auto mt-2 p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Image with Zoom */}
      <div className="relative w-full max-w-full h-auto order-1 md:order-2">
        <div
          className="border rounded-lg overflow-hidden flex items-center justify-center relative border-gray-400"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
        >
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt={productName}
            width={200}
            height={200}
            className="object-contain w-full h-auto"
          />

          {/* Zoom Lens */}
          {isZooming && (
            <div
              className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-0 pointer-events-none transition"
              style={{
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundSize: "200%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
        </div>

        {/* Mobile Thumbnails (Horizontal) */}
        <div className="md:hidden relative mt-4">
          {mobileStartIndex > 0 && (
            <button
              onClick={handleMobilePrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="overflow-x-auto scroll-y-hidden scrollbar-hide">
            <div
              className="flex gap-3"
              style={{
                transform: `translateX(-${mobileStartIndex * 110}px)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "border rounded-lg overflow-hidden cursor-pointer w-[100px] h-[100px] flex-shrink-0 transition transform hover:scale-105",
                    selectedImage === index
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${productName} thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {mobileStartIndex < maxStartIndex && (
            <button
              onClick={handleMobileNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
