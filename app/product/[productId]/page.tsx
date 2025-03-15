"use client";
import ProductDetailPage from "@/components/productComponents/product-details";

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  console.log(params); // Debugging - ensure productId is correct
  return (
    <div className="w-full bg-[#f9f9f9]">
      <ProductDetailPage params={params} />
    </div>
  );
}
