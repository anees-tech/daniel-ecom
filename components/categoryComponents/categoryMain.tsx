"use client";
import { Filter } from "lucide-react";
import SideBar from "./SideBar";
import CategoryProducts from "./categoryProducts";
import Image from "next/image";
import HomeLink from "../home-link";
import TextField from "../text-field";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";
import Loading from "./loading";

export default function CategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const [products, setProducts] = useState<CategoryProductsInterface[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [size, setSizes] = useState<(string | number)[]>([]);
  const [material, setMaterials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(params.slug);
    if (params.slug[1]) {
      params.slug[1] = decodeURIComponent(params.slug[1]);
    }
    if (params.slug[0]) {
      params.slug[0] = decodeURIComponent(params.slug[0]);
    }
    async function fetchProducts() {
      setIsLoading(true);
      const items = await getProducts();
      console.log(items);
      const normalize = (str: string) =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // remove all special characters
          .replace(/\s+/g, " ") // collapse multiple spaces
          .trim();

      const mappedProducts: CategoryProductsInterface[] = items
        .filter((product) => {
          const hasCategory = !!params.slug?.[0];
          const hasSubcategory = !!params.slug?.[1];

          const matchesCategory = hasCategory
            ? product.category
              ? normalize(product.category) === normalize(params.slug[0])
              : false
            : true;

          const matchesSubcategory = hasSubcategory
            ? product.subcategory
              ? normalize(product.subcategory).includes(
                  normalize(params.slug[1])
                )
              : false
            : true;

          // If only category is present, use only category filter
          // If both are present, apply both
          // If neither is present, return false (optional, based on use case)
          return hasCategory && hasSubcategory
            ? matchesCategory && matchesSubcategory
            : hasCategory
            ? matchesCategory
            : false;
        })
        .map((product) => ({
          ...product,
          id: String(product.id),
          brand: product.brand || "Unknown Brand",
          material: product.material || "Unknown Material",
        }));

      const uniqueSizes: (string | number)[] = Array.from(
        new Set(
          mappedProducts
            .flatMap((product) => product.sizes || [])
            .filter(Boolean)
        )
      );

      const uniqueBrands = Array.from(
        new Set(mappedProducts.map((product) => product.brand).filter(Boolean))
      );

      const uniqueMaterials = Array.from(
        new Set(
          mappedProducts.map((product) => product.material).filter(Boolean)
        )
      );

      setSizes(uniqueSizes);
      setBrands(uniqueBrands);
      setMaterials(uniqueMaterials);
      setProducts(mappedProducts);
      setIsLoading(false);
    }

    fetchProducts();
  }, [params.slug[0], params.slug[1]]); // Added dependency to refetch when slug changes

  return isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Page Layout with padding to avoid overlap */}
      <div className="flex-1 py-8 relative">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-row gap-2 text-md md:text-xl font-small mb-4 capitalize">
          <HomeLink />
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">Category</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-500">{params.slug[0]}</span>
          {params.slug[1] ? (
            <div className="flex gap-2">
              <span className="text-gray-400">/</span>
              <span className="text-red-500">{params.slug[1]}</span>
            </div>
          ) : null}
        </div>

        <TextField
          text={
            params.slug[1]
              ? params.slug[1][0].charAt(0).toUpperCase() +
                params.slug[1].slice(1)
              : params.slug[0][0].charAt(0).toUpperCase() +
                params.slug[0].slice(1)
          }
        />

        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute right-0 -z-50"
        />

        {products.length === 0 ? (
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
                      if (products.length > 0) count++;
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
                <CategoryProducts productsArray={products} />
              </main>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <Image
          src="/design2.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute left-0 bottom-0 -z-50"
        />
      </div>
    </div>
  );
}
