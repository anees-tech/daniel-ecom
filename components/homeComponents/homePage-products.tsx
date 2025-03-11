"use client";
import { useState } from "react";
import ProductList from "./home-product-list";
import FilterProducts from "./home-product-filter";
import products from "@/data/products";
import Loader from "../loader";

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (category: string) => {
    setIsLoading(true);
    setTimeout(() => {
      // abhi yaha hum backend se data fetch nahi kar rahe hai, isliye hum setTimeout ka use kar rahe hai filhal
      if (category === "all items") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(
          products.filter((product) => product.category === category)
        );
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="p-6 px-4 lg:px-8 xl:px-12">
      <h2 className="text-2xl font-bold mb-4">What&apos;s trending now</h2>
      <p className="text-gray-500 mb-6">
        Discover the most trending products in our store.
      </p>

      <FilterProducts
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : (
          <ProductList products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
