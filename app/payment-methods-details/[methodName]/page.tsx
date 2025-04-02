"use client";
import React from "react";
import { useParams } from "next/navigation";

const paymentMethods: Record<
  string,
  { title: string; description: string; steps: string[] }
> = {
  paypal: {
    title: "PayPal Payment",
    description:
      "PayPal is a secure online payment system. To pay via PayPal, log in to your account, confirm the payment, and complete the transaction.",
    steps: [
      "Go to PayPal and log in to your account.",
      "Confirm the payment details.",
      "Click 'Pay Now' to complete the transaction.",
    ],
  },
  "via-bank": {
    title: "Credit/Debit Card Payment",
    description:
      "Use your credit or debit card to complete the transaction securely. We support Visa, MasterCard, and other major card providers.",
    steps: [
      "Enter your card details (Card Number, Expiry Date, CVV).",
      "Verify your details and click 'Proceed'.",
      "Complete any additional security checks (OTP, 3D Secure).",
    ],
  },
};

function PaymentMethodPage() {
  const params = useParams();
  const methodName = Array.isArray(params.methodName)
    ? params.methodName[0]
    : params.methodName;

  if (!methodName || !paymentMethods[methodName]) {
    return (
      <div className="text-red-500 text-center mt-10">
        Invalid Payment Method
      </div>
    );
  }

  const methodDetails = paymentMethods[methodName];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {methodDetails.title}
      </h1>
      <p className="text-gray-600">{methodDetails.description}</p>
      <h2 className="text-lg font-semibold mt-4">Steps to Pay:</h2>
      <ul className="list-disc pl-6 text-gray-700 mt-2">
        {methodDetails.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentMethodPage;
