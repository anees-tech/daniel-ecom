"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(firestore, "services"));
        const servicesData: Service[] = [];
        
        querySnapshot.forEach((doc) => {
          servicesData.push({
            id: doc.id,
            ...doc.data() as Omit<Service, 'id'>
          });
        });
        
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <main className="pt-10 relative pb-10">
      <Image
        src="/design.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute right-0 -z-50"
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm md:text-xl font-small capitalize">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">Services</span>
        </nav>

        {/* Services Header */}
        <TextField text={"Services"} />

        {/* Services Grid with Enhanced Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((placeholder) => (
              <div key={placeholder} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>
                <div className="p-5">
                  {/* Title Skeleton */}
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4">
                    <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                  
                  {/* Description Lines Skeleton */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-full">
                      <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-5/6">
                      <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-4/6">
                      <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                    </div>
                  </div>
                  
                  {/* Button Skeleton */}
                  <div className="h-10 bg-gray-200 rounded w-28 mx-auto">
                    <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="h-48 relative">
                  <Image
                    src={service.mainImage || "/placeholder.svg"}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{service.name}</h2>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 h-[4.5rem]">
                    {service.details}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className="flex justify-center"
                  >
                    <Button text={"Read More"} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {services.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Image 
              src="/empty-box.svg" 
              alt="No services found" 
              width={120} 
              height={120} 
              className="mx-auto mb-4" 
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Found</h3>
            <p className="text-gray-500">We couldn't find any services at the moment.</p>
          </div>
        )}
      </div>
      <Image
        src="/design2.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute left-0 bottom-0 -z-50"
      />
    </main>
  );
}
