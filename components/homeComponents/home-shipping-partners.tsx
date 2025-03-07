"use client";

interface ShippingPartnersProps {
  images: { src: string; alt: string }[];
}

export default function ShippingPartners({ images }: ShippingPartnersProps) {
  return (
    <div className="bg-white py-4 container mx-auto shadow-gray-300 shadow-lg my-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-10 justify-center items-center">
          {Array.from({ length: 10 }).map((_, index) => (
            <img
              key={index}
              src={images[index % images.length].src}
              alt={images[index % images.length].alt}
              className="h-6 w-auto"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
