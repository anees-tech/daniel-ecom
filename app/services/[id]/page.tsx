"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import HomeLink from "@/components/home-link";
import Button from "@/components/button";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface Service {
  id: string;
  name: string;
  details: string;
  mainImage: string;
  subImages: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const serviceId = params.id; // Access the id directly
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const docRef = doc(firestore, "services", serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const serviceData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Service;

          setService(serviceData);
          setSelectedImage(serviceData.mainImage);
        } else {
          console.log("No such service!");
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Handle selecting a different image
  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  if (loading) {
    return (
      <div className="pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-10"></div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Main image skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="pt-4">
                <div className="h-10 bg-gray-200 rounded w-36"></div>
              </div>
            </div>
          </div>

          {/* Thumbnails skeleton */}
          <div className="mt-8 flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded"></div>
            <div className="w-20 h-20 bg-gray-200 rounded"></div>
            <div className="w-20 h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
        <Link href="/services">
          <Button text="Back to Services" />
        </Link>
      </div>
    );
  }

  const allImages = [service.mainImage, ...(service.subImages || [])];

  return (
    <main className="pt-10 pb-20 relative">
      <Image
        src="/design.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute right-0 top-0 -z-50"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm md:text-lg">
          <HomeLink />
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <Link href="/services" className="text-gray-600 hover:text-gray-800">
            Services
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-red-500 font-medium truncate">{service.name}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left column - Images */}
            <div className="space-y-6">
              {/* Main selected image */}
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={selectedImage || service.mainImage}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Image thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(image)}
                      className={`w-20 h-20 relative rounded cursor-pointer border-2 ${
                        selectedImage === image
                          ? "border-red-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${service.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Content */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">{service.name}</h1>
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{service.details}</p>
              </div>
              <Link href="/contact" className="inline-block">
                <Button text="Contact Us About This Service" />
              </Link>
            </div>
          </div>
        </div>

        {/* Back to services button */}
        <div className="mt-10 flex justify-center">
          <Link href="/services" className="inline-flex items-center text-red-500 hover:text-red-600">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to All Services</span>
          </Link>
        </div>
      </div>

      <Image
        src="/design2.svg"
        alt="Design"
        width={200}
        height={200}
        className="absolute left-0 bottom-0 -z-50"
      />
    </main>
  );
}
