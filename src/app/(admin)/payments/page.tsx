"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { PaymentsTable } from "./_components/table/PaymentsTable";
import { usePayments } from "./_hooks/use-payments";

export default function PaymentsPage() {
  const { dataPaymentsAll, isLoading } = usePayments();

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
        <DataTableSkeleton columns={6} numFilters={1} />
      </div>
    );
  }

  if (!dataPaymentsAll) {
    return (
      <div>
        <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PaymentsTable data={dataPaymentsAll} />
      </div>
    </div>
  );
}
