"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Info, Phone, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceBySlug } from "@/data/service-data";
import { Service } from "@/interfaces/service";
import { iconMap } from "@/components/icon-map";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    // Find the service directly using the helper function
    const foundService = getServiceBySlug(slug);

    if (foundService) {
      setService(foundService);
    }

    setLoading(false);
  }, [slug]);

  // If service not found, return 404
  if (!loading && !service) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) return null;

  // Use a default icon if the mapping fails
  const IconComponent =
    service.icon && iconMap[service.icon] ? iconMap[service.icon] : Package;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-orange-50 pt-30">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-400 p-5 rounded-full mb-4 text-white">
            <IconComponent className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {service.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            {service.shortDescription}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-400 rounded-full mx-auto"></div>
        </div>

        {/* Alternating Image and Content Sections */}
        <div className="space-y-16 mb-16">
          {/* First Section - Image Left, Content Right */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
              <Image
                src={
                  service.images && service.images.length > 0
                    ? service.images[0]
                    : "/placeholder.svg?height=600&width=800"
                }
                alt={`${service.title} - main image`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                About {service.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {service.description}
              </p>
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 rounded-full">
                Get Started
              </Button>
            </div>
          </div>

          {/* Second Section - Content Left, Image Right */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                <Image
                  src={
                    service.images && service.images.length > 1
                      ? service.images[1]
                      : "/placeholder.svg?height=600&width=800"
                  }
                  alt={`${service.title} - features`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:order-1">
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-3">
                {service.features &&
                  service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Third Section - Image Left, Content Right */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
              <Image
                src={
                  service.images && service.images.length > 2
                    ? service.images[2]
                    : "/placeholder.svg?height=600&width=800"
                }
                alt={`${service.title} - benefits`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Why Choose Our {service.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our {service.title.toLowerCase()} service is designed to make
                your shopping experience as convenient as possible. We
                prioritize quality, efficiency, and customer satisfaction in
                everything we do.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                With years of experience in the industry, we&apos;ve perfected
                our processes to ensure you receive the best service possible.
              </p>
              <Button
                variant="outline"
                className="border-orange-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white rounded-full"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* About and Contact Sections at Bottom Center */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            More Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-orange-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-red-500 to-orange-400 p-3 rounded-full mb-4 text-white">
                    <Info className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    About This Service
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                  <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400 opacity-20 rounded-full my-4"></div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-orange-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white rounded-full"
                  >
                    Read FAQ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-red-500 to-orange-400 p-3 rounded-full mb-4 text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Our customer service team is ready to assist you with any
                    questions about our {service.title.toLowerCase()} service.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 rounded-full">
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
