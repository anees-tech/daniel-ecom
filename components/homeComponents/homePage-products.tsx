"use client";
import { useState, useEffect } from "react";
import ProductList from "./home-product-list";
import FilterProducts from "./home-product-filter";
import products from "@/data/products";
import DropDownFilter from "../drop-down-filter";

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [sortFilter, setSortFilter] = useState("");
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = ({
    category,
    searchTerm,
  }: {
    category: string;
    searchTerm: string;
  }) => {
    setCategory(category);
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let updatedProducts = products;

      // Apply category filter
      if (category !== "all") {
        updatedProducts = updatedProducts.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Apply search filter (match only names starting with the search term)
      if (searchTerm) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      if (sortFilter) {
        updatedProducts = [...updatedProducts].sort((a, b) => {
          if (sortFilter === "Price: Low to High")
            return a.currentPrice - b.currentPrice;
          if (sortFilter === "Price: High to Low")
            return b.currentPrice - a.currentPrice;
          if (sortFilter === "Best Rating") return b.rating - a.rating;
          return 0;
        });
      }

      setFilteredProducts(updatedProducts);
      setIsLoading(false);
    }, 500);
  }, [category, searchTerm, sortFilter]);

  return (
    <div className="p-6 px-4 lg:px-8 xl:px-12">
      <h2 className="text-2xl font-bold mb-4">What&apos;s trending now</h2>
      <p className="text-gray-500 mb-6">
        Discover the most trending products in our store.
      </p>

      <div className="flex flex-wrap gap-4 justify-center border-b border-gray-400">
        <FilterProducts
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
        <DropDownFilter onSortChange={setSortFilter} />
      </div>

      <div className="mt-6">
          <ProductList products={filteredProducts} />
      </div>
    </div>
  );
}
