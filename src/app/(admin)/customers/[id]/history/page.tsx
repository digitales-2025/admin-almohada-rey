import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import HotelBookingHistory from "./_components/HotelBookingHistory";

export default function BookingHistoryCustomerPage() {
  return (
    <div>
      <HeaderPage
        title="Historial de Reservas del Cliente"
        description="Historial de reservas registradas en el sistema."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <HotelBookingHistory />
      </div>
    </div>
  );
}
