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
    <div className="flex justify-center m-0">
      <div className="h-1/2 flex justify-between items-center px-5 text-left bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white rounded-full py-4">
        <select
          className="pr-5 text-sm appearance-none bg-transparent focus:outline-none"
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            onSortChange(e.target.value);
          }}
        >
          <option value="" className="text-black px-5 mx-5 w-full">
            Sort By
          </option>
          {filters.map((filter) => (
            <option
              key={filter}
              value={filter}
              className="text-black p-0 mx-10 w-full"
            >
              {filter}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </div>
    </div>
  );
}
