"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import CartIcon from "@/public/cart-icon.svg";
import ProfileIcon from "@/public/profile.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { AuthModal } from "./auth-modal";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    description: "Explore our latest collections and offers.",
  },
  {
    title: "Shop",
    href: "/products",
    children: [
      {
        title: "Men",
        href: "/category/men",
        description:
          "Discover stylish clothing for men, from casual to formal wear.",
      },
      {
        title: "Women",
        href: "/category/women",
        description: "Trendy and comfortable clothing designed for women.",
      },
      {
        title: "Footwear",
        href: "/category/footwear",
        description:
          "Find the perfect pair of shoes, sneakers, boots, and sandals.",
      },
      {
        title: "Leather",
        href: "/category/leather",
        description:
          "Premium leather goods including watches, bags, and accessories.",
      },
      {
        title: "Workwear",
        href: "/category/workwear",
        description: "Durable and stylish workwear for any job or occasion.",
      },
    ],
  },
  {
    title: "Service",
    href: "/services",
    description: "Learn about our customer support and repair services.",
  },
  {
    title: "About",
    href: "/about",
    description: "Get to know our story, mission, and values.",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Reach out to us for inquiries, support, or feedback.",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center py-4 gap-6 md:gap-8 w-full px-4 md:px-6 lg:px-8 transition-all duration-300 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] rounded-b-[37px] fixed top-0 left-0 right-0 z-50"
      )}
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white">
          <SheetHeader className="mb-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 py-0 px-2 ">
            <Link href="/" className="flex justify-center md:hidden">
              <div className="h-[80px] w-[80px] relative">
                <Image
                  src="/logo.png?height=150&width=150"
                  alt="logo"
                  fill
                  className="cursor-pointer object-contain"
                />
              </div>
            </Link>
            {mainNavItems.map((item) => {
              if (item.title === "Shop") {
                return (
                  <div key={item.href}>
                    <div
                      className="flex items-center justify-between py-2 text-lg font-medium cursor-pointer hover:text-gray-400"
                      onClick={() => {
                        const shopContent = document.getElementById(
                          "mobile-shop-content"
                        );
                        if (shopContent) {
                          shopContent.classList.toggle("hidden");
                        }
                      }}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </div>
                    <div
                      id="mobile-shop-content"
                      className="hidden pl-4 space-y-2 mt-1 mb-2"
                    >
                      {item.children?.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <Link
                            href={child.href}
                            className="flex items-center py-2 px-2 text-base transition-colors hover:text-primary text-muted-foreground hover:bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] hover:text-white rounded-md"
                          >
                            {child.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 text-lg font-medium transition-colors hover:text-primary hover:text-gray-400",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              );
            })}
            <Button
              variant="outline"
              className="mt-4 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] border-none hover:bg-red-400 text-white cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Login
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <Link href="/" className="hidden md:block">
        <div className="h-[70px] w-[70px] relative">
          <Image
            src="/logo.png?height=110&width=110"
            alt="logo"
            fill
            className="cursor-pointer object-contain"
          />
        </div>
      </Link>

      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {mainNavItems.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white transition-colors duration-300">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white">
                    <ul className="grid w-[400px] gap-3 p-2 md:w-[200px] md:grid-cols-2 lg:w-[400px]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="block select-none space-y-1 rounded-md p-3 md:p-0 leading-none no-underline outline-none transition-colors hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {child.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {child.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-white hover:bg-white/20 hover:text-white transition-colors duration-300"
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <button onClick={() => setIsModalOpen(true)}>
          <div className="text-sm font-medium leading-none text-white hover:bg-white/20 hover:text-white transition-colors duration-300 block select-none space-y-1 rounded-md p-3 no-underline outline-none hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 focus:bg-accent focus:text-accent-foreground">
            Login
          </div>
        </button>
      </div>

      <div
        className={cn(
          "flex-1 transition-all",
          isSearchOpen ? "flex" : "hidden md:flex"
        )}
      >
        <form className="w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full bg-white pl-8 md:w-[200px] lg:w-[350px] focus:border-orange-500 focus:ring-red-500/20 rounded-full border-none"
            />
          </div>
        </form>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-white"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        {isSearchOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle search</span>
      </Button>

      <div className="flex items-center gap-2">
        <Link className="bg-white p-3 rounded-full" href={""}>
          <ProfileIcon />
        </Link>
        <Link href="/cart">
          <div className="relative bg-white p-3 rounded-full">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </Link>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
