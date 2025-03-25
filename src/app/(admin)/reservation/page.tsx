"use client";

import { toast } from "sonner";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
// import { ReservationTable } from "./_components/table/ReservationTable";
import { useReservation } from "./_hooks/use-reservation";
import { METADATA } from "./_statics/metadata";
import Loading from "./loading";

export default function CustomersPage() {
  const { usePaginatedReservationQuery } = useReservation();
  const { data: response, isLoading, isError, error, refetch } = usePaginatedReservationQuery();

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (!response) {
    return (
      <div>
        <HeaderPage title={METADATA.entityName} description={METADATA.description} />
        <ErrorGeneral />
      </div>
    );
  }

  if (isError) {
    const localError = error instanceof Error ? error.message : "Error desconocido";
    toast.error(localError, {
      action: {
        label: "Reintentar",
        onClick: () => refetch,
      },
    });
    return (
      <div>
        <HeaderPage title={METADATA.entityName} description={METADATA.description} />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* <ReservationTable data={response.data} /> */}
      </div>
    </div>
  );
}
