"use client";

interface ShippingPartnersProps {
  images: { src: string; alt: string }[];
}

export default function ShippingPartners({ images }: ShippingPartnersProps) {
  return (
    <div className="bg-white w-full shadow-gray-300">
      <div className=" py-4 container mx-auto shadow-lg my-10 overflow-hidden">
        <div className="w-full mx-auto">
          <div className="flex gap-10 justify-center items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <img
                key={index}
                src={images[index % images.length].src}
                alt={images[index % images.length].alt}
                className="h-[30px] md:h-[50px] w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
