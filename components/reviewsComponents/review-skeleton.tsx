import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductReviewsSkeleton() {
  return (
    <div className="w-full max-w-full mx-auto py-8 animate-pulse">
      <h2 className="text-2xl font-semibold mb-6 bg-gray-300 h-6 w-48 rounded"></h2>

      <div className="grid md:grid-cols-[1fr,2fr] gap-8 mb-8">
        {/* Left side - Overall rating */}
        <div className="flex flex-col items-center md:items-start">
          <div className="bg-gray-300 h-12 w-24 rounded mb-2"></div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-gray-300" />
            ))}
          </div>
          <div className="bg-gray-300 h-4 w-24 rounded mb-4"></div>
        </div>

        {/* Right side - Rating breakdown */}
        <div className="space-y-3 w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 w-full">
              <div className="flex gap-1 min-w-[100px]">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <div className="bg-gray-300 h-2 w-full rounded-full"></div>
              <span className="bg-gray-300 h-4 w-8 rounded"></span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* <div className="space-y-6">
        {[...Array(0)].map((_, i) => (
          <Card key={i} className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="bg-gray-300 h-6 w-32 rounded mb-2"></div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <div className="bg-gray-300 h-4 w-20 rounded"></div>
              </div>

              <div className="bg-gray-300 h-20 w-full rounded mb-4"></div>

              <div className="flex items-center gap-2">
                <Button
                  disabled
                  variant="outline"
                  className="bg-gray-300 h-8 w-24 rounded"
                />
                <div className="bg-gray-300 h-4 w-32 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center mt-8">
          <Button
            disabled
            variant="outline"
            className="bg-gray-300 h-10 w-40 rounded"
          ></Button>
        </div>
      </div> */}
    </div>
  );
}
