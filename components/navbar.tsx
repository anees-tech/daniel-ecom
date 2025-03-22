"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, ChevronDown, Home, ShoppingBag, Phone, Info, User, ShoppingCart, ChevronUp } from "lucide-react"
import { useCartStore } from "@/context/addToCartContext"
import CartIcon from "@/public/cart-icon.svg"
import ProfileIcon from "@/public/profile.svg"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { AuthModal } from "./auth-modal"
import { useMobile } from "@/lib/hooks/use-mobile"

const mainNavItems = [
  {
    title: "Home",
    href: "/",
    description: "Explore our latest collections and offers.",
    icon: Home,
  },
  {
    title: "Shop",
    href: "/products",
    icon: ShoppingBag,
    children: [
      {
        title: "Men",
        href: "/category/men",
        description: "Discover stylish clothing for men, from casual to formal wear.",
      },
      {
        title: "Women",
        href: "/category/women",
        description: "Trendy and comfortable clothing designed for women.",
      },
      {
        title: "Footwear",
        href: "/category/footwear",
        description: "Find the perfect pair of shoes, sneakers, boots, and sandals.",
      },
      {
        title: "Leather",
        href: "/category/leather",
        description: "Premium leather goods including watches, bags, and accessories.",
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
    icon: Phone,
  },
  {
    title: "About",
    href: "/about",
    description: "Get to know our story, mission, and values.",
    icon: Info,
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Reach out to us for inquiries, support, or feedback.",
    icon: Phone,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const cartCount = useCartStore((state) => state.getCartCount())
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMobile()
  const [expandedShopMenu, setExpandedShopMenu] = useState(false)

  // Detect smaller tablets
  const [isTablet, setIsTablet] = useState(false)
  
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkTablet()
    window.addEventListener("resize", checkTablet)
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle outside click for search on mobile
  useEffect(() => {
    if (!isMobile) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const searchForm = document.getElementById("searchForm")
      if (isSearchOpen && searchForm && !searchForm.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile, isSearchOpen])

  return (
    <>
      <div
        className={cn(
          "flex items-center py-4 w-full transition-all duration-300 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] rounded-b-[20px] md:rounded-b-[30px] lg:rounded-b-[37px] fixed top-0 left-0 right-0 z-50",
          scrolled && "py-2 shadow-lg",
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 py-0 px-2">
                  <Link href="/" className="flex justify-center mb-4">
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
                            onClick={() => setExpandedShopMenu(!expandedShopMenu)}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-5 w-5" />}
                              <span>{item.title}</span>
                            </div>
                            {expandedShopMenu ? (
                              <ChevronUp className="h-4 w-4 transition-transform" />
                            ) : (
                              <ChevronDown className="h-4 w-4 transition-transform" />
                            )}
                          </div>
                          <div 
                            className={cn(
                              "pl-4 space-y-2 mt-1 mb-2 transition-all duration-300 overflow-hidden",
                              expandedShopMenu ? "max-h-96" : "max-h-0"
                            )}
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
                      )
                    }
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 py-2 text-lg font-medium transition-colors hover:text-primary hover:text-gray-400",
                            pathname === item.href ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {item.icon && <item.icon className="h-5 w-5" />}
                          {item.title}
                        </Link>
                      </SheetClose>
                    )
                  })}
                  <Button
                    variant="outline"
                    className="mt-4 bg-gradient-to-r from-[#EB1E24] via-[#F05021] to-[#F8A51B] border-none hover:bg-red-400 text-white cursor-pointer"
                    onClick={() => {
                      setIsModalOpen(true)
                    }}
                  >
                    Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className={cn(
              "relative", 
              scrolled ? "h-[70px] w-[70px]" : "h-[80px] w-[80px]", 
              "transition-all duration-300"
            )}>
              <Image 
                src="/logo.png?height=110&width=110" 
                alt="logo" 
                fill 
                className="cursor-pointer object-contain" 
                priority
              />
            </div>
          </Link>

          {/* Desktop/Tablet Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNavItems.map((item) => 
              item.children ? (
                <NavigationMenu key={item.href}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/20 hover:text-white font-normal">
                        {item.title} <ChevronDown className="h-4 w-4 ml-1" />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-white">
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{child.title}</div>
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
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "text-white hover:text-white/80 transition-colors duration-200 text-base lg:text-lg font-normal",
                    pathname === item.href && "font-medium"
                  )}
                >
                  {item.title}
                </Link>
              )
            )}
            <Link 
              href="/login"
              className="text-white hover:text-white/80 transition-colors duration-200 text-base lg:text-lg font-normal"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            >
              Login
            </Link>
          </div>

          {/* Search and Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              <span className="sr-only">Toggle search</span>
            </Button>
            
            {/* Search Bar */}
            <div 
              id="searchForm"
              className={cn(
                "transition-all duration-300",
                isSearchOpen 
                  ? "flex absolute top-full left-0 right-0 bg-white p-4 shadow-lg z-50" 
                  : "hidden md:flex relative"
              )}
            >
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className={cn(
                    "w-full md:w-[300px] lg:w-[350px] bg-white pl-10 py-2 rounded-full border-none focus:ring-2 focus:ring-orange-300",
                    isSearchOpen ? "shadow-md" : ""
                  )}
                />
              </div>
            </div>

            {/* Profile Icon */}
            <Link 
              href="/account" 
              className="hidden md:flex items-center justify-center bg-white rounded-full p-2"
            >
              <User className="h-5 w-5 text-gray-600" />
            </Link>

            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="hidden md:flex items-center justify-center bg-white rounded-full p-2"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 rounded-t-[20px]">
          <div className="flex justify-around items-center h-16">
            <Link href="/" className="flex flex-col items-center justify-center">
              <Home className={cn("h-5 w-5", pathname === "/" ? "text-[#EB1E24]" : "text-gray-500")} />
              <span className={cn("text-xs mt-1", pathname === "/" ? "text-[#EB1E24]" : "text-gray-500")}>Home</span>
            </Link>
            <Link href="/products" className="flex flex-col items-center justify-center">
              <ShoppingBag className={cn("h-5 w-5", pathname === "/products" ? "text-[#EB1E24]" : "text-gray-500")} />
              <span className={cn("text-xs mt-1", pathname === "/products" ? "text-[#EB1E24]" : "text-gray-500")}>
                Shop
              </span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center justify-center">
              <div className="relative">
                <ShoppingCart className={cn("h-5 w-5", pathname === "/cart" ? "text-[#EB1E24]" : "text-gray-500")} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn("text-xs mt-1", pathname === "/cart" ? "text-[#EB1E24]" : "text-gray-500")}>
                Cart
              </span>
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-xs mt-1 text-gray-500">Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Add padding to account for fixed elements */}
      <div className={cn(
        scrolled ? "h-20 md:h-24" : "h-24 md:h-28"
      )}></div>
      
      {/* Add padding for mobile bottom bar */}
      {isMobile && <div className="h-16"></div>}

      {/* Auth Modal */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}