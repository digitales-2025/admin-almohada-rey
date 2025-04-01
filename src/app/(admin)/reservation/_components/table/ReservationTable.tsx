"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

// import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import { facetedFilters } from "../../_utils/reservation.filter.utils";
import { ReservationAdditionalDetails } from "./ReservationAdditionalDetails";
// import { facetedFilters } from "../../_utils/customers.filter.utils";
// import { ReservationTableToolbarActions } from "./ReservationTableToolbarActions";
// import { ReservationDescription } from "./ReservationDescription";
import { reservationColumns } from "./ReservationTableColumns";
import { ReservationTableToolbarActions } from "./ReservationTableToolbarActions";

export function ReservationTable({ data }: { data: DetailedReservation[] }) {
  // const { user } = useProfile();
  const columns = useMemo(
    () => reservationColumns(),
    // user?.isSuperAdmin ?? false
    []
  );

  return (
    <DataTableExpanded
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<DetailedReservation>) => <ReservationTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes..."
      facetedFilters={facetedFilters}
      renderExpandedRow={(row) => <ReservationAdditionalDetails row={row} />}
      columnVisibilityConfig={{
        reservationDate: false,
      }}
    />
  );
}
