import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { servicesData } from "@/data/service-data";
import { use } from "react";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";

export default function ServiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  return (
    <main className="pt-10 relative">
      <Image
        src="/design.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute right-0 -z-50"
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-8">
        <div className="mb-5 flex flex-row gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
          <Link href="/" className=" text-red-500  hover:text-red-600">
            Back to Services
          </Link>
        </div>
        {/* Breadcrumb */}
        <nav className="flex items-center mb-8 text-sm md:text-xl font-small capitalize">
          <HomeLink />
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/services" className="text-gray-500 hover:text-gray-700">
            Services
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-red-500">{service.title}</span>
        </nav>

        <TextField text={service.title} />

        {/* Service Header */}
        <div className="mb-8">
          <div className="h-80 relative rounded-lg overflow-hidden">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Service Content */}
        <div className="prose max-w-none bg-white p-8 rounded-md">
          <p className="text-lg mb-6">{service.shortDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            {service.additionalImages.map((img, index) => (
              <div
                key={index}
                className="h-60 relative rounded-lg overflow-hidden"
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${service.title} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {service.fullDescription.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Back Button */}
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
