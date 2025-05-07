// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// const services = [
//   {
//     id: "textile-representative",
//     title: "Textile Representative",
//     image: "/t1.png?height=300&width=500",
//     shortDescription:
//       "A textile representative connects manufacturers with buyers, ensuring quality and price negotiations.",
//   },
//   {
//     id: "alterszentren",
//     title: "Alterszentren",
//     image: "/t5.jpeg?height=300&width=500",
//     shortDescription:
//       "Providing textile solutions for senior living centers, ensuring comfort, durability, and easy care.",
//   },
// ];

// const TopBar: React.FC = () => {
//   return (
//     <div className="py-3 px-6 flex flex-col md:flex-row justify-between items-center shadow-xl">
//       {services.map((service) => (
//         <div key={service.id} className="flex items-center space-x-4">
//           {/* ✅ Service Image */}
//           <Image
//             src={service.image}
//             alt={service.title}
//             width={50}
//             height={50}
//             className="rounded-md cover"
//           />
//           <div>
//             <h4 className="font-semibold text-gray-800">{service.title}</h4>
//             <p className="text-sm text-gray-600">{service.shortDescription}</p>
//             {/* ✅ Read More Link */}
//             <Link
//               href={`/services/${service.id}`}
//               className="text-blue-600 text-sm hover:underline"
//             >
//               Read More
//             </Link>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TopBar;
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
            <p className="hidden md:line-clamp-2 md:block text-sm text-gray-600">
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
