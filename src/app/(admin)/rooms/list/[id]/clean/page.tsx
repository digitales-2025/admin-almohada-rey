"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DateFilterRoomCleaning } from "./_components/DateFilterRoomCleaning";
import { PaginationControlRoomCleaning } from "./_components/PaginationControlRoomCleaning";
import { RoomCleaningRecordsGrid } from "./_components/RoomCleaningRecordsGrid";
import { CleaningRecordsGridSkeleton } from "./_components/skeleton/CleaningRecordsGridSkeleton";
import { useRoomsCleaning } from "./_hooks/use-rooms-cleaning";

export default function RoomCleanPage() {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);

  const { roomsCleaningByRoomId, isLoadingRoomsCleaningByRoomId } = useRoomsCleaning({
    roomId: id as string,
    page: currentPage.toString(),
    month: selectedMonth,
    year: selectedYear,
  });

  if (isLoadingRoomsCleaningByRoomId) {
    return (
      <div>
        <HeaderPage
          title="Registros de Limpieza"
          description="Monitoreo de limpieza realizados en las habitaciones del hotel"
        />
        <CleaningRecordsGridSkeleton />
      </div>
    );
  }

  if (!roomsCleaningByRoomId) {
    return (
      <div>
        <HeaderPage
          title="Registros de Limpieza"
          description="Monitoreo de limpieza realizados en las habitaciones del hotel"
        />
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
              <Link href="/rooms/list">Habitaciones</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/rooms/list">Registro de Limpieza</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {roomsCleaningByRoomId.data.room.RoomTypes.name} - {roomsCleaningByRoomId.data.room.number}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <HeaderPage
          title="Registros de Limpieza"
          description="Monitoreo de limpieza realizados en las habitaciones del hotel"
        />
        <div className="flex items-center gap-3">
          <DateFilterRoomCleaning
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSelectMonth={setSelectedMonth}
            onSelectYear={setSelectedYear}
          />
        </div>
      </div>
      <RoomCleaningRecordsGrid records={roomsCleaningByRoomId?.data.cleaningChecklist} />

      <div className="mt-8">
        <PaginationControlRoomCleaning
          currentPage={currentPage}
          totalPages={roomsCleaningByRoomId?.pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
