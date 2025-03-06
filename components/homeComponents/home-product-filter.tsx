"use client";
import { useState } from "react";

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
    <div className="flex gap-3 items-center">
      {["All items", "Women", "Men", "Kids"].map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            selectedCategory === category.toLowerCase()
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange(category.toLowerCase())}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
