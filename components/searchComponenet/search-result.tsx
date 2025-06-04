"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import { useRouter } from "next/navigation";
import { Pagination } from "../pagination";
import HomeLink from "../home-link";
import TextField from "../text-field";
import Loading from "./loading";
import Image from "next/image";
import { Filter } from "lucide-react";
import SideBar from "../categoryComponents/SideBar";
import CategoryProducts from "../categoryComponents/categoryProducts";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
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
  const [material, setMaterials] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [size, setSizes] = useState<(string | number)[]>([]);

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

  useEffect(() => {
    const uniqueSizes: (string | number)[] = Array.from(
      new Set(
        filteredProducts
          .flatMap((product) => product.sizes || [])
          .filter(Boolean)
      )
    );

    const uniqueBrands = Array.from(
      new Set(filteredProducts.map((product) => product.brand).filter(Boolean))
    );

    const uniqueMaterials = Array.from(
      new Set(
        filteredProducts.map((product) => product.material).filter(Boolean)
      )
    );

    setSizes(uniqueSizes);
    setBrands(uniqueBrands);
    setMaterials(uniqueMaterials);
  }, [filteredProducts]);

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
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-row gap-2 text-md md:text-xl font-small mb-4 capitalize">
        <HomeLink />
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">Search</span>
        <span className="text-gray-400">/</span>
        <span className="text-red-500 hover:text-red-700"> {query}</span>
      </div>
      <TextField text={query.charAt(0).toUpperCase() + query.slice(1)} />
      {/* <p className="mb-4 text-gray-600">
        Found {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""}
      </p> */}
      {/* {loading ? (
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
      )} */}
      {/* Page Layout with padding to avoid overlap */}
      <div className="flex-1 py-8  relative">
        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute right-0 -z-50"
        />

        {currentProducts.length === 0 ? (
          <div className="flex items-center text-gray-400 justify-center">
            No Product found for the following category!
          </div>
        ) : (
          <div>
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4 bg-white shadow-sm md:shadow-lg rounded-xl px-2 sm:px-4 md:px-8 lg:px-12">
              <details className="rounded-lg shadow-sm">
                <summary className="list-none flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    <span className="font-medium">Filters</span>
                  </div>
                  <span className="text-sm text-red-500">
                    {(() => {
                      let count = 0;
                      if (currentProducts.length > 0) count++;
                      return count > 0 ? `${count} active` : "";
                    })()}
                  </span>
                </summary>
                <div className="p-4 border-t">
                  <SideBar brands={brands} size={size} materials={material} />
                </div>
              </details>
            </div>

            <div className="flex flex-col md:flex-row gap-8 bg-white shadow-sm md:shadow-md rounded-xl">
              {/* Sidebar on Desktop */}
              <aside className="hidden md:block md:w-1/4">
                <div className="p-4 rounded-lg sticky top-24">
                  <SideBar brands={brands} size={size} materials={material} />
                </div>
              </aside>

              {/* Main Content */}
              <main className="w-full md:w-3/4 p-5 rounded-xl">
                <CategoryProducts productsArray={currentProducts} />
              </main>
            </div>
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
    </div>
  );
}
