"use client";
import React from "react";
import { useParams } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";

const paymentMethods: Record<
  string,
  {
    title: string;
    description: string;
    perfectMethod: string;
    steps: string[];
    img: string;
    icon: React.ReactNode;
  }
> = {
  paypal: {
    title: "PayPal Payment",
    description:
      "PayPal is a secure online payment system. Log in, confirm, and pay in a few easy steps.",
    perfectMethod:
      "Use a verified PayPal account linked to your primary bank for faster transactions and enhanced security.",
    steps: [
      "Go to PayPal and log in to your account.",
      "Confirm the payment details.",
      "Click 'Pay Now' to complete the transaction.",
    ],
    img: "/plain-card.jpg",
    icon: <ShieldCheck className="text-blue-500 w-8 h-8" />,
  },
  "via-bank": {
    title: "Credit/Debit Card Payment",
    description:
      "Use your card to pay securely. We support Visa, MasterCard, and more.",
    perfectMethod:
      "Use a card with 3D Secure enabled and keep your billing address updated for smooth processing.",
    steps: [
      "Enter your card details (Card Number, Expiry Date, CVV).",
      "Verify your details and click 'Proceed'.",
      "Complete any additional security checks (OTP, 3D Secure).",
    ],
    img: "/credit_debit.jpg",
    icon: <CreditCard className="text-green-600 w-8 h-8" />,
  },
};

function PaymentMethodPage() {
  const params = useParams();
  const methodName = Array.isArray(params.methodName)
    ? params.methodName[0]
    : params.methodName;

  if (!methodName || !paymentMethods[methodName]) {
    return (
      <div className="text-red-500 text-center mt-20 text-xl">
        Invalid Payment Method
      </div>
    );
  }

  const methodDetails = paymentMethods[methodName];

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-12 mt-10">
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-4 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">Payment Method</span>
        <span className="text-gray-400">/</span>
        <span className="text-red-500">{methodDetails.title}</span>
      </div>
      <TextField text={methodDetails.title} />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center pb-10 pt-0 gap-10 md:gap-5">
        <div className="w-full md:w-1/2">
          <img src={methodDetails.img} alt="Card Image" />
        </div>
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            {methodDetails.icon}
            <h1 className="text-3xl font-bold text-gray-800">
              {methodDetails.title}
            </h1>
          </div>
          <p className="text-gray-600 text-base mb-4">
            {methodDetails.description}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
            <h2 className="text-blue-700 font-semibold text-lg mb-1">
              Perfect Method 💡
            </h2>
            <p className="text-blue-800">{methodDetails.perfectMethod}</p>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Steps to Pay
          </h2>
          <ul className="space-y-3 text-gray-700">
            {methodDetails.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowRight className="text-indigo-500 mt-1" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodPage;
