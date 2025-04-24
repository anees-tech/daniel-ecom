"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchGlobalTax } from "@/lib/globalTax";

interface TaxState {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  clearTax: () => void;
}
const globalTax = await fetchGlobalTax();
console.log("Global tax fetcasghed:", globalTax);
const TAX_EXPIRATION_TIME = 60 * 60 * 1000;

export const useTaxStore = create<TaxState>()(
  persist(
    (set) => ({
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

const checkTaxExpiration = () => {
  if (typeof window !== "undefined") {
    const expiry = sessionStorage.getItem("tax_expiry");
    if (expiry && Date.now() > Number(expiry)) {
      useTaxStore.getState().clearTax();
    }
  }
};

const setTaxExpiry = () => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "tax_expiry",
      String(Date.now() + TAX_EXPIRATION_TIME)
    );
  }
};

// Fetch and set global tax on load
if (typeof window !== "undefined") {
  (async () => {
    const globalTax = await fetchGlobalTax();
    useTaxStore.getState().setTaxRate(globalTax);
    checkTaxExpiration();
  })();
}
