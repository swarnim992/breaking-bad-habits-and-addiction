"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  // Add more protected routes here
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white px-3 py-6">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Navigation
      </p>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
