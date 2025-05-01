"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../../style/HeroStyle.css";
import Button from "../button";
import Carousel from "./carousel";
import Image from "next/image";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    loading: true,
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Create a query to get the latest document from the carouseltitle collection
        const q = query(
          collection(firestore, "carouseltitle"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();

          setHeroData({
            title: data.title || "",
            subtitle: data.subtitle || "" ,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setHeroData({
          title:
            "Providing a high-quality textile range for your senior centers according to your wishes.",
          subtitle: "Find the best this season 🔥",
          loading: false,
        });
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="hero-container w-full min-w-full flex justify-center items-center m-0 p-0 px-2 pt-0 md:pt-0 mb-10 md:mb-20 max-w-screen">
      <div className="hero-content w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 relative px-2 pt-40 md:pt-30 lg:pt-40 md:p-10 md:pr-20 flex flex-col justify-center items-center md:justify-start md:items-start">
          {/* Heading with Hover Effect */}
          {heroData.loading ? (
            <div className="animate-pulse h-20 w-full bg-gray-200 rounded"></div>
          ) : (
            <h1 className="text-xl text-center md:text-left md:text-4xl font-semibold bg-clip-text leading-tight bg-gradient-to-r text-transparent inline-block from-[#EB1E24] via-[#F05021] to-[#F8A51B] transition-all duration-300 hover:text-opacity-80">
              {heroData.title}
            </h1>
          )}

          {/* Subtext with Hover Effect */}
          {heroData.loading ? (
            <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded mt-3"></div>
          ) : (
            <p className="mt-3 text-md text-gray-700 transition-all duration-300 hover:text-gray-900">
              {heroData.subtitle} 🔥
            </p>
          )}

          {/* Button with Hover, Active & Shadow Effects */}
          <Link href="#products" className="mt-4 md:mt-8 inline-block">
            <Button text="Shop Now" />
          </Link>

          {/* Floating Image with Animation */}
          <Image
            src={"/compass.svg"}
            width={100}
            height={100}
            alt={"Compass"}
            className="w-12 h-12 md:w-24 md:h-24 absolute bottom-10 right-5 md:top-90 md:right-10 lg:block -z-50"
          />
        </div>

        {/* Right Side - Carousel Component */}
        <div className="w-full md:w-1/2 relative ">
          <Image
            src={"/location1.svg"}
            width={100}
            height={100}
            alt={"location"}
            className="w-12 h-12 md:w-24 md:h-24 absolute top-5 left-0 md:left-30 md:-top-60 -z-50"
          />
          <Image
            src={"/location2.svg"}
            width={50}
            height={50}
            alt={"location"}
            className="w-6 h-6 md:w-12 md:h-12 absolute right-0 top-5 md:right-20 md:-top-40 -z-50"
          />
          <Image
            src={"/cart1.svg"}
            width={150}
            height={150}
            alt={"cart"}
            className="w-40 h-40 right-0 -bottom-100 md:w-60 md:h-60 absolute md:-bottom-100"
          />
          <Image
            src={"/rectangle.svg"}
            width={120}
            height={120}
            alt={"rectangle"}
            className="w-12 h-12 -bottom-100 md:w-30 md:h-30 absolute md:-bottom-100 left-5 -z-50"
          />
          <div className="relative flex justify-center items-center top-40 right-0 md:top-10 md:right-10 xl:top-5">
            <Image
              src={"/product.svg"}
              width={420}
              height={420}
              alt={"rectangle"}
              className="w-70 h-70 md:w-90 md:h-90 lg:w-100 lg:h-100 absolute -z-50"
            />
            <div className="absolute">
              <Carousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
