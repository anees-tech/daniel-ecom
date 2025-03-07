"use client";
import { FaWalking, FaTruck } from "react-icons/fa";
import TextBox from "../text-box";

export default function HomeServices() {
  return (
    <section className="py-12 bg-gray-100">
        <TextBox text="Services" />
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-8">
        {/* Left Side: Features */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          <h2 className="text-2xl font-bold">
            We Offer You the Best<span className="text-red-500">,</span>
          </h2>

          <div className="flex gap-6">
            {/* Personal Pick Up */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start border-t-4 border-red-400">
              <div className="flex items-center gap-2">
                <FaWalking className="text-red-500 text-2xl" />
                <span className="text-gray-300 text-2xl font-extrabold">
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
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start border-t-4 border-red-400">
              <div className="flex items-center gap-2">
                <FaTruck className="text-red-500 text-2xl" />
                <span className="text-gray-300 text-2xl font-extrabold">
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
          <img
            src="/delivery-route.png"
            alt="Delivery Route"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
