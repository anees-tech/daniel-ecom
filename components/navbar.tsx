"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (category: string) => {
    if (openDropdown === category) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(category);
    }
  };

  const menCategories = [
    "T-Shirts",
    "Jeans",
    "Jackets",
    "Hoodies",
    "Accessories",
  ];
  const womenCategories = ["Dresses", "Tops", "Skirts", "Jeans", "Accessories"];

  return (
    <nav className="bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] opacity-90 rounded-b-[37px] px-6 py-4 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        {/* Logo - Hidden on mobile, visible on md and up */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-5">
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

        {/* Empty div for mobile to maintain layout */}
        <div className="md:hidden"></div>

        {/* Mobile Menu Toggle - Visible on mobile and md, hidden on lg */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-xl md:text-2xl ml-auto md:ml-0 p-1"
        >
          {isMenuOpen ? (
            <FaTimes className="h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <FaBars className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </button>

        {/* Navigation Links */}
        <ul
          className={`lg:flex lg:items-center lg:space-x-4 xl:space-x-6 text-white font-small xl:font-medium absolute lg:static lg:bg-transparent top-15 md:top-20  left-0 w-full lg:w-auto transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 h-auto py-4 text-center bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B]"
              : "opacity-0 h-0 lg:opacity-100 lg:h-auto"
          }`}
        >
          <li className="block md:hidden">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={90}
                height={90}
                className="cursor-pointer m-auto"
              />
            </Link>
          </li>
          {/* Navigation Items */}
          {[
            { name: "Men", dropdown: menCategories },
            { name: "Women", dropdown: womenCategories },
            { name: "Shoes", dropdown: null },
            { name: "Leather", dropdown: null },
            { name: "Workwear", dropdown: null },
            { name: "About", dropdown: null },
            { name: "Contact", dropdown: null },
          ].map((item, index) => (
            <li
              key={index}
              className="py-3 lg:py-0 transition-transform relative"
            >
              <div
                className="text-lg flex flex-row justify-center items-center gap-2 cursor-pointer"
                onClick={() => item.dropdown && toggleDropdown(item.name)}
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      openDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Dropdown Menu */}
              {item.dropdown && openDropdown === item.name && (
                <ul className="bg-white text-gray-800 rounded-lg shadow-lg mt-2 py-2 absolute left-0 lg:left-auto w-full lg:w-48 z-20">
                  {item.dropdown.map((subItem, subIndex) => (
                    <li key={subIndex} className="px-4 py-2 hover:bg-gray-100">
                      <Link
                        href={`/category/${item.name.toLowerCase()}/${subItem.toLowerCase()}`}
                        className="block"
                      >
                        {subItem}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Search & Icons (Visible on Mobile) */}
          <div className="flex flex-col lg:hidden space-y-4 mt-2">
            <div className="relative mx-auto w-[80%]">
              <input
                type="text"
                placeholder="Search"
                className="bg-white px-4 py-2 rounded-full shadow-sm outline-none text-gray-700 w-full"
              />
              <Image
                src="/search.svg"
                alt="logo"
                width={90}
                height={90}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer h-5 w-5"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <Image
                  src="/profile.svg"
                  alt="profile"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </div>
              <div className="relative bg-white p-3 rounded-full">
                <Image
                  src="/cart-icon.svg"
                  alt="profile"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
                <span className="absolute -top-0 -right-0 bg-red-600 text-white text-sm px-2 rounded-full">
                  3
                </span>
              </div>
            </div>
          </div>
        </ul>

        {/* Search & Icons (Visible on Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-white px-5 py-2 rounded-full shadow-sm outline-none text-gray-700 focus:ring-2 focus:ring-orange-400 w-full"
            />
            <Image
              src="/search.svg"
              alt="logo"
              width={90}
              height={90}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer h-5 w-5"
            />
          </div>
          <div className="bg-white p-3 rounded-full">
            <Image
              src="/profile.svg"
              alt="profile"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </div>
          <div className="relative bg-white p-3 rounded-full">
            <Image
              src="/cart-icon.svg"
              alt="profile"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <span className="absolute -top-0 -right-0 bg-red-600 text-white text-sm px-2 rounded-full">
              3
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
