"use client";
import { useState } from "react";
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
  sizes: string[] | number[];
  outOfStockSizes: string[] | number[];
  description: string;
  material: string;
  features: string[];
  onAddToCart?: () => void;
}
interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {displayedProducts.map((product) => (
          <ItemCard
            key={product.id}
            {...product}
            onAddToCart={() => {
              alert("Added to cart");
            }}
          />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
