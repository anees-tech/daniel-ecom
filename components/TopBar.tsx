import React from "react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: "textile-representative",
    title: "Textile Representative",
    image: "/t1.png?height=300&width=500",
    shortDescription:
      "A textile representative connects manufacturers with buyers, ensuring quality and price negotiations.",
  },
  {
    id: "alterszentren",
    title: "Alterszentren",
    image: "/t5.jpeg?height=300&width=500",
    shortDescription:
      "Providing textile solutions for senior living centers, ensuring comfort, durability, and easy care.",
  },
];

const TopBar: React.FC = () => {
  return (
    <div className="bg-gray-100 py-3 px-6 flex justify-between items-center border-b">
      {services.map((service) => (
        <div key={service.id} className="flex items-center space-x-4">
          {/* ✅ Service Image */}
          <Image
            src={service.image}
            alt={service.title}
            width={50}
            height={50}
            className="rounded-md"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{service.title}</h4>
            <p className="text-sm text-gray-600">{service.shortDescription}</p>
            {/* ✅ Read More Link */}
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
