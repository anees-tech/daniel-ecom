// "use client";

// import { Star, ThumbsUp, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useState } from "react";

// interface Review {
//   id: number;
//   name: string;
//   rating: number;
//   comment: string;
// }

// interface Product {
//   id: number;
//   name: string;
//   rating: number;
//   reviewsCount: number;
//   reviews: Review[];
//   // Other product properties not used in this component
//   [key: string]: any;
// }

// interface ProductReviewsProps {
//   product: Product;
// }

// export default function ProductReviews({ product }: ProductReviewsProps) {
//   const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   // Initial number of reviews to show
//   const initialReviewCount = 2;

//   // Calculate rating distribution
//   const calculateRatingDistribution = () => {
//     const distribution = [
//       { stars: 5, percentage: 0, count: 0 },
//       { stars: 4, percentage: 0, count: 0 },
//       { stars: 3, percentage: 0, count: 0 },
//       { stars: 2, percentage: 0, count: 0 },
//       { stars: 1, percentage: 0, count: 0 },
//     ];

//     if (!product?.reviews || product.reviews.length === 0) {
//       return distribution;
//     }

//     // Count reviews for each star rating
//     product.reviews.forEach((review) => {
//       const starIndex = Math.min(Math.floor(review.rating), 5) - 1;
//       if (starIndex >= 0) {
//         distribution[4 - starIndex].count++;
//       }
//     });

//     // Calculate percentages
//     const totalReviews = product.reviews.length;
//     distribution.forEach((item) => {
//       item.percentage = Math.round((item.count / totalReviews) * 100) || 0;
//     });

//     return distribution;
//   };

//   // Check if product exists
//   if (!product) {
//     return <div>No product data available</div>;
//   }

//   const ratings = calculateRatingDistribution();

//   const formatDate = () => {
//     return new Intl.DateTimeFormat("en-US", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     }).format(new Date());
//   };

//   const handleHelpfulClick = (reviewId: number) => {
//     setHelpfulReviews((prev) =>
//       prev.includes(reviewId)
//         ? prev.filter((id) => id !== reviewId)
//         : [...prev, reviewId]
//     );
//   };

//   // Star color styles - using amber-500 for golden color
//   const starFillColor = "#f59e0b"; // amber-500
//   const starEmptyColor = "#d1d5db"; // gray-300

//   // Function to render stars with half-star support
//   const renderStars = (rating: number, size: "sm" | "md" = "md") => {
//     const starSize = size === "md" ? "w-5 h-5" : "w-4 h-4";

//     return [...Array(5)].map((_, i) => {
//       // Full star
//       if (i < Math.floor(rating)) {
//         return (
//           <Star
//             key={i}
//             className={starSize}
//             fill={starFillColor}
//             stroke={starFillColor}
//           />
//         );
//       }
//       // Half star
//       else if (i < Math.ceil(rating) && !Number.isInteger(rating)) {
//         return (
//           <div key={i} className={`relative ${starSize}`}>
//             {/* Empty star background */}
//             <Star
//               className={`absolute ${starSize}`}
//               fill={starEmptyColor}
//               stroke="#9ca3af"
//             />
//             {/* Half-filled star overlay */}
//             <div className="absolute overflow-hidden" style={{ width: "50%" }}>
//               <Star
//                 className={starSize}
//                 fill={starFillColor}
//                 stroke={starFillColor}
//               />
//             </div>
//           </div>
//         );
//       }
//       // Empty star
//       else {
//         return (
//           <Star
//             key={i}
//             className={starSize}
//             fill={starEmptyColor}
//             stroke="#9ca3af"
//           />
//         );
//       }
//     });
//   };

//   // Get reviews to display based on showAllReviews state
//   const displayedReviews = showAllReviews
//     ? product.reviews
//     : product.reviews?.slice(0, initialReviewCount);

//   // Determine if we need to show the "View More" button
//   const hasMoreReviews =
//     product.reviews && product.reviews.length > initialReviewCount;

