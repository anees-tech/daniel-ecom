"use client";
import CategoryPage from "@/components/categoryComponents/categoryMain";
import React, { Suspense } from "react";
import { useParams } from "next/navigation";

function Page() {
  const { categoryId } = useParams();
  console.log(categoryId);
  const slug = Array.isArray(categoryId) ? categoryId[0] : categoryId;

  setTimeout(() => {
    // You can add any additional logic here if needed
  }, 2000);
  if (!slug) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryPage params={{ slug }} />
      </Suspense>
    </div>
  );
}

export default Page;
