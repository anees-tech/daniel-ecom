// components/ClearCategoriesClient.tsx
"use client";

import { useEffect } from "react";
import { clearCategoriesFromLocalStorage } from "@/lib/categories";

export default function ClearCategoriesClient() {
  useEffect(() => {
    clearCategoriesFromLocalStorage();
  }, []);

  return null; // this component doesn't render anything
}