//   return (
//     <div className="w-full max-w-full mx-auto py-8">
//       <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

//       <div className="grid md:grid-cols-[1fr,2fr] gap-8 mb-8">
//         {/* Left side - Overall rating */}
//         <div className="flex flex-col items-center md:items-start">
//           <div className="text-5xl font-bold mb-2">
//             {product.rating.toFixed(1)}
//           </div>
//           <div className="flex gap-1 mb-2">
//             {renderStars(product.rating, "md")}
//           </div>
//           <div className="text-sm text-muted-foreground mb-4">
//             {product.reviewsCount} ratings
//           </div>
//         </div>

//         {/* Right side - Rating breakdown */}
//         <div className="space-y-3">
//           {ratings.map(({ stars, percentage }) => (
//             <div key={stars} className="flex items-center gap-2">
//               <div className="flex gap-1 min-w-[100px]">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="w-4 h-4"
//                     fill={i < stars ? starFillColor : starEmptyColor}
//                     stroke={i < stars ? starFillColor : "#9ca3af"}
//                   />
//                 ))}
//               </div>
//               {/* Custom progress bar with amber color */}
//               <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="absolute top-0 left-0 h-full rounded-full"
//                   style={{
//                     width: `${percentage}%`,
//                     backgroundColor: starFillColor,
//                   }}
//                 ></div>
//               </div>
//               <span className="text-sm text-muted-foreground min-w-[40px]">
//                 {percentage}%
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Separator className="my-8" />

//       {/* Individual reviews */}
//       <div className="space-y-6">
//         {displayedReviews && displayedReviews.length > 0 ? (
//           <>
//             {displayedReviews.map((review) => (
//               <Card key={review.id} className="border border-blue-100 bg-white">
//                 <CardContent className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="font-semibold mb-1">{review.name}</h3>
//                       <div className="flex gap-1 mb-2">
//                         {renderStars(review.rating, "sm")}
//                       </div>
//                     </div>
//                     <span className="text-sm text-muted-foreground">
//                       {formatDate()}
//                     </span>
//                   </div>

//                   <p className="text-muted-foreground mb-4">{review.comment}</p>

//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant={
//                         helpfulReviews.includes(review.id)
//                           ? "default"
//                           : "outline"
//                       }
//                       size="sm"
//                       onClick={() => handleHelpfulClick(review.id)}
//                       style={
//                         helpfulReviews.includes(review.id)
//                           ? {
//                               backgroundColor: starFillColor,
//                               borderColor: starFillColor,
//                             }
//                           : {}
//                       }
//                     >
//                       <ThumbsUp className="w-4 h-4 mr-2" />
//                       {helpfulReviews.includes(review.id)
//                         ? "Helpful"
//                         : "Helpful"}
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Was this review helpful?
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}

//             {/* View More button */}
//             {hasMoreReviews && (
//               <div className="flex justify-center mt-8">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowAllReviews(!showAllReviews)}
//                   className="group bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white rounded-full"
//                 >
//                   {showAllReviews ? "Show Less" : "View More Reviews"}
//                   <ChevronDown
//                     className={`ml-2 h-4 w-4 transition-transform ${
//                       showAllReviews ? "rotate-180" : ""
//                     }`}
//                   />
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-center text-muted-foreground">
//             No reviews yet. Be the first to review this product!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { Star, ThumbsUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  // Add any other fields from Firestore
}

