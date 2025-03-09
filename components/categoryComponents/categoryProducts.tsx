import React, { useState, useEffect } from "react";
import ItemCard from "../item-card";
import { useCategoryFilter } from "../../context/useCategoryFilter";
import { Pagination } from "../pagination";

interface Product {
  id: number;
  name: string;
  category: string;
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
  outOfStockSizes: (string | number)[];
  description: string;
  material: string;
  features: string[];
  onAddToCart?: () => void;
}

interface ProductListProps {
  productsArray: Product[];
}

function CategoryProducts({ productsArray }: ProductListProps) {
  const { selectedFilters } = useCategoryFilter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      let updatedProducts = productsArray.filter((product) => {
        if (selectedFilters.price === "On Sale" && product.discount <= 0) {
          return false;
        }

        if (
          selectedFilters.sizes.length > 0 &&
          !selectedFilters.sizes.some((size) => product.sizes.includes(size))
        ) {
          return false;
        }

        if (
          selectedFilters.brands.length > 0 &&
          !selectedFilters.brands.includes(product.brand)
        ) {
          return false;
        }

        if (
          selectedFilters.materials.length > 0 &&
          !selectedFilters.materials.includes(product.material)
        ) {
          return false;
        }

        return true;
      });

      if (selectedFilters.price === "Low to High") {
        updatedProducts = [...updatedProducts].sort(
          (a, b) => a.currentPrice - b.currentPrice
        );
      }
      if (selectedFilters.price === "High to Low") {
        updatedProducts = [...updatedProducts].sort(
          (a, b) => b.currentPrice - a.currentPrice
        );
      }

      setFilteredProducts(updatedProducts);
      setIsLoading(false);
    }, 500); // Simulating loading delay (0.5s)
  }, [selectedFilters, productsArray]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-5">
            {displayedProducts.map((product) => (
              <ItemCard key={product.id} {...product} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </>
  );
}

export default CategoryProducts;
