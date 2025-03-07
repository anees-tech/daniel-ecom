"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface Review {
  id: number;
  name: string;
  text: string;
}

interface ReviewsProps {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: ReviewsProps) {
  const sliderRef = React.useRef<Slider | null>(null);

  const nextSlide = () => sliderRef.current?.slickNext();
  const prevSlide = () => sliderRef.current?.slickPrev();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="relative py-16 container mx-auto">
      <h2 className="text-4xl">Customer Reviews</h2>
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/BG-Customer-reviews.png"
          alt="Customer Reviews Background"
          fill
          className="object-contain w-full h-full"
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-evenly gap-10 px-6">
        {/* Left Side: Profile Image */}
        <div className="relative w-96 h-96 flex justify-center items-center">
          <Image
            src="/img-Customer-Reviews.png"
            alt="Customer Review Profile"
            width={550}
            height={550}
            className="object-contain"
          />
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

          {/* Navigation Arrows (Outlined) */}
          <div className="flex justify-start mt-4 space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 "
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 "
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
