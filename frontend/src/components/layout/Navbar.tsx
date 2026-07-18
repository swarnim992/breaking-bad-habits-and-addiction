"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-indigo-600">
          PromptWar
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
