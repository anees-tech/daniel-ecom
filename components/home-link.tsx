"use client";

import Link from "next/link";

export default function HomeLink() {
  return (
    <Link href="/" className="text-gray-500 hover:text-gray-700">
      Home
    </Link>
  );
}
