"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Button from "./button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ReturnItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  orderId: string;
  userId: string;
  orderCreatedAt: string; // Pass the order creation date
  onSuccess?: () => void; // Add this callback
}

export default function ReturnItemModal({
  isOpen,
  onClose,
  item,
  orderId,
  userId,
  orderCreatedAt,
  onSuccess,
}: ReturnItemModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reason.trim()) {
      setError("Please provide a reason for the return.");
      return;
    }

    setIsSubmitting(true);

    try {
      const returnsCollectionRef = collection(firestore, "returns");
      
      // Generate unique QR code data
      const qrCodeData = `RETURN-${orderId}-${item.id}-${Date.now()}`;
      
      const returnData = {
        userId: userId,
        orderId: orderId,
        orderCreatedAt: orderCreatedAt,
        itemId: item.id,
        itemName: item.name,
        itemQuantity: item.quantity,
        itemPrice: item.price,
        reason: reason.trim(),
        requestedAt: serverTimestamp(),
        status: "Pending",
        qrCode: qrCodeData,
        adminMessage: "",
      };

      console.log("Creating return request:", returnData); // Debug log
      
      await addDoc(returnsCollectionRef, returnData);

      toast.success("Return request submitted successfully.");
      setReason(""); // Clear reason

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      onClose(); // Close modal
    } catch (err) {
      console.error("Error submitting return request:", err);
      setError("Failed to submit return request. Please try again.");
      toast.error("Failed to submit return request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close/open change
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason(""); // Clear reason on close
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white">
        <DialogHeader>
          <DialogTitle>Return Item</DialogTitle>
          <DialogDescription>
            Please tell us why you want to return this item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Item Details */}
          <div className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
            <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-300 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=64&width=64"}
                alt={item.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity} | Price: ${item.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="return-reason">Reason for Return</Label>
            <Textarea
              id="return-reason"
              placeholder="e.g., Item damaged, Wrong size, Changed mind..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="search bg-white pl-4 focus:border-orange-500 focus:ring-red-500/20 rounded-md border border-gray-400"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="flex flex-row justify-end items-center gap-2 pt-2">
            <Button
              text={"Cancel"}
              onClick={onClose}
              type="button"
            />
            <Button
              text={isSubmitting ? "Submitting..." : "Submit Return"}
              type="submit"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}