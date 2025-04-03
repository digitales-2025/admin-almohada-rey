"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ReservationStatus } from "@/app/(admin)/reservation/_schemas/reservation.schemas";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCustomers } from "../../_hooks/use-customers";
import HotelBookingHistory from "./_components/HotelBookingHistory";
import HotelBookingHistorySkeleton from "./_components/skeleton/HotelBookingHistorySkeleton";

export default function BookingHistoryCustomerPage() {
  const { id } = useParams();
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { historyCustomerById, isLoadingHistoryCustomerById } = useCustomers({
    historyCustomerId: id as string,
    historyYear: yearFilter || undefined,
    historyStatus: selectedStatus !== "all" ? (selectedStatus as ReservationStatus) : undefined,
  });
  if (isLoadingHistoryCustomerById) {
    return (
      <div>
        <HeaderPage
          title="Historial de Reservas del Cliente"
          description="Historial de reservas registradas en el sistema."
        />
        <HotelBookingHistorySkeleton />
      </div>
    );
  }

  if (!historyCustomerById) {
    return (
      <div>
        <HeaderPage
          title="Historial de Reservas del Cliente"
          description="Historial de reservas registradas en el sistema."
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
              <Link href="/customers">Clientes</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="/customers">Historial de Reservas</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{historyCustomerById.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <HeaderPage
        title="Historial de Reservas del Cliente"
        description="Historial de reservas registradas en el sistema."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <HotelBookingHistory
          historyCustomerById={historyCustomerById}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          roomTypeFilter={roomTypeFilter}
          setRoomTypeFilter={setRoomTypeFilter}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
    </div>
  );
}
