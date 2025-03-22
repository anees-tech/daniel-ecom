"use client";
import ProductDetailPage from "@/components/productComponents/product-details";


export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <div className="w-full">
      <ProductDetailPage params={params} />
    </div>
  );
}
