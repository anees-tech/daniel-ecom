// "use client";

// import { useState, useEffect } from "react";
// import { use } from "react"; // Add this import
// import Image from "next/image";
// import Link from "next/link";
// import { doc, getDoc } from "firebase/firestore";
// import { firestore } from "@/lib/firebaseConfig";
// import HomeLink from "@/components/home-link";
// import Button from "@/components/button";
// import { ArrowLeft, ChevronRight, Clock, Calendar, Star } from "lucide-react";
// import TextField from "@/components/text-field";

// interface Service {
//   id: string;
//   name: string;
//   details: string;
//   mainImage: string;
//   subImages: string[];
//   createdAt: {
//     seconds: number;
//     nanoseconds: number;
//   };
// }

// export default function ServiceDetailPage({
//   params,
// }: {
//   // Update the params type to be a Promise
//   params: Promise<{ id: string }>;
// }) {
//   // Use the use() hook to resolve the Promise
//   const resolvedParams = use(params);
//   const serviceId = resolvedParams.id;

//   const [service, setService] = useState<Service | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchService() {
//       try {
//         setLoading(true);
//         const docRef = doc(firestore, "services", serviceId);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const serviceData = {
//             id: docSnap.id,
//             ...docSnap.data(),
//           } as Service;

//           setService(serviceData);
//           setSelectedImage(serviceData.mainImage);
//         } else {
//           console.log("No such service!");
//         }
//       } catch (error) {
//         console.error("Error fetching service details:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (serviceId) {
//       fetchService();
//     }
//   }, [serviceId]);

//   // Handle selecting a different image
//   const handleImageSelect = (image: string) => {
//     setSelectedImage(image);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="animate-pulse">
//             <div className="h-6 bg-gray-200 rounded-full w-1/4 mb-6"></div>
//             <div className="h-10 bg-gray-200 rounded-full w-1/2 mb-10"></div>

//             <div className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
//               <div className="grid md:grid-cols-2 gap-10">
//                 {/* Main image skeleton */}
//                 <div className="aspect-square bg-gray-200 rounded-xl"></div>

//                 {/* Content skeleton */}
//                 <div className="space-y-4">
//                   <div className="h-8 bg-gray-200 rounded-full w-3/4"></div>
//                   <div className="space-y-2">
//                     <div className="h-4 bg-gray-200 rounded-full w-full"></div>
//                     <div className="h-4 bg-gray-200 rounded-full w-full"></div>
//                     <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
//                     <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
//                   </div>
//                   <div className="pt-4">
//                     <div className="h-12 bg-gray-200 rounded-full w-36"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Thumbnails skeleton */}
//               <div className="mt-8 flex space-x-4">
//                 <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
//                 <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
//                 <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-12 animate-fade-in-up">
//             <div className="inline-flex justify-center items-center w-24 h-24 bg-red-50 rounded-full mb-6">
//               <ArrowLeft className="h-10 w-10 text-red-500" />
//             </div>
//             <h1 className="text-3xl font-bold text-red-500 mb-4">
//               Service Not Found
//             </h1>
//             <p className="text-gray-600 mb-8">
//               The service you&apos;re looking for doesn&apos;t exist or has been
//               removed.
//             </p>
//             <Link href="/services">
//               <Button text="Back to Services" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const allImages = [service.mainImage, ...(service.subImages || [])];
//   const createdDate = new Date(service.createdAt.seconds * 1000);
//   const formattedDate = createdDate.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <main className="min-h-screen pt-10 pb-20 relative overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-10 -mr-32 -mt-32"></div>
//       <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-10 -ml-32 -mb-32"></div>

//       <Image
//         src="/design.svg"
//         alt="Design"
//         width={200}
//         height={200}
//         priority
//         className="absolute right-0 top-0 -z-10 opacity-50 animate-float"
//       />

//       <div className="px-2 sm:px-4 md:px-8 lg:px-12 relative z-10">
//         {/* Breadcrumb */}
//         <nav className="flex items-center mb-8 text-sm md:text-lg py-2 px-4 inline-flex animate-fade-in-down">
//           <HomeLink />
//           <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
//           <Link
//             href="/services"
//             className="text-gray-600 hover:text-gray-800 transition"
//           >
//             Services
//           </Link>
//           <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
//           <span className="text-red-500 font-medium truncate">
//             {service.name}
//           </span>
//         </nav>
//         <TextField text={service.name} />

