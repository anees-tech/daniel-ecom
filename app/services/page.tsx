import Link from "next/link";
import Image from "next/image";
import { servicesData } from "@/data/service-data";
import Button from "@/components/button";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";

export default function ServicesPage() {
  return (
    <main className="pt-40 relative">
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-48 relative">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold mb-2">{service.title}</h2>
                <p className="text-gray-700 text-sm mb-4">
                  {service.shortDescription}
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
