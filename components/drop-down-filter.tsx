"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DropDownFilter({
  onSortChange,
}: {
  onSortChange: (filter: string) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState("");

  const filters = ["Price: Low to High", "Price: High to Low", "Best Rating"];

  return (
    <div className="flex justify-center item-center m-0">
      <div className="relative w-50">
        <select
          className="w-full appearance-none bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] 
          text-white font-semibold rounded-full py-2 px-3  text-sm shadow-md 
          focus:outline-none cursor-pointer transition-all duration-500 ease-out transform hover:shadow-xl
    hover:bg-right hover:from-[#EB1E24] hover:via-[#F05021] hover:to-[#ff3604] active:bg-right hover:from-[#EB1E24] hover:via-[#F05021] active:to-[#ff3604] flex items-center"
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            onSortChange(e.target.value);
          }}
        >
          <option value="" disabled hidden>
            Sort By
          </option>
          {filters.map((filter) => (
            <option
              key={filter}
              value={filter}
              className="text-black bg-white" // black text on white bg inside dropdown
            >
              {filter}
            </option>
          ))}
        </select>

        {/* Chevron Icon positioned inside select */}
        <div className="pointer-events-none absolute inset-y-0 bottom-0 md:bottom-5 right-5 flex items-center">
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}
