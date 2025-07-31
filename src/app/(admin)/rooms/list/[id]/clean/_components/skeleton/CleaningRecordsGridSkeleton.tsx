"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface CleaningRecordsGridSkeletonProps {
  count?: number;
}

export function CleaningRecordsGridSkeleton({ count = 8 }: CleaningRecordsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
          {/* Room number header skeleton */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-100">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Card content skeleton */}
          <div className="p-4 space-y-4">
            {/* Date row */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Staff row */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Verified by row */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
