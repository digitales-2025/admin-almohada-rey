"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { ProductsTable } from "../_components/table/ProductsTable";
import { useAdvancedProducts } from "../_hooks/useAdvancedProducts";
import { ProductType } from "../_types/products";

export default function CommercialProductsPage() {
  const {
    data: productsData,
    meta: productsMeta,
    isLoading,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedProducts({
    type: ProductType.COMMERCIAL,
    initialPagination: { page: 1, pageSize: 10 },
  });

  if (isLoading) {
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

  if (!productsData) {
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
          data={productsData as any}
          meta={productsMeta || { total: 0, page: 1, pageSize: 10, totalPages: 0 }}
          tableState={tableState}
          tableActions={tableActions}
          filtersState={filtersState}
          getFilterValueByColumn={getFilterValueByColumn}
          localSearch={localSearch}
        />
      </div>
    </div>
  );
}
