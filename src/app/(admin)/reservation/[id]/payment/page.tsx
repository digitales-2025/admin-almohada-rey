"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { PaymentsTable } from "@/app/(admin)/payments/_components/table/PaymentsTable";
import { useAdvancedPayments } from "@/app/(admin)/payments/_hooks/useAdvancedPayments";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function PaymentReservationPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: paymentsData,
    meta: paymentsMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedPayments({
    initialPagination: { page, pageSize },
    reservationId: id as string,
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Pagos de la reserva" description="Pagos registrados en la reserva." />
        <DataTableSkeleton columns={6} numFilters={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Pagos de la reserva" description="Pagos registrados en la reserva." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/reservation">Reservas</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href={`/reservation/${id}/payment`}>Pagos de la reserva</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <HeaderPage
        title="Pagos de la reserva"
        description="Pagos registrados de la reserva seleccionada en el sistema."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PaymentsTable
          data={paymentsData}
          pagination={{
            page: paymentsMeta?.page || page,
            pageSize: paymentsMeta?.pageSize || pageSize,
            total: paymentsMeta?.total || 0,
            totalPages: paymentsMeta?.totalPages || 0,
          }}
          onPaginationChange={handlePaginationChange}
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
