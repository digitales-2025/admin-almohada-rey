"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomsTable } from "./_components/table/RoomsTable";
import { useRooms } from "./_hooks/use-rooms";

export default function RoomsPage() {
  const { dataRoomsAll, isLoading } = useRooms();

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
        <DataTableSkeleton columns={8} numFilters={3} />
      </div>
    );
  }

  if (!dataRoomsAll) {
    return (
      <div>
        <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomsTable data={dataRoomsAll} />
      </div>
    </div>
  );
}
