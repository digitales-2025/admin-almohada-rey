import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { CreateReservationInput } from "../_schemas/reservation.schemas";
import {
  useCreateReservationMutation,
  useGetPaginatedReservationsQuery,
  useGetReservationByIdQuery,
} from "../_services/reservationApi";

export const useReservation = () => {
  const usePaginatedReservationQuery = (page: number = 1, pageSize: number = 10) =>
    useGetPaginatedReservationsQuery({ page, pageSize });
  const useOneReservationQuery = (id: string) => useGetReservationByIdQuery(id);
  const [createReservation, createReservationResponse] = useCreateReservationMutation();

  async function onCreateReservation(input: CreateReservationInput) {
    const promise = runAndHandleError(() => createReservation(input).unwrap());
    toast.promise(promise, {
      loading: "Creando reservación...",
      success: "Reservación creada con éxito",
      error: (err) => err?.message ?? "Error desconocido al crear reservación",
    });
    return await promise;
  }

  return {
    usePaginatedReservationQuery,
    useOneReservationQuery,
    onCreateReservation,
    createReservationResponse,
  };
};
