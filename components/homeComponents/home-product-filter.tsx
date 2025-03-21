"use client";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: { category: string; searchTerm: string }) => void;
  isLoading: boolean;
}

export default function FilterProducts({
  onFilterChange,
  isLoading,
}: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        setDebouncedSearch(searchTerm);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    onFilterChange({ category: selectedCategory, searchTerm: debouncedSearch });
  }, [selectedCategory, debouncedSearch]);

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center pb-4 px-3">
      {["All", "Women", "Men", "Kids"].map((category) => (
        <button
          key={category}
          className={`px-4 py-2 text-sm font-medium rounded-full border ${
            selectedCategory === category.toLowerCase()
              ? "bg-red-500 text-white"
              : "text-gray-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setSelectedCategory(category.toLowerCase())}
          disabled={isLoading}
        >
          {category}
        </button>
      ))}

      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search for products..."
          className="px-4 pr-10 py-2 text-sm rounded-full border border-gray-300 w-full focus:border-red-500 bg-white focus:ring-red-500/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}
