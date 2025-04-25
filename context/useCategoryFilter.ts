"use client";

import { create } from "zustand";

interface CategoryFilterState {
  selectedFilters: {
    price: string | null;
    sizes: (string | number)[];
    brand: string | null;
    material: string | null;
  };
  setPriceFilter: (price: string | null) => void;
  toggleSizeFilter: (size: string | number) => void;
  setBrandFilter: (brand: string | null) => void;
  setMaterialFilter: (material: string | null) => void;
  clearFilters: () => void;
}

export const useCategoryFilter = create<CategoryFilterState>((set) => ({
  selectedFilters: {
    price: null,
    sizes: [],
    brand: null, // Start with no brand filter
    material: null, // Start with no material filter
  },
  setPriceFilter: (price) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        price: state.selectedFilters.price === price ? null : price,
      },
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

  setBrandFilter: (brand) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        brand: state.selectedFilters.brand === brand ? null : brand,
      },
    })),
  setMaterialFilter: (material) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        material: state.selectedFilters.material === material ? null : material,
      },
    })),
  clearFilters: () =>
    set({
      selectedFilters: {
        price: null,
        sizes: [],
        brand: null,
        material: null,
      },
    }),
}));
