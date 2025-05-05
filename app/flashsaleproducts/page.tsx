"use client";
import { Filter } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFlashProducts} from "@/lib/products";
import CategoryProductsInterface from "@/interfaces/categoriesInterface";
import Loading from "@/components/categoryComponents/loading";
import HomeLink from "@/components/home-link";
import TextField from "@/components/text-field";
import SideBar from "@/components/categoryComponents/SideBar";
import CategoryProducts from "@/components/categoryComponents/categoryProducts";

export default function FlashSalePage() {
  const [products, setProducts] = useState<CategoryProductsInterface[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [size, setSizes] = useState<(string | number)[]>([]);
  const [material, setMaterials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const items = await getFlashProducts();

      const mappedProducts: CategoryProductsInterface[] = items.map(
        (product: any) => ({
          ...product,
          id: String(product.id),
          brand: product.brand ?? "Unknown Brand",
          material: product.material ?? "Unknown Material",
        })
      );

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
  }, []); // Added dependency to refetch when slug changes

  return isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Page Layout with padding to avoid overlap */}
      <div className="flex-1 py-8  relative">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 flex flex-row gap-2 text-md md:text-xl font-small mb-4 capitalize">
          <HomeLink />
          <span className="text-gray-400">/</span>
          <span className="text-red-500 hover:text-red-700 active:text-red-700">Flash Sale</span>
        </div>

        <TextField text={"Flash Sale"} />

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
