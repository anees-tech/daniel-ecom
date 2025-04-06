"use client";
import React from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-12 rounded-t-3xl">
      <div className="max-w-full border-b-white border-b-[1px]">
        {/* Left Section - Brand */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative pl-6 md:pl-0">
          <div className="max-w-full md:max-w-xs text-center md:text-left pl-6 pr-6 md:pr-0">
            <Image
              src="/logo.png"
              alt="Brand Logo"
              width={100}
              height={100}
              className="w-30 h-25 mx-auto md:mx-0 border p-2"
            />
            <p className="mt-4 text-sm">
              &ldquo;Wear confidence, own the moment. Fashion that speaks before
              you do!&rdquo;
              <br />
              &ldquo;Style isn&apos;t just what you wear, it&apos;s how you
              express yourself. Shop your vibe today!&rdquo;
            </p>
          </div>
          {/* Middle Section - Links & Info */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/category/men" className="hover:underline">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/category/women" className="hover:underline">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-3">Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>info@danilsbelive.net</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>+92 (300) 7101235</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>30 Brooklyn Golden Street</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Right Section - Shipping & Social Media */}
          <div className="Shipping_Methods flex flex-col items-center md:items-start gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-bold text-lg mb-3">SHIPPING METHODS</h3>
              <div className="flex flex-col-reverse justify-start gap-4">
                <Image src="/DHL-photo.png" alt="DPD" width={100} height={50} />
                <Image src="/DPD-Photo.png" alt="DHL" width={80} height={30} />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="font-bold text-lg mb-2">PAYMENT METHODS</h3>
              <div className="flex flex-col-reverse justify-center md:justify-start gap-2">
                <Link
                  href="/payment-methods-details/paypal"
                  className="hover:underline"
                >
                  {" "}
                  Paypal
                </Link>

                <Link
                  href="/payment-methods-details/via-bank"
                  className="hover:underline"
                >
                  {" "}
                  Credit Card / Debit Card
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-bold text-lg mb-2">INVOICE METHODS</h3>
              <div className="flex flex-col-reverse justify-start gap-4">
                <Link href={"/invoice"} className="hover:underline">
                  Invoices
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/cart2.svg"
              alt="Cart"
              width={150}
              height={80}
              className="w-60 h-60 -z-50"
            />
          </div>
          <div className="absolute right-0 bottom-0 md:hidden pb-2">
            <Image
              src="/cart2.svg"
              alt="Cart"
              width={100}
              height={50}
              className="w-35 h-35 sm:w-45 sm:h-45 -z-50"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center md:justify-end gap-4 pr-0 md:pr-10">
          <a href="#" className="p-2 border rounded-full  bg-white">
            <Facebook className="w-6 h-6 p-1 md:w-8 md:h-8 bg-red-500 rounded-full" />
          </a>
          <a href="#" className="p-2 border rounded-full  bg-white">
            <Instagram className="w-6 h-6 p-1 md:w-8 md:h-8 bg-red-500 rounded-full" />
          </a>
          <a href="#" className="p-2 border rounded-full  bg-white">
            <Linkedin className="w-6 h-6 p-1 md:w-8 md:h-8 bg-red-500 rounded-full" />
          </a>
          <a href="#" className="p-2 border rounded-full  bg-white">
            <Twitter className="w-6 h-6 p-1 md:w-8 md:h-8 bg-red-500 rounded-full" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-sm">
        © Copyright 2025. All Rights Reserved.
      </div>
    </footer>
  );
}
