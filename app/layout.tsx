import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import TopBar from "@/components/TopBar";
import { Suspense } from "react";
import Loading from "./loading"; // Import global loading UI
import { UserProvider } from "@/context/userContext";
import ClearCategoriesClient from "@/components/clearCategory";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daniel's Believe We Ensure",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <UserProvider>
          <ClearCategoriesClient />
          <TopBar />
          <Navbar />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Footer />
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
