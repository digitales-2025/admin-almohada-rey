"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
  showColumnHeader?: boolean;
  cellHeight?: number;
  columnWidths?: number[];
  className?: string;
}

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
  showToolbar = true,
  showPagination = true,
  showColumnHeader = true,
  cellHeight = 40,
  columnWidths: customColumnWidths,
  className = "",
}: DataTableSkeletonProps) {
  // Generate array of column widths - make them slightly random for more realistic look
  const columnWidths = React.useMemo(() => {
    if (customColumnWidths && customColumnWidths.length === columns) {
      return customColumnWidths;
    }

    return Array(columns)
      .fill(0)
      .map(() => {
        // Random width between 80px and 200px
        return Math.floor(Math.random() * 120) + 80;
      });
  }, [columns, customColumnWidths]);

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* Toolbar Skeleton */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
            <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[120px]" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <Table>
          {showColumnHeader && (
            <TableHeader>
              <TableRow>
                {Array(columns)
                  .fill(0)
                  .map((_, index) => (
                    <TableHead key={`header-${index}`}>
                      <Skeleton className={`h-[${Math.floor(cellHeight / 2)}px] w-[${columnWidths[index]}px]`} />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {Array(columns)
                    .fill(0)
                    .map((_, colIndex) => (
                      <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                        <Skeleton className={`h-[${Math.floor(cellHeight / 2)}px] w-[${columnWidths[colIndex]}px]`} />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="hidden flex-1 sm:block">
            <Skeleton className="h-4 w-[250px]" />
          </div>
          <div className="flex items-center sm:space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-[70px]" />
            </div>
            <div className="flex w-[100px] items-center justify-center">
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8 hidden lg:flex" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
