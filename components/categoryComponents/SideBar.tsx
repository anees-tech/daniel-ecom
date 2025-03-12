"use client";

import { useCategoryFilter } from "@/context/useCategoryFilter";
import { useState } from "react";

const SideBar = () => {
  const {
    selectedFilters,
    setPriceFilter,
    toggleSizeFilter,
    setBrandFilter,
    setMaterialFilter,
    clearFilters,
  } = useCategoryFilter();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllMaterials, setShowAllMaterials] = useState(false);

  const categories = [
    "T-Shirts & Polos",
    "Hoodies & Sweaters",
    "Jackets & Coats",
    "Shorts",
    "Shirts (Casual & Formal)",
    "Shoes & Accessories",
  ];

  const hiddenCategories = [
    "Dresses",
    "Skirts",
    "Jeans",
    "Activewear",
    "Swimwear",
    "Underwear",
    "Sleepwear",
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  const visibleBrands = ["Louis Vuitton", "Hermès", "Gucci", "Chanel", "Loewe"];
  const hiddenBrands = [
    "LittleSteps",
    "ChicBags",
    "Elite Leather",
    "SunnyFashion",
    "CozyKids",
  ];

  const visibleMaterials = ["Linen", "Hermès", "Silk", "Wool", "Satin"];
  const hiddenMaterials = ["Cotton", "Polyester", "Leather", "Denim", "Nylon"];

  return (
    <div className="w-full font-sans">
      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="text-sm text-white bg-red-500 px-4 py-1 rounded-full"
      >
        Clear Filters
      </button>

      {/* Category Section */}
      <div className="mb-8">
        <h2 className="text-base font-medium text-gray-900 mb-3">Category</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category}
              className="text-sm text-gray-600 hover:text-red-500 cursor-pointer"
            >
              {category}
            </li>
          ))}
          {showAllCategories &&
            hiddenCategories.map((category) => (
              <li
                key={category}
                className="text-sm text-gray-600 hover:text-red-500 cursor-pointer"
              >
                {category}
              </li>
            ))}
        </ul>
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="mt-2 text-xs text-white bg-red-500 px-4 py-1 rounded-full"
        >
          View More
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-8">
        <h2 className="text-base font-medium text-gray-900 mb-3">Filters</h2>

        {/* Price Filter */}
        <div className="mb-4 space-y-2">
          <div
            onClick={() => setPriceFilter("High To Low Price")}
            className={`text-sm cursor-pointer ${
              selectedFilters.price === "High To Low Price"
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            High To Low Price
          </div>
          <div
            onClick={() => setPriceFilter("Low To High Price")}
            className={`text-sm cursor-pointer ${
              selectedFilters.price === "Low To High Price"
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            Low To High Price
          </div>
          <div
            onClick={() => setPriceFilter("On Sale")}
            className={`text-sm cursor-pointer ${
              selectedFilters.price === "On Sale"
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            On Sale
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">Size</h2>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSizeFilter(size)}
                className={`min-w-[2.5rem] text-sm px-5 py-1 border rounded-full ${
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

        {/* Brand Filter - Fixed */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Brands</h3>
          <ul className="space-y-2">
            {visibleBrands.map((brand) => (
              <li
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`text-sm cursor-pointer ${
                  selectedFilters.brand === brand
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                {brand}
              </li>
            ))}
            {showAllBrands &&
              hiddenBrands.map((brand) => (
                <li
                  key={brand}
                  onClick={() => setBrandFilter(brand)}
                  className={`text-sm cursor-pointer ${
                    selectedFilters.brand === brand
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  {brand}
                </li>
              ))}
          </ul>
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="mt-2 text-xs text-white bg-red-500 px-4 py-1 rounded-full"
          >
            View More
          </button>
        </div>

        {/* Material Filter - Fixed */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">Material</h3>
          <ul className="space-y-2">
            {visibleMaterials.map((material) => (
              <li
                key={material}
                onClick={() => setMaterialFilter(material)}
                className={`text-sm cursor-pointer ${
                  selectedFilters.material === material
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                {material}
              </li>
            ))}
            {showAllMaterials &&
              hiddenMaterials.map((material) => (
                <li
                  key={material}
                  onClick={() => setMaterialFilter(material)}
                  className={`text-sm cursor-pointer ${
                    selectedFilters.material === material
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  {material}
                </li>
              ))}
          </ul>
          <button
            onClick={() => setShowAllMaterials(!showAllMaterials)}
            className="mt-2 text-xs text-white bg-red-500 px-4 py-1 rounded-full"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
