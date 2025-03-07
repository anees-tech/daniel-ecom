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
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-10 rounded-t-3xl">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        {/* Left Section - Brand */}
        <div className="max-w-xs text-center md:text-left">
          <Image
            src="/logo.png"
            alt="Brand Logo"
            width={100}
            height={100}
            className="mx-auto md:mx-0 border border-blue-400 p-2"
          />
          <p className="mt-4 text-sm">
            "Wear confidence, own the moment. Fashion that speaks before you
            do!" "Style isn't just what you wear, it's how you express yourself.
            Shop your vibe today!"
          </p>
        </div>

        {/* Middle Section - Links & Info */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Men
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Women
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
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
        <div className="text-center md:text-right">
          <h3 className="font-bold text-lg mb-3">SHIPPING METHODS</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <Image src="/dpd.png" alt="DPD" width={60} height={30} />
            <Image src="/dhl.png" alt="DHL" width={80} height={30} />
          </div>

          <div className="mt-6 flex justify-center md:justify-start gap-4">
            <a
              href="#"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-red-500"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-red-500"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 border border-white rounded-full hover:bg-white hover:text-red-500"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-sm">
        © Copyright 2025. All Rights Reserved.
      </div>
    </footer>
  );
}
