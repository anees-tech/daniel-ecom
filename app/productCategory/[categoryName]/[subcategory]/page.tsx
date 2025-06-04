"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import CategoryPage from "@/components/categoryComponents/categoryMain";

function Page() {
  const params = useParams();
  const categoryName = params?.categoryName as string;
  const subcategory = params?.subcategory as string;

  if (!categoryName || !subcategory) {
    return <div>Loading...</div>;
  }

  const slug = [categoryName, subcategory];

  return (
    <div>
      <Suspense fallback={<div>Loading content...</div>}>
        <CategoryPage params={{ slug }} />
      </Suspense>
    </div>
  );
}

export default Page;
