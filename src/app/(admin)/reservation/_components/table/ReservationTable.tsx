// "use client";

// import { useMemo } from "react";
// import { Table as TableInstance } from "@tanstack/react-table";

// import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
// import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
// // import { facetedFilters } from "../../_utils/customers.filter.utils";
// // import { ReservationTableToolbarActions } from "./ReservationTableToolbarActions";
// // import { ReservationDescription } from "./ReservationDescription";
// import { reservationColumns } from "./ReservationTableColumns";
// import { DetailedReservation } from "../../_schemas/reservation.schemas";

// export function ReservationTable({ data }: { data: DetailedReservation[] }) {
//   const { user } = useProfile();
//   const columns = useMemo(() => reservationColumns(user?.isSuperAdmin || false), [user]);

//   return (
//     <DataTableExpanded
//       data={data}
//       columns={columns}
//       toolbarActions={(table: TableInstance<DetailedReservation>) => <ReservationTableToolbarActions table={table} />}
//       filterPlaceholder="Buscar clientes..."
//       facetedFilters={facetedFilters}
//       renderExpandedRow={(row) => <ReservationDescription row={row} />}
//     />
//   );
// }
