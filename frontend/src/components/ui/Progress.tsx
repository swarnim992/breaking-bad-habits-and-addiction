import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        className="h-3 w-full overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #6c63ff 0%, #9f7aea 100%)",
          }}
        />
      </div>
      {showLabel && (
        <p className="mt-2 text-right text-xs text-[#8892b0]">{Math.round(pct)}%</p>
      )}
    </div>
  );
}
