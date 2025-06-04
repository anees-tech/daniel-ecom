"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchGlobalTax } from "@/lib/globalTax";

interface TaxState {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  clearTax: () => void;
  initializeTax: () => Promise<void>;
}

const TAX_EXPIRATION_TIME = 60 * 60 * 1000;

export const useTaxStore = create<TaxState>()(
  persist(
    (set, get) => ({
      taxRate: 0.1,

      setTaxRate: (rate) => {
        set({ taxRate: rate });
        setTaxExpiry();
      },

      clearTax: () => {
        set({ taxRate: 0 });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("tax_expiry");
        }
      },

      initializeTax: async () => {
        try {
          const globalTax = await fetchGlobalTax();
          console.log("Global tax fetched:", globalTax);
          set({ taxRate: globalTax || 0.1 });
        } catch (error) {
          console.error("Failed to fetch global tax:", error);
          set({ taxRate: 0.1 }); // fallback
        }
      },
    }),
    {
      name: "tax-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => sessionStorage)
          : undefined,
    }
  )
);

const setTaxExpiry = () => {
  if (typeof window !== "undefined") {
    const expiry = new Date().getTime() + TAX_EXPIRATION_TIME;
    sessionStorage.setItem("tax_expiry", expiry.toString());
  }
};

const checkTaxExpiration = () => {
  if (typeof window !== "undefined") {
    const expiry = sessionStorage.getItem("tax_expiry");
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      useTaxStore.getState().clearTax();
      return true;
    }
  }
  return false;
};

// Initialize tax when the store is created (client-side only)
if (typeof window !== "undefined") {
  const store = useTaxStore.getState();
  if (!checkTaxExpiration()) {
    store.initializeTax();
  }
}

