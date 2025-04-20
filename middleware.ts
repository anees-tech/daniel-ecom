import { NextRequest, NextResponse } from "next/server";
import { useUser } from "@/context/userContext";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("user")?.value; // Check for auth token

  if (request.nextUrl.pathname === "/payments" && !isLoggedIn) {
    const loginUrl = new URL(request.url);
    loginUrl.pathname = "/"; // Redirect to the home page
    loginUrl.searchParams.set("toast", "not-logged-in"); // Add a query param for the toast message
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/payments/:path*"], // Apply middleware to the `/payments` route
};
