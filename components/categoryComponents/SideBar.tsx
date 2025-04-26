"use client";

import { useCategoryFilter } from "@/context/useCategoryFilter";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

const categoryMap = {
  "/category/men": [
    "T-Shirts & Polos",
    "Hoodies & Sweaters",
    "Jackets & Coats",
    "Shorts",
    "Shirts (Casual & Formal)",
    "Shoes & Accessories",
  ],
  "/category/women": [
    "Dresses",
    "Skirts",
    "Blouses & Tops",
    "Jeans",
    "Activewear",
    "Swimwear",
  ],
  "/category/footwear": [
    "Sneakers",
    "Formal Shoes",
    "Boots",
    "Sandals & Flip-Flops",
    "Slippers",
  ],
  "/category/leather": [
    "Leather Jackets",
    "Leather Bags",
    "Leather Shoes",
    "Leather Accessories",
  ],
  "/category/workwear": [
    "Safety Boots",
    "Industrial Wear",
    "Office Formal Wear",
    "Durable Jackets",
  ],
};

// const sizes = ["XS", "S", "M", "L", "XL"];
// const brands = ["Louis Vuitton", "Hermès", "Gucci", "Chanel", "Loewe"];
// const materials = ["Linen", "Silk", "Wool", "Satin", "Cotton", "Leather"];
interface ProductListProps {
  brands: string[];
  size: (string | number)[];
  materials: string[];
  setIsLoading?: (loading: boolean) => void;
}
const SideBar = ({ brands, size, materials }: ProductListProps) => {
  const {
    selectedFilters,
    setPriceFilter,
    toggleSizeFilter,
    setBrandFilter,
    setMaterialFilter,
    clearFilters,
  } = useCategoryFilter();

  const pathname = usePathname();
  const categories = useMemo(
    () => categoryMap[pathname as keyof typeof categoryMap] || [],
    [pathname]
  );

  return (
    <div className="w-full font-sans p-4">
      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full text-sm text-white bg-red-500 px-4 py-2 rounded-full mb-4"
      >
        Clear Filters
      </button>

      {/* Category Section */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Category</h2>
        <ul className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li
                key={category}
                className="text-sm text-gray-600 hover:text-red-500 cursor-pointer"
              >
                {category}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </ul>
      </div> */}

      {/* Filters Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Filters</h2>

        {/* Price Filter */}
        {/* <div className="mb-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Price</h3>
          {["Low to High", "High to Low", "On Sale"].map((price) => (
            <button
              key={price}
              onClick={() => setPriceFilter(price)}
              className={`text-sm w-full text-left py-1 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                selectedFilters.price === "Price: " + price
                  ? "bg-red-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {price}
            </button>
          ))}
        </div> */}

        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {size.map((size) => (
              <button
                key={size}
                onClick={() => toggleSizeFilter(size)}
                className={`text-sm px-4 py-1 border rounded-full transition-all duration-200 cursor-pointer ${
                  selectedFilters.sizes.includes(size)
                    ? "bg-red-500 text-white border-red-500"
                    : "text-gray-600 border-gray-300 hover:border-red-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Brands</h3>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`text-sm w-full text-left py-1 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                  selectedFilters.brand === brand
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </ul>
        </div>

        {/* Material Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Material</h3>
          <ul className="space-y-2">
            {materials.map((material) => (
              <button
                key={material}
                onClick={() => setMaterialFilter(material)}
                className={`text-sm w-full text-left py-1 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                  selectedFilters.material === material
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {material}
              </button>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
