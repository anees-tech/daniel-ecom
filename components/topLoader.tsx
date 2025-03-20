"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

const LoadingContext = createContext<{ isLoading: boolean }>({ isLoading: true });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show progress when route changes
    NProgress.start();
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      NProgress.done();
      setIsLoading(false);
    }, 500); // Adjust timing based on your need

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
