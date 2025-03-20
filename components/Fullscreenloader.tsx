"use client";

import { useLoading } from "./topLoader";

const FullScreenLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500"></div>
    </div>
  );
};

export default FullScreenLoader;
