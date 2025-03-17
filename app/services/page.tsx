"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/service-data";
import { iconMap } from "@/components/icon-map";
import TextBox from "@/components/text-box";

export default function ServicesComponent() {
  const [showAll, setShowAll] = useState(false);

  const visibleServices = showAll ? services : services.slice(0, 4);

  // Debug services data
  console.log("Services data:", services);

  return (
    <div className="w-full">
      <TextBox text={"Our Services"} />
      <div className="px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a range of services to make your shopping experience
              seamless and enjoyable. Discover how we can serve you better.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleServices.map((service) => {
              // Use a default icon if the mapping fails
              const IconComponent =
                service.icon && iconMap[service.icon]
                  ? iconMap[service.icon]
                  : Package;
              return (
                <div key={service.id} className="transition-all duration-300">
                  <Card className="h-full border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-orange-300 hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden h-40 bg-red-500">
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                          <IconComponent className="h-16 w-16 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {service.shortDescription}
                        </p>
                        <Link
                          href={`/services/${service.slug}`}
                          className="mt-auto block"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 border-orange-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white group rounded-full"
                          >
                            Learn More
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          {!showAll && services.length > 4 && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(true)}
                className="group border-orange-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:text-white rounded-full"
              >
                Show More Services
                <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform text-orange-500 group-hover:text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
