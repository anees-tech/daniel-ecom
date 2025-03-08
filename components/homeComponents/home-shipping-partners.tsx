"use client";

interface ShippingPartnersProps {
  images: { src: string; alt: string }[];
}

export default function ShippingPartners({ images }: ShippingPartnersProps) {
  return (
    <div className="bg-white max-w-full">
      <div className=" py-4 container m-auto shadow-lg my-10">
        <div>
          <div className="flex gap-10 justify-center items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <img
                key={index}
                src={images[index % images.length].src}
                alt={images[index % images.length].alt}
                className="h-[20px] md:h-[30px] w-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
