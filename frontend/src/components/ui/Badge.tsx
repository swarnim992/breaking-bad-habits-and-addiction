import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "accent";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[rgba(108,99,255,0.15)] text-[#8b85ff] border-[rgba(108,99,255,0.3)]",
  success: "bg-[rgba(74,222,128,0.12)] text-[#4ade80] border-[rgba(74,222,128,0.3)]",
  warning: "bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border-[rgba(251,191,36,0.3)]",
  accent: "bg-[rgba(255,101,132,0.12)] text-[#ff8fab] border-[rgba(255,101,132,0.3)]",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
