"use client";
import TextBox from "../text-box";
import Image from "next/image";

export default function HomeServices() {
  return (
    <section className="py-12 mx-auto">
      <TextBox text="Services" />
      <h2 className="text-2xl font-bold px-2 sm:px-4 md:px-8 lg:px-12 py-2">
        We Offer You the Best<span className="text-red-500">,</span>
      </h2>
      <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-4 md:gap-8 py-2 md:py-0">
        {/* Left Side: Features */}
        <div className="flex flex-col gap-3 sm:gap-5 md:gap-6 lg:w-1/2">
          <div className="flex gap-3 sm:gap-5 md:gap-6">
            {/* Personal Pick Up */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start">
              <div className="flex flex-row items-center justify-between gap-2 w-full">
                <Image
                  src={"/person.svg"}
                  width={50} // Increased for iPad
                  height={50}
                  alt={"person"}
                />
                <span className="text-gray-300 text-5xl font-extrabold">
                  01
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-2">Personal Pick up</h3>
              <p className="text-gray-600 text-sm mt-1">
                If you're located in the city, you have the convenient option to
                personally collect your order from our office.
              </p>
            </div>

            {/* Free Delivery */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start">
              <div className="flex flex-row items-center justify-between gap-2 w-full">
                <Image
                  src={"/bus.svg"}
                  width={50} // Increased for iPad
                  height={50}
                  alt={"bus"}
                />
                <span className="text-gray-300 text-5xl font-extrabold">
                  02
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-2">Free Delivery</h3>
              <p className="text-gray-600 text-sm mt-1">
                When you place an order above $300, you'll receive our premium
                delivery service absolutely free.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="lg:w-1/2">
          <Image
            src={"/route.svg"}
            width={100} // Increased for iPad
            height={100}
            alt={"route"}
            className="w-full shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
