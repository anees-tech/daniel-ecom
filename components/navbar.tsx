"use client";

import type React from "react";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useCartStore } from "@/context/addToCartContext";
import { useUser } from "@/context/userContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { fetchCategories, type Category } from "@/lib/categories";
import { getProducts } from "@/lib/products";

const popularSearches = [
  "man shoes",
  "1 dollar items free shipping",
  "woman clothing",
  "mini drone",
  "earbuds bluetooth",
  "samsung s22 ultra",
  "clothes for ladies",
  "air pods",
  "mobile",
  "smart watch 2025",
];

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedValue, setDebouncedValue] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useUser();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce input value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // Update suggestions when debounced value changes
  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedValue) {
        const items = await getProducts();

        // Filter items where product.name includes debouncedValue (case-insensitive)
        const filteredNames = items
          .filter((product) =>
            product.name?.toLowerCase().includes(debouncedValue.toLowerCase())
          )
          .map((product) => product.name) // Only take the name
          .filter((name, index, self) => name && self.indexOf(name) === index)
          .slice(0, 10); // Take only the top 10; // Unique names

        setSuggestions(filteredNames); // Use the filtered names here
      } else {
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsOpen(false);
    // Navigate to search results page with the selected suggestion
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  const mainNavItems = [
    {
      title: "Home",
      href: "/",
      description: "Explore our latest collections and offers.",
    },
    {
      title: "Shop",
      href: "/products",
      children: categories,
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

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300); // remove animation after 300ms
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user?.email
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?query=${encodeURIComponent(inputValue.trim())}`);
      setIsOpen(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center py-4 gap-3 md:gap-3 w-full px-4 md:px-6 lg:px-8 transition-all duration-300 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] rounded-b-[37px] sticky top-0 left-0 right-0 z-50"
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
                  <div key={item.href} className="cursor-pointer">
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
                      <span className="cursor-pointer">{item.title}</span>
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </div>
                    <div
                      id="mobile-shop-content"
                      className="hidden pl-4 space-y-2 mt-1 mb-2 cursor-pointer"
                    >
                      {item.children?.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <Link
                            href={child.href}
                            className="cursor-pointer flex items-center py-2 px-2 text-base transition-colors hover:text-primary text-muted-foreground hover:bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] hover:text-white rounded-md"
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

      <div className="hidden md:flex gap-0 lg:gap-1">
        <NavigationMenu>
          <NavigationMenuList>
            {mainNavItems.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white transition-colors duration-300">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white">
                    <ul className="grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className="p-0 block select-none space-y-1 rounded-md md:p-3 leading-none no-underline outline-none transition-colors hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 focus:bg-accent focus:text-accent-foreground"
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

        {!loading &&
          (!user ? (
            <button onClick={() => setIsModalOpen(true)}>
              <div className="text-sm font-medium leading-none text-white hover:bg-white/20 hover:text-white transition-colors duration-300 block select-none space-y-1 rounded-md p-3 no-underline outline-none hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 focus:bg-accent focus:text-accent-foreground">
                Login
              </div>
            </button>
          ) : (
            <div className="flex items-center">
              <div className="text-sm font-medium text-white mr-2 hidden md:block">
                {user.displayName || user.email?.split("@")[0]}
              </div>
            </div>
          ))}
      </div>

      <div
        className={cn(
          "flex-1 transition-all",
          isSearchOpen ? "flex" : "hidden md:flex"
        )}
      >
        <form className="w-full" onSubmit={handleSearchSubmit}>
          <div className="relative w-full" ref={searchRef}>
            <div className="flex items-center rounded-full">
              <Input
                type="search"
                placeholder="Search for products..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="search bg-white pl-8 focus:border-orange-500 focus:ring-red-500/20 rounded-full border border-gray-400"
              />
              <div className="flex items-center pr-1">
                {/* <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full"
                >
                  <Camera className="h-5 w-5 text-gray-500" />
                  <span className="sr-only">Search with camera</span>
                </Button> */}
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-transparent text-red absolute right-1 cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {inputValue ? (
                  <div className="max-h-[30vh] md:max-h-[70vh] overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex gap-2">
                          <div>
                            <Search className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="overflow-hidden text-ellipsis line-clamp-1">
                            {suggestion}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="max-h-[30vh] md:max-h-[70vh] overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-3">
                        Discover more
                      </h3>
                      <div className="space-y-3">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            className="block w-full text-left hover:text-gray-600 cursor-pointer"
                            onClick={() => handleSuggestionClick(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      {/* <h3 className="text-lg font-semibold mb-3 text-blue-500">
                        Other recommendations
                      </h3> */}
                      <div className="space-y-3">
                        {/* This would be populated with actual recommendations */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-white w-auto h-auto"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        {isSearchOpen ? (
          <X className="h-5 w-4" />
        ) : (
          <Search className="h-5 w-4" />
        )}
        <span className="sr-only">Toggle search</span>
      </Button>

      <div className="flex items-center gap-2">
        {!loading &&
          (user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-white p-1.5 md:p-1.5 rounded-full cursor-pointer">
                  <Avatar className="h-6 w-6 md:h-8 md:w-8">
                    {user.photoURL ? (
                      <AvatarImage
                        src={user.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "User"}
                      />
                    ) : null}
                    <AvatarFallback className="bg-red-500 text-white text-sm md:text-md font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white p-1.5 md:p-3 rounded-full"
            >
              <ProfileIcon />
            </button>
          ))}

        <Link href="/cart">
          <div className="relative bg-white p-1.5 md:p-3 rounded-full">
            <CartIcon />
            {isClient && cartCount > 0 && (
              <span
                className={`absolute -top-0 -right-0 bg-red-600 text-white text-xs px-2 rounded-full
            transform transition-all duration-300
            ${
              animate ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
              >
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
