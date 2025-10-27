"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { setupReservationWebsockets } from "@/app/(admin)/reservation/_services/reservationApi";
import { store } from "@/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  // Configurar WebSockets para reservaciones
  useEffect(() => {
    const cleanup = setupReservationWebsockets(store.dispatch);

    // Cleanup al desmontar
    return cleanup;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
