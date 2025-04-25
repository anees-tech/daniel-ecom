"use client";

import { notFound } from "next/navigation";
import { Filter } from "lucide-react";
import SideBar from "./SideBar";
import CategoryProducts from "./categoryProducts";
import Image from "next/image";
import categoryProducts from "@/data/categoriesData";
import HomeLink from "../home-link";
import TextField from "../text-field";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";

const allowedCategories = ["shoes", "leather", "workwear", "men", "women"];

export async function generateStaticParams() {
  return allowedCategories.map((slug) => ({ slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<CategoryProductsInterface[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [size, setSizes] = useState<(string | number)[]>([]);
  const [material, setMaterials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const items = await getProducts();

      // Map Firestore products to match ItemCardInterface
      const mappedProducts: CategoryProductsInterface[] = items
        .filter(
          (product) =>
            product.category.toLowerCase() === params.slug.toLowerCase()
        )
        .map((product) => ({
          ...product,
          id: String(product.id), // Convert number to string
          brand: product.brand || "Unknown Brand",
          material: product.material || "Unknown Material",
        }));

      const uniqueSizes: (string | number)[] = Array.from(
        new Set(
          mappedProducts
            .flatMap((product) => product.sizes || []) // flatten sizes
            .filter(Boolean) // remove undefined/null
        )
      );

      setSizes(uniqueSizes);

      const uniqueBrands = Array.from(
        new Set(mappedProducts.map((product) => product.brand).filter(Boolean))
      );

      const uniqueMaterials = Array.from(
        new Set(
          mappedProducts.map((product) => product.material).filter(Boolean)
        )
      );

      setBrands(uniqueBrands);
      setMaterials(uniqueMaterials);

      setProducts(mappedProducts);
      setIsLoading(false);
    }

    fetchProducts();
  }, []);

  if (!allowedCategories.includes(params.slug)) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col pt-0 pb-20">
      {/* Page Layout with padding to avoid overlap */}
      <div className="flex-1 py-8 mt-0 lg:mt-0 relative">
        <div className="px-2 sm:px-4 md:px-8 lg:px-12 flex flex-row gap-2 text-sm md:text-xl font-small mb-4 capitalize">
          <HomeLink />
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">Category</span>
          <span className="text-gray-400">/</span>
          <span className="text-red-500 hover:text-red-700">
            {" "}
            {params.slug}
          </span>
        </div>
        <TextField text={params.slug} />
        <Image
          src="/design.svg"
          alt="Design"
          width={200}
          height={200}
          priority
          className="absolute right-0 -z-50"
        />
        {/* Mobile Filter Toggle - Only visible on small screens */}
        <div className="md:hidden mb-4 bg-white shadow-sm md:shadow-lg rounded-xl px-2 sm:px-4 md:px-8 lg:px-12">
          <details className="rounded-lg shadow-sm">
            <summary className="list-none flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                <span className="font-medium">Filters</span>
              </div>
              <span className="text-sm text-red-500">
                {/* Show how many filters are active */}
                {(() => {
                  let count = 0;
                  if (categoryProducts.length > 0) count++; // Just to show a count for demo
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
          {/* Sidebar on the left - Hidden on mobile */}
          <aside className="hidden md:block md:w-1/4">
            <div className="p-4 rounded-lg sticky top-24">
              <SideBar brands={brands} size={size} materials={material} />
            </div>
          </aside>

          {/* Main content */}
          <main className="w-full md:w-3/4 p-5 rounded-xl">
            <CategoryProducts productsArray={products} />
          </main>
        </div>
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
