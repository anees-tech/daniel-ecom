"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import { useRouter } from "next/navigation";
import ItemCard from "../item-card";
import { Pagination } from "../pagination";
import ItemCardSkeleton from "../item-card-skeleton";
import HomeLink from "../home-link";
import TextField from "../text-field";
import Loading from "./loading";

interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  colors: { name: string; hex?: string }[];
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
  outOfStockSizes?: (string | number)[];
  description: string;
  material: string;
  features: string[];
}

export function SearchResults({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const productsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);

        // Filter products based on search query
        const filtered = query
          ? allProducts.filter(
              (product) =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.brand.toLowerCase().includes(query.toLowerCase()) ||
                product.material.toLowerCase().includes(query.toLowerCase()) ||
                (product.features &&
                  product.features.some((feature) =>
                    feature.toLowerCase().includes(query.toLowerCase())
                  ))
            )
          : allProducts;

        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Get current page products
  const currentProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (newPage: number) => {
    router.push(`/search?query=${query}&page=${newPage}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">
          No products found matching &quot;{query}&quot;. Try a different search
          term.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-4 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">Search</span>
        <span className="text-gray-400">/</span>
        <span className="text-red-500 hover:text-red-700"> {query}</span>
      </div>
      <TextField text={query.charAt(0).toUpperCase() + query.slice(1)} />
      <p className="mb-4 text-gray-600">
        Found {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""}
      </p>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: currentProducts.length }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ItemCard key={product.id} {...product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
