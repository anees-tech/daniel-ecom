"use client";

import { useState, useEffect } from "react";
import ProductList from "./home-product-list";
import FilterProducts from "./home-product-filter";
import DropDownFilter from "../drop-down-filter";
import { getProducts } from "@/lib/products";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";
import TextBox from "../text-box";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

export default function ProductsPage() {
  const [products, setProducts] = useState<CategoryProductsInterface[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    CategoryProductsInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortFilter, setSortFilter] = useState("");
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from Firestore
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const items = await getProducts();

      // Map Firestore products to match ItemCardInterface
      const mappedProducts: CategoryProductsInterface[] = items.map(
        (product) => ({
          ...product,
          id: String(product.id), // Keep id as a string
          brand: product.brand || "Unknown Brand",
          material: product.material || "Unknown Material",
        })
      );

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts); // Initialize filtered products
      setIsLoading(false);
    }

    fetchProducts();
  }, []);

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
      let updatedProducts = [...products];

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
  }, [category, searchTerm, sortFilter, products]);

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center pr-2 sm:pr-4 md:pr-8 lg:pr-12">
        <TextBox text={"Our Products"} />
        <Link
          href={"/allproducts"}
          className="text-sm text-red-500 md:text-lg flex justify-center items-center gap-2 hover:bg-red-500 active:bg-red-500 active:text-white hover:text-white px-2 py-1 rounded-lg transition-all duration-300"
        >
          View All
          <IoIosArrowForward size={20} />
        </Link>
      </div>
      <div className="p-6 px-4 lg:px-8 xl:px-12" id="products">
        <h2 className="text-2xl font-bold mb-4">What&apos;s trending now</h2>
        <p className="text-gray-500 mb-6">
          Discover the most trending products in our store.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pb-4 border-b border-gray-400">
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
    </div>
  );
}
