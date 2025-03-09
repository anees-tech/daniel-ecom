import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Allowed category routes
  const allowedCategories = ["shoes", "leather", "workwear"];

  // Check if the route is `/category/[slug]` and if the slug is not allowed
  if (pathname.startsWith("/category/")) {
    const slug = pathname.split("/")[2]; // Get the category slug
    if (!allowedCategories.includes(slug)) {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }
  }

  return NextResponse.next(); // Allow other routes
}

// Apply middleware only to category routes
export const config = {
  matcher: "/category/:path*",
};
