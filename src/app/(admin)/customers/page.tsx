"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { CustomersTable } from "./_components/table/CustomersTable";
import { useCustomers } from "./_hooks/use-customers";

export default function CustomersPage() {
  const { dataCustomersAll, isLoading } = useCustomers();

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  if (!dataCustomersAll) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CustomersTable data={dataCustomersAll} />
      </div>
    </div>
  );
}