//         <div className="bg-white rounded-2xl shadow-sm p-8 overflow-hidden animate-fade-in-up">
//           <div className="grid md:grid-cols-2 gap-10">
//             {/* Left column - Main Image */}
//             <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
//               <Image
//                 src={selectedImage || service.mainImage}
//                 alt={service.name}
//                 fill
//                 className="object-cover transition-transform duration-700 hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
//             </div>

//             {/* Right column - Content */}
//             <div className="flex flex-col">
//               <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//                 <Calendar className="h-4 w-4" />
//                 <span>{formattedDate}</span>
//                 <span className="mx-2">•</span>
//                 <Star className="h-4 w-4 text-yellow-500" />
//                 <span>Premium Service</span>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
//                 {service.name}
//               </h1>

//               <div className="prose prose-lg text-gray-600 mb-8 flex-grow">
//                 <pre className="mr-5 whitespace-pre-wrap font-sans">
//                   {service.details}
//                 </pre>
//               </div>

//               <div className="mt-auto">
//                 <div className="bg-gray-50 p-4 rounded-xl mb-6 transform transition-transform hover:scale-102">
//                   <div className="flex items-center text-gray-700">
//                     <Clock className="h-5 w-5 mr-2 text-red-500" />
//                     <span>Quick response time • Professional service</span>
//                   </div>
//                 </div>

//                 <Link href="/contact">
//                   <div className="w-full">
//                     <Button text="Contact Us About This Service" />
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Image thumbnails - now below the main content */}
//           {allImages.length > 1 && (
//             <div className="mt-8 flex space-x-4 overflow-x-auto pb-2">
//               {allImages.map((image, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleImageSelect(image)}
//                   className={`w-20 h-20 relative rounded-lg cursor-pointer border-2 shadow-md animate-fade-in-up transition-all duration-300 hover:scale-105 ${
//                     selectedImage === image
//                       ? "border-red-500 ring-2 ring-red-500 ring-offset-2"
//                       : "border-white hover:border-red-200"
//                   }`}
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <Image
//                     src={image || "/placeholder.svg"}
//                     alt={`${service.name} thumbnail ${index + 1}`}
//                     fill
//                     className="object-cover rounded-md"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Back to services button */}
//         <div
//           className="mt-10 flex justify-center animate-fade-in-up"
//           style={{ animationDelay: "200ms" }}
//         >
//           <Link href="/services">
//             <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm text-red-500 hover:text-red-600 hover:bg-white transition-all hover:translate-x-[-5px]">
//               <ArrowLeft className="mr-2 h-5 w-5" />
//               <span>Back to All Services</span>
//             </div>
//           </Link>
//         </div>
//       </div>

//       <Image
//         src="/design2.svg"
//         alt="Design"
//         width={200}
//         height={200}
//         className="absolute left-0 bottom-0 -z-10 opacity-50 animate-float-reverse"
//       />
//     </main>
//   );
// }
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import HomeLink from "@/components/home-link";
import Button from "@/components/button";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Calendar,
  Star,
  ChevronLeft,
} from "lucide-react";
import TextField from "@/components/text-field";

interface Service {
  id: string;
  name: string;
  details: string;
  mainImage: string;
  subImages: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Use the use() hook to resolve the Promise
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Use a ref to store the interval ID instead of state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get all images once service is loaded
  const allImages = service
    ? [service.mainImage, ...(service.subImages || [])]
    : [];

