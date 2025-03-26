"use client";

import { cn } from "@/lib/utils";

interface RoomNumberCellProps {
  value: string | number;
  className?: string;
}

export function RoomNumberCell({ value, className }: RoomNumberCellProps) {
  return (
    <div className={cn("items-center flex", className)}>
      <div className="flex items-center justify-center min-w-12 px-2 py-0.5 bg-gradient-to-b from-red-800 to-red-900 border-2 border-red-950 rounded-md text-amber-200 font-stretch-semi-expanded">
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}
