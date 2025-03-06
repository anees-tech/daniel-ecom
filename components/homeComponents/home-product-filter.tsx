"use client";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import DropDownFilter from "../drop-down-filter";

interface FilterProps {
  onFilterChange: (category: string) => void;
}

export default function FilterProducts({ onFilterChange }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    console.log(category);
    onFilterChange(category);
  };

  return (
    <div className="flex gap-6 items-center justify-between px-30 border-b border-gray-400 pb-6">
      <div className="flex flex-row gap-6 justify-center items-center">
        {["All items", "Women", "Men", "Kids"].map((category) => (
          <button
            key={category}
            className={`px-6 py-1.5 text-sm font-medium transition rounded-full border border-gray-500 ${
              selectedCategory === category.toLowerCase()
                ? "bg-red-500 text-white border-red-500"
                : "text-gray-700 hover:bg-gray-300 "
            }`}
            onClick={() => handleCategoryChange(category.toLowerCase())}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-row justify-center items-center gap-4">
        <div className="relative mx-auto w-[100%]">
          <input
            type="text"
            placeholder="Search"
            className="bg-white px-4 py-2 rounded-full shadow-sm outline-none text-gray-700 w-full"
          />
          <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
        </div>
        <DropDownFilter />
      </div>
    </div>
  );
}
