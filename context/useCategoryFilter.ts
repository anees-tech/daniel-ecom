import { create } from "zustand";

interface CategoryFilterState {
  selectedFilters: {
    price: string | null;
    sizes: string[];
    brands: string[];
    materials: string[];
  };
  setPriceFilter: (price: string | null) => void;
  toggleSizeFilter: (size: string) => void;
  toggleBrandFilter: (brand: string) => void;
  toggleMaterialFilter: (material: string) => void;
  clearFilters: () => void;
}

export const useCategoryFilter = create<CategoryFilterState>((set) => ({
  selectedFilters: {
    price: null,
    sizes: [],
    brands: [],
    materials: [],
  },
  setPriceFilter: (price) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, price },
    })),
  toggleSizeFilter: (size) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        sizes: state.selectedFilters.sizes.includes(size)
          ? state.selectedFilters.sizes.filter((s) => s !== size)
          : [...state.selectedFilters.sizes, size],
      },
    })),
  toggleBrandFilter: (brand) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        brands: state.selectedFilters.brands.includes(brand)
          ? state.selectedFilters.brands.filter((b) => b !== brand)
          : [...state.selectedFilters.brands, brand],
      },
    })),
  toggleMaterialFilter: (material) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        materials: state.selectedFilters.materials.includes(material)
          ? state.selectedFilters.materials.filter((m) => m !== material)
          : [...state.selectedFilters.materials, material],
      },
    })),
  clearFilters: () =>
    set({
      selectedFilters: { price: null, sizes: [], brands: [], materials: [] },
    }),
}));
