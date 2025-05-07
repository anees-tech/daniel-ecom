"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductDetailModal from "./productModal/product-detail-modal";

interface ProductQuickViewButtonProps {
  product: any;
  buttonText?: string;
  iconOnly?: boolean;
  className?: string;
}

export default function ProductQuickViewButton({
  product,
  buttonText = "Quick View",
  iconOnly = false,
  className = "cursor-pointer bg-gray-200 border-none p-2 md:p-3 w-auto h-auto shadow-md",
}: ProductQuickViewButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        size={iconOnly ? "icon" : "default"}
        className={className}
      >
        <Eye className="h-3 w-3 md:h-4 md:w-4 text-black-500" />
        {!iconOnly && buttonText}
      </Button>

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}
