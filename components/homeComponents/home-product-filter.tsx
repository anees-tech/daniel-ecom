"use client";
import { SearchIcon, ArrowRight, Search } from "lucide-react";
import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { getProducts } from "@/lib/products";

// Mock data for suggestions
const popularSearches = [
  "shoes",
  "dresses",
  "jackets",
  "jeans",
  "t-shirts",
  "accessories",
  "sneakers",
  "watches",
  "bags",
  "sunglasses",
];

const mockSuggestions = (query: string) => {
  if (!query) return [];

  // Generate mock suggestions based on the query
  return popularSearches
    .filter((item) => item.includes(query.toLowerCase()))
    .concat([
      `${query} casual`,
      `${query} formal`,
      `${query} summer`,
      `${query} winter`,
      `${query} sale`,
    ])
    .slice(0, 6); // Limit to 6 suggestions
};

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
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== searchTerm) {
        setDebouncedSearch(searchTerm);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearch]);

  // Update suggestions when search term changes
  useEffect(() => {
    async function fetchSuggestions() {
      if (searchTerm) {
        const items = await getProducts();

        // Filter items where product.name includes debouncedValue (case-insensitive)
        const filteredNames = items
          .filter((product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => product.name) // Only take the name
          .filter((name, index, self) => name && self.indexOf(name) === index)
          .slice(0, 10); // Take only the top 10; // Unique names

        setSuggestions(filteredNames); // Use the filtered names here
      } else {
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [searchTerm]);

  // Apply filters when category or debounced search changes
  useEffect(() => {
    onFilterChange({ category: selectedCategory, searchTerm: debouncedSearch });
  }, [selectedCategory, debouncedSearch, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setDebouncedSearch(suggestion);
    setIsOpen(false);
    onFilterChange({ category: selectedCategory, searchTerm: suggestion });
  };

  const handleInputFocus = () => {
    if (searchTerm) {
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center pb-4 px-3">
      {["All", "Women", "Men", "Kids"].map((category) => (
        <button
          key={category}
          className={`px-4 py-2 text-sm font-medium rounded-full border cursor-pointer ${
            selectedCategory === category.toLowerCase()
              ? "bg-red-500 text-white "
              : "text-gray-700 hover:bg-orange-600 hover:text-white transition-all duration-300"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => setSelectedCategory(category.toLowerCase())}
          disabled={isLoading}
        >
          {category}
        </button>
      ))}

      <div className="relative w-full sm:w-64" ref={searchRef}>
        <input
          type="text"
          placeholder="Search for products..."
          className="px-2 pr-8 py-2 text-sm search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 rounded-full bg-transparent text-red absolute right-0 top-0 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <SearchIcon className="h-3 w-3 text-gray-500" />
                    <span>{suggestion}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
