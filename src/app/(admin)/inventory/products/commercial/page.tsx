"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { ProductsTable } from "../_components/table/ProductsTable";
import { usePaginatedProducts } from "../_hooks/use-products";
import { ProductType } from "../_types/products";

export default function CommercialProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedProducts, isLoadingPaginatedProducts } = usePaginatedProducts({
    page,
    pageSize,
    type: ProductType.COMMERCIAL,
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedProducts) {
    return (
      <div>
        <HeaderPage
          title="Productos"
          badgeContent="Comerciales"
          description="Gestión de productos destinados a venta y distribución comercial."
        />
        <DataTableSkeleton columns={5} numFilters={1} />
      </div>
    );
  }

  if (!paginatedProducts) {
    return (
      <div>
        <HeaderPage
          title="Productos"
          badgeContent="Comerciales"
          description="Gestión de productos destinados a venta y distribución comercial."
        />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        title="Productos"
        badgeContent="Comerciales"
        description="Gestión de productos destinados a venta y distribución comercial."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductsTable
          data={paginatedProducts.data}
          pagination={{
            page: paginatedProducts.meta.page,
            pageSize: paginatedProducts.meta.pageSize,
            total: paginatedProducts.meta.total,
            totalPages: paginatedProducts.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
