"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

// Define item types
type ItemType = "product" | "flashSaleItem";

interface ProductReviewModalProps {
  product: {
    id: string;
    name: string;
    image: string;
  };
  itemType?: ItemType; // Explicitly specify the item type
  onAddReview?: (review: {
    name: string;
    rating: number;
    comment: string;
  }) => void;
}

interface Review {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export default function ProductReviewModal({
  product,
  itemType = "product", // Default to product if not specified
  onAddReview,
}: ProductReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    rating?: string;
    comment?: string;
  }>({});

  // State for fetched reviews data
  const [productRating, setProductRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews when modal opens
  useEffect(() => {
    if (open) {
      fetchReviews();
    }
  }, [open]);

  // Function to fetch reviews and calculate rating
  const fetchReviews = async () => {
    if (!product.id) return;

    setIsLoading(true);
    try {
      // First determine which collection the item belongs to
      let collectionName = "";
      let itemExists = false;

      // Check if item exists in products collection
      const productDoc = await getDoc(doc(firestore, "products", product.id));
      if (productDoc.exists()) {
        collectionName = "products";
        itemExists = true;
      } else {
        // Check if item exists in flashSaleItems collection
        const flashSaleDoc = await getDoc(
          doc(firestore, "flashSaleItems", product.id)
        );
        if (flashSaleDoc.exists()) {
          collectionName = "flashSaleItems";
          itemExists = true;
        }
      }

      if (!itemExists) {
        console.error("Item not found in any collection");
        setIsLoading(false);
        return;
      }

      // Get the current rating and reviewsCount from the item document
      const itemDoc =
        collectionName === "products"
          ? productDoc
          : await getDoc(doc(firestore, "flashSaleItems", product.id));

      const itemData = itemDoc.data();
      if (itemData && itemData.rating !== undefined) {
        setProductRating(itemData.rating);
      }
      if (itemData && itemData.reviewsCount !== undefined) {
        setReviewsCount(itemData.reviewsCount);
      }

      // Fetch all reviews
      const reviewsCollectionRef = collection(
        firestore,
        `${collectionName}/${product.id}/reviews`
      );

      const reviewsSnapshot = await getDocs(reviewsCollectionRef);
      const fetchedReviews = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      setReviews(fetchedReviews);

      // If rating or reviewsCount wasn't in the document, calculate them from reviews
      if (
        itemData?.rating === undefined ||
        itemData?.reviewsCount === undefined
      ) {
        setReviewsCount(fetchedReviews.length);

        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce(
            (sum, review) => sum + (review.rating || 0),
            0
          );
          const avgRating = totalRating / fetchedReviews.length;
          setProductRating(avgRating);
        } else {
          setProductRating(0);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate star distribution based on fetched rating
  const fullStars = Math.floor(productRating);
  const hasHalfStar = productRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const submitReview = async (review: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // First determine which collection the item belongs to
      let collectionName = "";

      // Check if item exists in products collection
      const productDoc = await getDoc(doc(firestore, "products", product.id));
      if (productDoc.exists()) {
        collectionName = "products";
      } else {
        // Check if item exists in flashSaleItems collection
        const flashSaleDoc = await getDoc(
          doc(firestore, "flashSaleItems", product.id)
        );
        if (flashSaleDoc.exists()) {
          collectionName = "flashSaleItems";
        } else {
          throw new Error("Item not found in any collection");
        }
      }

      // Create a new review document
      const reviewData: Omit<Review, "id"> = {
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: serverTimestamp() as Timestamp,
      };

      // Add review to the appropriate subcollection
      const reviewsCollectionRef = collection(
        firestore,
        `${collectionName}/${product.id}/reviews`
      );

      await addDoc(reviewsCollectionRef, reviewData);

      // Fetch all reviews again to calculate new average rating
      const reviewsSnapshot = await getDocs(reviewsCollectionRef);
      const updatedReviews = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      // Calculate new average rating
      const totalRating = updatedReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      const newAverageRating =
        updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;
      const newReviewsCount = updatedReviews.length;

      // Update the item's rating and reviewsCount in Firestore
      const itemDocRef = doc(firestore, collectionName, product.id);
      await updateDoc(itemDocRef, {
        rating: newAverageRating,
        reviewsCount: newReviewsCount,
      });

      // Update local state
      setReviews(updatedReviews);
      setProductRating(newAverageRating);
      setReviewsCount(newReviewsCount);

      // Call the onAddReview callback if provided
      if (onAddReview) {
        onAddReview(review);
      }

      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitError("Failed to submit review. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; rating?: string; comment?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!comment.trim()) newErrors.comment = "Review comment is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await submitReview({ name, rating, comment });

    if (success) {
      setName("");
      setComment("");
      setRating(0);
      setErrors({});
      setOpen(false);
    }
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
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-sm text-gray-600">Loading reviews...</p>
          </div>
        ) : (
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
                  <span>({reviewsCount} reviews)</span>
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

            {submitError && (
              <p className="text-sm text-red-500 font-medium">{submitError}</p>
            )}

            <DialogFooter className="flex flex-row justify-end items-center gap-2">
              <Button
                text={"Cancel"}
                onClick={() => setOpen(false)}
                type="button"
              />
              <Button
                text={isSubmitting ? "Submitting..." : "Submit Review"}
                disabled={isSubmitting}
                type="submit"
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
