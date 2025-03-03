"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] opacity-90 rounded-b-[37px] px-6 py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="logo"
              width={90}
              height={90}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white text-3xl"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul
          className={`md:flex md:items-center md:space-x-8 text-white font-medium absolute md:static md:bg-transparent top-16 left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 h-auto py-4 text-center bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B]"
              : "opacity-0 h-0 md:opacity-100 md:h-auto"
          }`}
        >
          {[
            "Men",
            "Women",
            "Shoes",
            "Leather",
            "Workwear",
            "About",
            "Contact",
          ].map((item, index) => (
            <li
              key={index}
              className="py-3 md:py-0 hover:scale-110 transition-transform"
            >
              <Link
                href={`/category/${item.toLowerCase()}`}
                className="text-lg"
              >
                {item}
              </Link>
            </li>
          ))}

          {/* Search & Icons (Visible on Mobile) */}
          <div className="flex flex-col md:hidden space-y-4 mt-4">
            <div className="relative mx-auto w-[80%]">
              <input
                type="text"
                placeholder="Search"
                className="bg-white px-4 py-2 rounded-full shadow-sm outline-none text-gray-700 w-full"
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex justify-center space-x-6">
              <FaUser className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform" />
              <div className="relative">
                <FaShoppingCart className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 rounded-full">
                  3
                </span>
              </div>
            </div>
          </div>
        </ul>

        {/* Search & Icons (Visible on Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-white px-5 py-2 rounded-full shadow-sm outline-none text-gray-700 focus:ring-2 focus:ring-orange-400"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
          </div>

          <FaUser className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform" />
          <div className="relative">
            <FaShoppingCart className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm px-2 rounded-full">
              3
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
