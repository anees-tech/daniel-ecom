"use client";
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import TextBox from "../text-box";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  name: string;
  text: string;
  image?: string;
}

interface ReviewsProps {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: ReviewsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  // Function to go to next slide
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const nextIndex = (activeIndex + 1) % reviews.length;
    setActiveIndex(nextIndex);
    sliderRef.current?.slickGoTo(nextIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Function to go to previous slide
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const prevIndex = (activeIndex - 1 + reviews.length) % reviews.length;
    setActiveIndex(prevIndex);
    sliderRef.current?.slickGoTo(prevIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext(); // Move to the next slide directly
      }
    }, 3000); // Update every 3 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Sync slider with wheel
  const handleBeforeChange = (oldIndex: number, newIndex: number) => {
    setActiveIndex(newIndex);
  };

  // Calculate positions for the wheel
  const getPositionStyle = (index: number) => {
    const totalItems = reviews.length - 1; // Excluding the center item
    const angleStep = (2 * Math.PI) / totalItems;

    // If this is the active item, it should be in the center
    if (index === activeIndex) {
      return {
        transform: `translate(-50%, -50%)`,
        zIndex: 10,
        opacity: 1,
      };
    }

    // For other items, calculate position around the circle
    // Adjust the index to skip the active index
    let adjustedIndex = index;
    if (index > activeIndex) adjustedIndex -= 1;

    // Calculate position based on angle
    const radius = 180; // Radius of the wheel
    const angle = adjustedIndex * angleStep;
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;

    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.6)`,
      zIndex: 1,
      opacity: 0.8,
    };
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: handleBeforeChange,
  };

  return (
    <div className="relative py-16 pt-0">
      <TextBox text="Customer Reviews" />
      {/* Background Image */}
      <div className="absolute inset-0 -z-50">
        <Image
          src="/BG-Customer-reviews.png"
          alt="Customer Reviews Background"
          fill
          className="object-contain w-full h-full"
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-evenly gap-10 px-6 pt-10 mx-8">
        {/* Left Side: Profile Image Wheel */}
        <div className="relative w-full md:w-1/3 h-[400px] md:h-[500px] flex justify-center items-center">
          {/* Profile images wheel */}
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={cn(
                "absolute left-1/2 top-1/2 rounded-full overflow-hidden transition-all duration-500 ease-in-out",
                index === activeIndex
                  ? "border-4 border-red-500 w-32 h-32"
                  : "border-2 border-gray-200 w-24 h-24 cursor-pointer"
              )}
              style={getPositionStyle(index)}
              onClick={() => {
                if (index !== activeIndex) {
                  setActiveIndex(index);
                  sliderRef.current?.slickGoTo(index);
                }
              }}
            >
              <Image
                src={review.image || `/images/person${index + 1}.png`}
                alt={review.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority={index === activeIndex}
              />
            </div>
          ))}
        </div>

        {/* Right Side: Review Slider */}
        <div className="w-full md:w-2/3 max-w-xl text-gray-800">
          <Slider ref={sliderRef} {...settings}>
            {reviews.map((review) => (
              <div key={review.id} className="flex flex-col items-start">
                <Quote className="text-red-500 w-30 h-30 mb-2" />
                <p className="text-xl">{review.text}</p>
                <h3 className="mt-3 font-bold text-red-500 text-3xl">
                  {review.name}
                </h3>
              </div>
            ))}
          </Slider>

          {/* Navigation Arrows */}
          <div className="flex justify-start mt-4 space-x-4">
            <button onClick={prevSlide} className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={nextSlide} className="p-2">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
