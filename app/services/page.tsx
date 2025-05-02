"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import Loading from "../loading";

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
            ...(doc.data() as Omit<Service, "id">),
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

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="pt-0 relative pb-10">
      <Image
        src="/design.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute right-0 -z-50"
      />
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm md:text-xl font-small capitalize">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">Services</span>
        </nav>

        {/* Services Header */}
        <TextField text={"Services"} />

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                title={service.name}
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
                  <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2 h-[4.5rem]">
                    {service.name}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 h-[4.5rem]">
                    {service.details}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className="flex justify-center items-center m-auto"
                  >
                    <Button text={"Read More"} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center py-16 bg-white rounded-lg shadow-md max-w-md w-full">
              <Image
                src="/empty-box.svg"
                alt="No services found"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Services Found
              </h3>
              <p className="text-gray-500">
                We couldn&apos;t find any services at the moment.
              </p>
            </div>
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
