"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomTypesTable } from "./_components/table/RoomTypesTable";
import { useRoomTypes } from "./_hooks/use-roomTypes";

export default function RoomTypesPage() {
  const { roomTypesList, roomTypesError, isLoadingRoomTypes } = useRoomTypes();

  if (isLoadingRoomTypes) {
    return (
      <div>
        <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
        <DataTableSkeleton columns={7} numFilters={2} />
      </div>
    );
  }

  if (roomTypesError || !roomTypesList) {
    return (
      <div>
        <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomTypesTable data={roomTypesList} />
      </div>
    </div>
  );
}
