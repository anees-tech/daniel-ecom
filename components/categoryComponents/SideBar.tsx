import React from "react";
import { useCategoryFilter } from "../../context/useCategoryFilter";

const SideBar = () => {
  const {
    selectedFilters,
    setPriceFilter,
    toggleSizeFilter,
    toggleBrandFilter,
    toggleMaterialFilter,
    clearFilters,
  } = useCategoryFilter();

  const sizes = ["XS", "S", "M", "L", "XL"];
  const brands = ["LittleSteps", "Hermes", "Chanel", "ChicBags", "Loewe"];
  const materials = ["Linen", "Silk", "Wool", "Satin"];

  return (
    <div className="w-64 bg-white p-4 border rounded-lg shadow-md">
      <h2 className="font-semibold text-lg">Filters</h2>

      {/* Price Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Price</h3>
        <div className="space-y-1">
          {["Low to High", "High to Low", "On Sale"].map((price) => (
            <label key={price} className="flex items-center space-x-2">
              <input
                type="radio"
                name="price"
                value={price}
                checked={selectedFilters.price === price}
                onChange={() => setPriceFilter(price)}
              />
              <span>{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSizeFilter(size)}
              className={`px-3 py-1 border rounded-md ${
                selectedFilters.sizes.includes(size)
                  ? "bg-red-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Brands</h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.brands.includes(brand)}
                onChange={() => toggleBrandFilter(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div className="mt-4">
        <h3 className="font-semibold">Material</h3>
        <div className="space-y-1">
          {materials.map((material) => (
            <label key={material} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.materials.includes(material)}
                onChange={() => toggleMaterialFilter(material)}
              />
              <span>{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SideBar;
