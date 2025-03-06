import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Define the props interface
interface FilterDropdownProps {
  filters: string[];
  selectedFilter: string;
  onSelect: (filter: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  selectedFilter,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center space-x-4 w-auto px-8 gap-3 py-2 text-sm font-medium bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] focus:outline-none rounded-full text-white"
      >
        {selectedFilter || "Filters"}
        <div className="flex justify-between gap-3 pr-3">
          <Image src="/filter.svg" alt="DropDown" width={70} height={70} />
          <Image src="/dropdown.svg" alt="DropDown" width={20} height={20} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="py-1">
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  onClick={() => {
                    onSelect(filter);
                    setIsOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200"
                >
                  {filter}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Example Usage
export default function DropDownFilter() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const filters: string[] = [
    "Price: Low to High",
    "Price: High to Low",
    "Best Rating",
    "Newest",
  ];

  return (
    <div className="flex justify-center">
      <FilterDropdown
        filters={filters}
        selectedFilter={selectedFilter}
        onSelect={(filter) => setSelectedFilter(filter)}
      />
    </div>
  );
}
