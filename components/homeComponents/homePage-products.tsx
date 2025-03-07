"use client";
import { useState } from "react";
import ProductList from "./home-product-list";
import FilterProducts from "./home-product-filter";
import products from "@/data/products";

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilterChange = (category: string) => {
    if (category === "all items") {
      setFilteredProducts(products);
      console.log(products);
    } else {
      setFilteredProducts(
        products.filter((product) => {
          return product.category === category;
        })
      );
    }
  };

  return (
    <div className="p-6 container mx-auto">
      <h2 className="text-2xl font-bold mb-4">What's trending now</h2>
      <p className="text-gray-500 mb-6">
        Discover the most trending products in our store.
      </p>

      <FilterProducts onFilterChange={handleFilterChange} />
      <div className="mt-6">
        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
}
