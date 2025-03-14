"use client";
import ProductDetailPage from "@/components/productComponents/product-details";


export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <div className="w-full bg-[#f9f9f9]">
      <ProductDetailPage params={params} />
    </div>
  );
}
