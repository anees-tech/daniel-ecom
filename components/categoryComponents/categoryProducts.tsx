"use client";

import { useCategoryFilter } from "@/context/useCategoryFilter";
import { useState, useEffect } from "react";
import ItemCard from "../item-card";
import ItemCardSkeleton from "../item-card-skeleton";
import { Pagination } from "../pagination";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";
import { usePathname } from "next/navigation";

interface ProductListProps {
  productsArray: CategoryProductsInterface[];
  setIsLoading?: (loading: boolean) => void;
}

function CategoryProducts({ productsArray, setIsLoading }: ProductListProps) {
  const pathname = usePathname();
  const isSearchPage = pathname.includes("search");
  const { selectedFilters } = useCategoryFilter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredProducts, setFilteredProducts] =
    useState<CategoryProductsInterface[]>(productsArray);
  const [sortOption, setSortOption] = useState("Featured");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);
    if (setIsLoading) setIsLoading(true);

    setTimeout(() => {
      let updatedProducts = [...productsArray];

      if (selectedFilters.price === "Price: On Sale") {
        updatedProducts = updatedProducts.filter(
          (product) => product.discount > 0
        );
      }

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

      if (selectedFilters.brand) {
        const brandLower = selectedFilters.brand.toLowerCase();
        updatedProducts = updatedProducts.filter((product) =>
          product.brand.toLowerCase().includes(brandLower)
        );
      }

      if (selectedFilters.material) {
        const materialLower = selectedFilters.material.toLowerCase();
        updatedProducts = updatedProducts.filter((product) =>
          product.material.toLowerCase().includes(materialLower)
        );
      }

      if (sortOption === "Price: Low to High") {
        updatedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
      } else if (sortOption === "Price: High to Low") {
        updatedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
      }

      setFilteredProducts(updatedProducts);
      setLoading(false);
      if (setIsLoading) setIsLoading(false);
    }, 300);
  }, [selectedFilters, productsArray, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2 sm:px-4 md:px-8 lg:px-12 py-2 rounded-lg transition-all duration-300">
        <p className="text-gray-600 mb-2 sm:mb-0">
          Showing <span className="font-medium">{filteredProducts.length}</span>{" "}
          results
        </p>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer transition-all duration-200 hover:border-gray-400 focus:border-gray-500 focus:outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Featured">Featured</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[...Array(itemsPerPage)].map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="text-xl font-medium text-gray-700">
            No products found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="transition-all duration-300 hover:scale-105"
              >
                <ItemCard {...product} id={product.id.toString()} />
              </div>
            ))}
          </div>
          {!isSearchPage
            ? totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )
            : null}
        </>
      )}
    </>
  );
}

export default CategoryProducts;
