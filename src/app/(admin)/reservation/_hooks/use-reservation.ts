import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { processError } from "@/utils/process-error";
import { CreateReservationInput, UpdateReservationInput } from "../_schemas/reservation.schemas";
import {
  useCreateReservationMutation,
  useGetPaginatedReservationsQuery,
  useGetReservationByIdQuery,
  useUpdateReservationMutation,
} from "../_services/reservationApi";

export type UpdateParams = {
  id: string;
  data: UpdateReservationInput;
};

export const useReservation = () => {
  const usePaginatedReservationQuery = (page: number = 1, pageSize: number = 10) =>
    useGetPaginatedReservationsQuery({ page, pageSize });
  const useOneReservationQuery = (id: string) => useGetReservationByIdQuery(id);
  const [createReservation, createReservationResponse] = useCreateReservationMutation();
  const [updateReservation, updateReservationResponse] = useUpdateReservationMutation();
  async function onCreateReservation(input: CreateReservationInput) {
    const promise = runAndHandleError(() => createReservation(input).unwrap());
    toast.promise(promise, {
      loading: "Creando reservación...",
      success: "Reservación creada con éxito",
      error: (err) => err?.message ?? err?.error ?? "Error desconocido al crear reservación",
    });
    return await promise;
  }
  async function onUpdateReservation(input: UpdateParams) {
    const promise = runAndHandleError(() => updateReservation(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando reservación...",
      success: "Reservación actualizada con éxito",
      error: (err) => processError(err) ?? "Error desconocido al actualizar reservación",
    });
    return await promise;
  }

  return {
    usePaginatedReservationQuery,
    useOneReservationQuery,
    onCreateReservation,
    createReservationResponse,
    onUpdateReservation,
    updateReservationResponse,
  };
};
