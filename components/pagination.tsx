"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange = () => {},
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Function to determine which page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 2; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // For many pages, show limited set with ellipsis
      if (currentPage > 3) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Pages around current
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }

      // Add ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    // Remove duplicates
    return [...new Set(pageNumbers)];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 cursor-pointer",
          currentPage <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 active:bg-gray-100"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((pageNum, i) =>
        pageNum < 0 ? (
          // Render ellipsis
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          // Render page number
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer",
              currentPage === pageNum
                ? "bg-red-500 text-white"
                : "border border-gray-300 hover:bg-gray-100 bg-white active:bg-gray-100"
            )}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 cursor-pointer",
          currentPage >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100 active:bg-gray-100"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
