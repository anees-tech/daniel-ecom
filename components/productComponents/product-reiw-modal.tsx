"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Button from "../button";

interface ProductReviewModalProps {
  product: {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviewsCount: number;
  };
  onAddReview?: (review: {
    name: string;
    rating: number;
    comment: string;
  }) => void;
}

export default function ProductReviewModal({
  product,
  onAddReview,
}: ProductReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState<{
    name?: string;
    rating?: string;
    comment?: string;
  }>({});

  // Calculate star distribution
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; rating?: string; comment?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!comment.trim()) newErrors.comment = "Review comment is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onAddReview) {
      onAddReview({ name, rating, comment });
    }

    setName("");
    setComment("");
    setRating(0);
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button text={"Write Review"} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about {product.name} with other customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-400">
              <Image
                src={product.image || "/placeholder.svg?height=64&width=64"}
                alt={product.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="flex">
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                      key={`full-${i}`}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                  {hasHalfStar && (
                    <Star
                      key="half"
                      className="h-5 w-5 text-yellow-500 fill-yellow-500 opacity-50"
                    />
                  )}
                  {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      className="h-5 w-5 text-gray-300 fill-gray-300"
                    />
                  ))}
                </div>
                <span>({product.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">
              Your Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    i < (hoveredRating || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-sm border border-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-sm border border-gray-400"
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment}</p>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end items-center">
            <Button text={"Cancel"} />
            <Button text={"Submit Reviews"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
