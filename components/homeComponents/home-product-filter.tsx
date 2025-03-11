"use client";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import DropDownFilter from "../drop-down-filter";

interface FilterProps {
  onFilterChange: (category: string) => void;
  isLoading: boolean;
}

export default function FilterProducts({ onFilterChange, isLoading }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap gap-3 sm:gap-6 items-center justify-center m-auto border-b border-gray-400 pb-4 sm:pb-6 px-3 sm:px-4 lg:px-8 xl:px-12">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-6 justify-center items-center w-full sm:w-auto">
        {["All items", "Women", "Men", "Kids"].map((category) => (
          <button
            key={category}
            className={`px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium transition rounded-full border border-gray-500 ${
              selectedCategory === category.toLowerCase()
                ? "bg-red-500 text-white border-red-500"
                : "text-gray-700 hover:bg-gray-300"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleCategoryChange(category.toLowerCase())}
            disabled={isLoading} 
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-full md:w-1/2 lg:w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="bg-white px-3 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full shadow-sm outline-none text-gray-700 w-full"
            disabled={isLoading}
          />
          <SearchIcon className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white cursor-pointer" />
        </div>
        <DropDownFilter />
      </div>
    </div>
  );
}
