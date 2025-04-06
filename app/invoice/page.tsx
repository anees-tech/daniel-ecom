"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, DownloadCloud, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";

export default function InvoiceInfoPage() {
  const [open, setOpen] = useState(false);

  const steps = [
    "Place your order and wait for confirmation.",
    "A dialog will appear showing your order success message.",
    "Click the 'Download Invoice (PDF)' button to save your invoice.",
    "You can also download invoices later from the 'My Orders' section.",
  ];

  return (
    <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-12 mt-10">
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-4 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">Invoice Method</span>
        <span className="text-gray-400">/</span>
        <span className="text-red-500">Invoice</span>
      </div>
      <TextField text={"Invoice"} />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center pb-10 gap-10 md:gap-5">
        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/invoice.jpg"
            alt="Invoice Illustration"
            width={500}
            height={300}
          />
        </div>
        {/* Right Content */}
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="text-purple-600 w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-800">
              Download Invoice (PDF)
            </h1>
          </div>
          <p className="text-gray-600 text-base mb-4">
            After successfully placing an order on{" "}
            <strong>Daniel E-commerce Store</strong>, you’ll receive a
            confirmation screen with an option to download your invoice.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 mb-6">
            <h2 className="text-purple-700 font-semibold text-lg mb-1">
              Quick Tip 💡
            </h2>
            <p className="text-purple-800">
              Always save your invoice for future reference, returns, or
              warranty claims. You can access all your invoices from the{" "}
              <strong>My Orders</strong> section.
            </p>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            How to Get Your Invoice
          </h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowRight className="text-indigo-500 mt-1" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          {/* Example Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)} className="cursor-pointer">
                View Confirmation Dialog Example
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-none">
              <DialogHeader>
                <DialogTitle>Order Placed Successfully</DialogTitle>
                <DialogDescription>
                  Thank you for your order! You can now download your invoice
                  below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => alert("Downloading invoice...")}
                  className="bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white rounded-full border-none hover:bg-red cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Download Invoice (PDF)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
