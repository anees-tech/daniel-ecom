"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
interface Service {
  id: string;
  name: string;
  mainImage: string;
  details: string;
}

const TopBar: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "services"));
        const fetchedServices: Service[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedServices.push({
            id: docSnap.id,
            name: data.name,
            mainImage: data.mainImage,
            details: data.details,
          });
        });

        // Shuffle and limit to max 2 services
        const limitedServices = fetchedServices
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        setServices(limitedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="py-3 px-6 flex flex-col md:flex-row justify-between items-center shadow-xl gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center space-x-4 w-full md:w-1/2"
        >
          <Image
            src={service.mainImage}
            alt={service.name}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{service.name}</h4>
            <p className="hidden md:block md:h-[40px] line-clamp-0 text-sm text-gray-600 overflow-hidden">
              {service.details}
            </p>
            <Link
              href={`/services/${service.id}`}
              className="text-blue-600 text-sm hover:underline"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopBar;
