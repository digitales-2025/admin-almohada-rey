"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { ProductsTable } from "./_components/table/ProductsTable";
import { useProducts } from "./_hooks/use-customers";

export default function ProductsPage() {
  const { dataProductsAll, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Productos" description="Productos registrados en el sistema." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  if (!dataProductsAll) {
    return (
      <div>
        <HeaderPage title="Productos" description="Productos registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Productos" description="Productos registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProductsTable data={dataProductsAll} />
      </div>
    </div>
  );
}