  // Function to advance to the next image - doesn't depend on currentImageIndex
  const goToNextImage = useCallback(() => {
    if (allImages.length <= 1) return;

    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % allImages.length;
      setSelectedImage(allImages[newIndex]);
      return newIndex;
    });
  }, [allImages]);

  // Function to go to the previous image - doesn't depend on currentImageIndex
  const goToPrevImage = useCallback(() => {
    if (allImages.length <= 1) return;

    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? allImages.length - 1 : prevIndex - 1;
      setSelectedImage(allImages[newIndex]);
      return newIndex;
    });
  }, [allImages]);

  // Fetch service data
  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const docRef = doc(firestore, "services", serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const serviceData = {
            id: docSnap.id,
            ...docSnap.data(),
          } as Service;

          setService(serviceData);
          setSelectedImage(serviceData.mainImage);
        } else {
          console.log("No such service!");
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Set up and clean up auto slider
  useEffect(() => {
    // Only start the slider if we have multiple images and we're not hovering
    if (allImages.length > 1 && !isHovering) {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up new interval
      intervalRef.current = setInterval(goToNextImage, 3000);
    } else if (intervalRef.current) {
      // Clear interval if hovering or not enough images
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [allImages.length, isHovering, goToNextImage]);

  // Handle manual image selection
  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded-full w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded-full w-1/2 mb-10"></div>

            <div className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Main image skeleton */}
                <div className="aspect-square bg-gray-200 rounded-xl"></div>

                {/* Content skeleton */}
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
                  </div>
                  <div className="pt-4">
                    <div className="h-12 bg-gray-200 rounded-full w-36"></div>
                  </div>
                </div>
              </div>

              {/* Thumbnails skeleton */}
              <div className="mt-8 flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 animate-fade-in-up">
            <div className="inline-flex justify-center items-center w-24 h-24 bg-red-50 rounded-full mb-6">
              <ArrowLeft className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              Service Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The service you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/services">
              <Button text="Back to Services" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = new Date(service.createdAt.seconds * 1000);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen pt-0 pb-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-10 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-10 -ml-32 -mb-32"></div>

      <Image
        src="/design.svg"
        alt="Design"
        width={200}
        height={200}
        priority
        className="absolute right-0 top-0 -z-10 opacity-50 animate-float"
      />

      <div className="px-2 sm:px-4 md:px-8 lg:px-12 relative z-10 py-8">
        {/* Breadcrumb */}
        <nav className="items-center mb-4 text-md md:text-lg py-2 px-4 inline-flex animate-fade-in-down">
          <HomeLink />
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <Link
            href="/services"
            className="text-gray-600 hover:text-gray-800 transition"
          >
            Services
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-red-500 font-medium truncate">
            {service.name}
          </span>
        </nav>
        <TextField text={service.name} />

        <div className="bg-white rounded-2xl shadow-sm p-8 overflow-hidden animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left column - Main Image with Slider */}
            <div
              className="aspect-square relative rounded-xl overflow-hidden border border-gray-100 shadow-sm group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                src={selectedImage || service.mainImage}
                alt={service.name}
                fill
                className="transition-all duration-500 object-cover"
                quality={100}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Navigation arrows - only show when hovering or on mobile */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 active:bg-red-500 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700 hover:text-white" />
                  </button>

                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 active:bg-red-500 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700 hover:text-white" />
                  </button>
                </>
              )}

              {/* Slider indicators */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(allImages[index], index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === index
                          ? "bg-white w-4"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Content */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
                <span className="mx-2">•</span>
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Premium Service</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {service.name}
              </h1>

              <div className="prose prose-lg text-gray-600 mb-8 flex-grow">
                <pre className="mr-5 whitespace-pre-wrap font-sans">
                  {service.details}
                </pre>
              </div>

              <div className="mt-auto">
                <div className="bg-gray-50 p-4 rounded-xl mb-6 transform transition-transform hover:scale-102 active:scale-102">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-2 text-red-500" />
                    <span>Quick response time • Professional service</span>
                  </div>
                </div>

                <Link href="/contact">
                  <div className="w-full cursor-pointer">
                    <Button text="Contact Us About This Service" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Image thumbnails - now below the main content */}
          {allImages.length > 1 && (
            <div className="mt-8 flex space-x-4 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageSelect(image, index)}
                  className={`w-20 h-20 relative rounded-lg cursor-pointer border-2 shadow-md animate-fade-in-up transition-all duration-300 hover:scale-105 ${
                    currentImageIndex === index
                      ? "border-red-500 ring-2 ring-red-500 ring-offset-2"
                      : "border-white hover:border-red-200 active:border-red-200"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${service.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to services button */}
        <div
          className="mt-10 flex justify-center animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <Link href="/services">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm text-red-500 hover:text-red-600 active:text-red-600 active:bg-white hover:bg-white transition-all hover:translate-x-[-2px] cursor-pointer">
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Back to All Services</span>
            </div>
          </Link>
        </div>
      </div>

      <Image
        src="/design2.svg"
        alt="Design"
        width={200}
        height={200}
        className="absolute left-0 bottom-0 -z-10 opacity-50 animate-float-reverse"
      />
    </main>
  );
}
