"use client";
import { useState, useEffect } from "react";
import ItemCard from "../item-card";
import ItemCardSkeleton from "../item-card-skeleton";
import { Pagination } from "../pagination";
import ItemCardInterface from "@/interfaces/itemCardInterface";

interface ProductListProps {
  products: ItemCardInterface[];
}

export default function ProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page when filter changes
    setTimeout(() => setIsLoading(false), 500); // Simulating loading delay
  }, [products]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayedProducts.map((product) => (
            <ItemCard key={product.id} {...product} />
          ))}
        </div>
      )}

      {totalPages > 1 && !isLoading && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
