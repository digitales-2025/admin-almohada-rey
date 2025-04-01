import React from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingFormSkeletonProps {
  fields?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

const LoadingFormSkeleton: React.FC<LoadingFormSkeletonProps> = ({
  fields = 4,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {Array(fields)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </CardContent>
      {showFooter && (
        <CardFooter className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      )}
    </Card>
  );
};

export default LoadingFormSkeleton;
