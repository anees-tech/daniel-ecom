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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpandedCategories, setMobileExpandedCategories] = useState<
    Set<string>
  >(new Set());
  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

        const filteredNames = items
          .filter((product) =>
            product.name?.toLowerCase().includes(debouncedValue.toLowerCase())
          )
          .map((product) => product.name)
          .filter((name, index, self) => name && self.indexOf(name) === index)
          .slice(0, 10);

        setSuggestions(filteredNames);
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
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  // Mobile category toggle
  const toggleMobileCategory = (categoryTitle: string) => {
    const newExpanded = new Set(mobileExpandedCategories);
    if (newExpanded.has(categoryTitle)) {
      newExpanded.delete(categoryTitle);
    } else {
      newExpanded.add(categoryTitle);
    }
    setMobileExpandedCategories(newExpanded);
  };

  // Desktop hover handlers
  const handleCategoryHover = (categoryTitle: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCategory(categoryTitle);
  };

  const handleCategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  const handleSubcategoryHover = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N} \t-]/gu, "");
  };

  const handleSubcategoryClick = (
    categoryTitle: string,
    subcategory: string | any
  ) => {
    const categorySlug = createSlug(categoryTitle);
    const subcategorySlug = createSlug(
      typeof subcategory === "string"
        ? subcategory
        : subcategory.title || subcategory
    );

    router.push(`/productCategory/${categorySlug}/${subcategorySlug}`);
    setHoveredCategory(null);
  };

  const handleCategoryNavigation = (
    categoryTitle: string,
    categoryHref?: string
  ) => {
    if (categoryHref) {
      router.push(categoryHref);
    } else {
      const categorySlug = createSlug(categoryTitle);
      router.push(`/category/${categorySlug}`);
    }
    setHoveredCategory(null);
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
      const timer = setTimeout(() => setAnimate(false), 300);
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
        <SheetContent side="left" className="bg-white w-[350px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto">
            <nav className="py-4">
              {/* Mobile Logo */}
              <div className="px-6 mb-6">
                <Link href="/" className="flex justify-center">
                  <div className="h-[80px] w-[80px] relative">
                    <Image
                      src="/logo.png?height=150&width=150"
                      alt="logo"
                      fill
                      className="cursor-pointer object-contain"
                    />
                  </div>
                </Link>
              </div>

              {/* Mobile Navigation Items */}
              {mainNavItems.map((item) => {
                if (item.title === "Shop") {
                  return (
                    <div key={`mobile-${item.title}`} className="border-b">
                      <div
                        className="flex items-center justify-between px-6 py-4 text-lg font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleMobileCategory(item.title)}
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            mobileExpandedCategories.has(item.title)
                              ? "rotate-180"
                              : ""
                          )}
                        />
                      </div>

                      {/* Mobile Categories Dropdown */}
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300",
                          mobileExpandedCategories.has(item.title)
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="bg-gray-50 max-h-[400px] overflow-y-auto">
                          {item.children?.map((category) => (
                            <div
                              key={`mobile-category-${
                                category.id || category.title
                              }`}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              {/* Category Header */}
                              <div className="flex items-center">
                                <SheetClose asChild>
                                  <button
                                    onClick={() =>
                                      handleCategoryNavigation(
                                        category.title,
                                        category.href
                                      )
                                    }
                                    className="flex-1 text-left px-6 py-3 font-medium hover:bg-white transition-colors"
                                  >
                                    {category.title}
                                  </button>
                                </SheetClose>
                                {category.subcategories &&
                                  category.subcategories.length > 0 && (
                                    <button
                                      onClick={() =>
                                        toggleMobileCategory(category.title)
                                      }
                                      className="p-3 hover:bg-white transition-colors"
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 transition-transform duration-200",
                                          mobileExpandedCategories.has(
                                            category.title
                                          )
                                            ? "rotate-180"
                                            : ""
                                        )}
                                      />
                                    </button>
                                  )}
                              </div>

                              {/* Mobile Subcategories */}
                              {category.subcategories &&
                                category.subcategories.length > 0 && (
                                  <div
                                    className={cn(
                                      "overflow-hidden transition-all duration-200",
                                      mobileExpandedCategories.has(
                                        category.title
                                      )
                                        ? "max-h-[300px] opacity-100"
                                        : "max-h-0 opacity-0"
                                    )}
                                  >
                                    <div className="bg-white max-h-[250px] overflow-y-auto">
                                      {category.subcategories.map(
                                        (subcategory, subIndex) => (
                                          <SheetClose
                                            asChild
                                            key={`mobile-subcategory-${category.id}-${subIndex}`}
                                          >
                                            <button
                                              onClick={() =>
                                                handleSubcategoryClick(
                                                  category.title,
                                                  subcategory
                                                )
                                              }
                                              className="block w-full text-left px-12 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-600 transition-colors border-l-2 border-transparent hover:border-red-300"
                                            >
                                              {subcategory.title}
                                            </button>
                                          </SheetClose>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <SheetClose asChild key={`mobile-nav-${item.title}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-6 py-4 text-lg font-medium transition-colors hover:bg-gray-50 border-b",
                        pathname === item.href
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700"
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                );
              })}

              {/* Mobile Login Button */}
              <div className="px-6 pt-6">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] border-none hover:opacity-90 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Login
                </Button>
              </div>
            </nav>
          </div>
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
                <NavigationMenuItem key={`desktop-${item.title}`}>
                  <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white transition-colors duration-300">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white shadow-2xl border-0">
                    <div className="w-[1000px] min-h-[500px] flex">
                      {/* Categories Sidebar */}
                      <div className="w-80 bg-gray-50 border-r border-gray-200">
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-300 pb-2">
                            Categories
                          </h3>
                          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <ul className="space-y-1">
                              {item.children.map((category) => (
                                <li
                                  key={`desktop-category-${
                                    category.id || category.title
                                  }`}
                                  onMouseEnter={() =>
                                    handleCategoryHover(category.title)
                                  }
                                  onMouseLeave={handleCategoryLeave}
                                >
                                  <div
                                    className={cn(
                                      "group relative flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer",
                                      hoveredCategory === category.title
                                        ? "bg-gradient-to-r from-red-500/15 to-orange-500/15 shadow-sm"
                                        : "hover:bg-white hover:shadow-sm"
                                    )}
                                    onClick={() =>
                                      handleCategoryNavigation(
                                        category.title,
                                        category.href
                                      )
                                    }
                                  >
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                                        {category.title}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                        {category.description ||
                                          "Browse all products"}
                                      </p>
                                    </div>
                                    {category.subcategories &&
                                      category.subcategories.length > 0 && (
                                        <div className="flex items-center space-x-1">
                                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                            {category.subcategories.length}
                                          </span>
                                          <ArrowRight
                                            className={cn(
                                              "h-4 w-4 text-gray-400 transition-all duration-200",
                                              hoveredCategory === category.title
                                                ? "text-red-500 translate-x-1"
                                                : ""
                                            )}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Subcategories Panel */}
                      <div
                        className="flex-1 bg-white"
                        onMouseEnter={handleSubcategoryHover}
                        onMouseLeave={handleCategoryLeave}
                      >
                        <div className="p-6">
                          {hoveredCategory ? (
                            <>
                              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                                <h3 className="text-xl font-bold text-gray-800">
                                  {hoveredCategory}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {item.children.find(
                                      (cat) => cat.title === hoveredCategory
                                    )?.subcategories?.length || 0}{" "}
                                    subcategories
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleCategoryNavigation(hoveredCategory)
                                    }
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    View All
                                  </Button>
                                </div>
                              </div>
                              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                  {item.children
                                    .find(
                                      (cat) => cat.title === hoveredCategory
                                    )
                                    ?.subcategories?.map(
                                      (subcategory, subIndex) => (
                                        <button
                                          key={`desktop-subcategory-${hoveredCategory}-${subIndex}`}
                                          onClick={() =>
                                            handleSubcategoryClick(
                                              hoveredCategory,
                                              subcategory
                                            )
                                          }
                                          className="group p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200 text-left bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-800 group-hover:text-red-600 transition-colors">
                                                {subcategory.title}
                                              </div>
                                              <div className="text-xs text-gray-500 mt-1">
                                                Explore{" "}
                                                {subcategory.title.toLowerCase()}
                                              </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-red-500 transition-all duration-200 transform group-hover:translate-x-1" />
                                          </div>
                                        </button>
                                      )
                                    ) || (
                                    <div className="col-span-2 text-center py-8">
                                      <div className="text-gray-400 mb-2">
                                        <Search className="h-12 w-12 mx-auto" />
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        No subcategories available for{" "}
                                        {hoveredCategory}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <div className="mb-6">
                                <div className="relative">
                                  <div className="h-24 w-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <ArrowRight className="h-8 w-8 text-red-400" />
                                  </div>
                                </div>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                Discover Our Categories
                              </h4>
                              <p className="text-sm text-gray-500 max-w-sm">
                                Hover over a category on the left to explore its
                                subcategories and find exactly what you're
                                looking for.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={`desktop-nav-${item.title}`}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-white hover:bg-white/20 hover:text-white transition-colors duration-300"
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
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
            <div className="hidden">
              {/* <div className="text-sm font-medium text-white mr-2 hidden md:block">
                {user.displayName || user.email?.split("@")[0]}
              </div> */}
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
                        key={`suggestion-${index}`}
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
                        <div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
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
                            key={`popular-${index}`}
                            className="block w-full text-left hover:text-gray-600 cursor-pointer"
                            onClick={() => handleSuggestionClick(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* <div>
                      <div className="space-y-3"> */}
                    {/* This would be populated with actual recommendations */}
                    {/* </div>
                    </div> */}
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
