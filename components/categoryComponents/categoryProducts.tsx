"use client";

import { useCategoryFilter } from "@/context/useCategoryFilter";
import { useState, useEffect } from "react";
import ItemCard from "../item-card";
import { Pagination } from "../pagination";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  sku: string;
  sizes: (string | number)[];
  outOfStockSizes: (string | number)[];
  description: string;
  material: string;
  features: string[];
  onAddToCart?: () => void;
}

interface ProductListProps {
  productsArray: Product[];
}

function CategoryProducts({ productsArray }: ProductListProps) {
  const { selectedFilters } = useCategoryFilter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(productsArray);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page when filters change

    setTimeout(() => {
      let updatedProducts = [...productsArray];

      // Filter by price
      if (selectedFilters.price === "On Sale") {
        updatedProducts = updatedProducts.filter(
          (product) => product.discount > 0
        );
      }

      // Filter by sizes
      if (selectedFilters.sizes.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          selectedFilters.sizes.some(
            (size) =>
              product.sizes.includes(size) ||
              product.sizes.includes(Number(size)) ||
              product.sizes.includes(size.toString())
          )
        );
      }

      // Filter by brand (single selection)
      if (selectedFilters.brand) {
        // Make the brand filter case-insensitive and partial match
        const brandLower = selectedFilters.brand.toLowerCase();
        updatedProducts = updatedProducts.filter((product) =>
          product.brand.toLowerCase().includes(brandLower)
        );
      }

      // Filter by material (single selection)
      if (selectedFilters.material) {
        // Make the material filter case-insensitive and partial match
        const materialLower = selectedFilters.material.toLowerCase();
        updatedProducts = updatedProducts.filter((product) =>
          product.material.toLowerCase().includes(materialLower)
        );
      }

      // Sort by price
      if (selectedFilters.price === "Low To High Price") {
        updatedProducts = [...updatedProducts].sort(
          (a, b) => a.currentPrice - b.currentPrice
        );
      } else if (selectedFilters.price === "High To Low Price") {
        updatedProducts = [...updatedProducts].sort(
          (a, b) => b.currentPrice - a.currentPrice
        );
      }

      setFilteredProducts(updatedProducts);
      setIsLoading(false);
    }, 300); // Reduced loading delay
  }, [selectedFilters, productsArray]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Results count and sort options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-[#f9f9f9] px-2 sm:px-4 md:px-8 lg:px-12 py-2">
        <p className="text-gray-600 mb-2 sm:mb-0">
          Showing <span className="font-medium">{filteredProducts.length}</span>{" "}
          results
        </p>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option className="bg-[#f9f9f9]">Featured</option>
            <option className="bg-[#f9f9f9]">Newest</option>
            <option className="bg-[#f9f9f9]">Price: Low to High</option>
            <option className="bg-[#f9f9f9]">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">
                No products found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {displayedProducts.map((product) => (
                  <ItemCard key={product.id} {...product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default CategoryProducts;