interface Product {
  id: string;
  name: string;
  // Other product properties not used in this component
  [key: string]: any;
}

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productRating, setProductRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initial number of reviews to show
  const initialReviewCount = 2;

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

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

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = [
      { stars: 5, percentage: 0, count: 0 },
      { stars: 4, percentage: 0, count: 0 },
      { stars: 3, percentage: 0, count: 0 },
      { stars: 2, percentage: 0, count: 0 },
      { stars: 1, percentage: 0, count: 0 },
    ];

    if (!reviews || reviews.length === 0) {
      return distribution;
    }

    // Count reviews for each star rating
    reviews.forEach((review) => {
      const starIndex = Math.min(Math.floor(review.rating), 5) - 1;
      if (starIndex >= 0) {
        distribution[4 - starIndex].count++;
      }
    });

    // Calculate percentages
    const totalReviews = reviews.length;
    distribution.forEach((item) => {
      item.percentage = Math.round((item.count / totalReviews) * 100) || 0;
    });

    return distribution;
  };

  // Check if product exists
  if (!product) {
    return <div>No product data available</div>;
  }

  const ratings = calculateRatingDistribution();

  const formatDate = () => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Star color styles - using amber-500 for golden color
  const starFillColor = "#f59e0b"; // amber-500
  const starEmptyColor = "#d1d5db"; // gray-300

  // Function to render stars with half-star support
  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const starSize = size === "md" ? "w-5 h-5" : "w-4 h-4";

    return [...Array(5)].map((_, i) => {
      // Full star
      if (i < Math.floor(rating)) {
        return (
          <Star
            key={i}
            className={starSize}
            fill={starFillColor}
            stroke={starFillColor}
          />
        );
      }
      // Half star
      else if (i < Math.ceil(rating) && !Number.isInteger(rating)) {
        return (
          <div key={i} className={`relative ${starSize}`}>
            {/* Empty star background */}
            <Star
              className={`absolute ${starSize}`}
              fill={starEmptyColor}
              stroke="#9ca3af"
            />
            {/* Half-filled star overlay */}
            <div className="absolute overflow-hidden" style={{ width: "50%" }}>
              <Star
                className={starSize}
                fill={starFillColor}
                stroke={starFillColor}
              />
            </div>
          </div>
        );
      }
      // Empty star
      else {
        return (
          <Star
            key={i}
            className={starSize}
            fill={starEmptyColor}
            stroke="#9ca3af"
          />
        );
      }
    });
  };

  // Get reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews
    ? reviews
    : reviews?.slice(0, initialReviewCount);

  // Determine if we need to show the "View More" button
  const hasMoreReviews = reviews && reviews.length > initialReviewCount;

  if (isLoading) {
    return <div className="w-full text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="w-full max-w-full mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-[1fr,2fr] gap-8 mb-8">
        {/* Left side - Overall rating */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-5xl font-bold mb-2">
            {productRating.toFixed(1)}
          </div>
          <div className="flex gap-1 mb-2">
            {renderStars(productRating, "md")}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {reviewsCount} ratings
          </div>
        </div>

        {/* Right side - Rating breakdown */}
        <div className="space-y-3">
          {ratings.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-2">
              <div className="flex gap-1 min-w-[100px]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < stars ? starFillColor : starEmptyColor}
                    stroke={i < stars ? starFillColor : "#9ca3af"}
                  />
                ))}
              </div>
              {/* Custom progress bar with amber color */}
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: starFillColor,
                  }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground min-w-[40px]">
                {percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Individual reviews */}
      <div className="space-y-6">
        {displayedReviews && displayedReviews.length > 0 ? (
          <>
            {displayedReviews.map((review) => (
              <Card key={review.id} className="border border-blue-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">{review.name}</h3>
                      <div className="flex gap-1 mb-2">
                        {renderStars(review.rating, "sm")}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate()}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">{review.comment}</p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        helpfulReviews.includes(review.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleHelpfulClick(review.id)}
                      style={
                        helpfulReviews.includes(review.id)
                          ? {
                              backgroundColor: starFillColor,
                              borderColor: starFillColor,
                            }
                          : {}
                      }
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {helpfulReviews.includes(review.id)
                        ? "Helpful"
                        : "Helpful"}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Was this review helpful?
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* View More button */}
            {hasMoreReviews && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="group bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] text-white rounded-full"
                >
                  {showAllReviews ? "Show Less" : "View More Reviews"}
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${
                      showAllReviews ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
}
