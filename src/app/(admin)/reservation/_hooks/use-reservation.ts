import { useState } from "react";
import { toast } from "sonner";

import { PaginatedResponse, PaginationParams } from "@/types/api/paginated-response";
import { RTKUseQueryHookResult } from "@/types/hooks/RTKQueryResult";
import { runAndHandleError } from "@/utils/baseQuery";
import { processError } from "@/utils/process-error";
import { CreateReservationInput, DetailedReservation, UpdateReservationInput } from "../_schemas/reservation.schemas";
import {
  PaginatedReservationParams,
  useCreateReservationMutation,
  useGetPaginatedReservationsQuery,
  useGetReservationByIdQuery,
  useUpdateReservationMutation,
} from "../_services/reservationApi";

export type UpdateParams = {
  id: string;
  data: UpdateReservationInput;
};

// Actualiza la definición de RTKUseQueryHookResult para hacerla más compatible
export const useReservation = () => {
  const usePaginatedReservationQuery = (page: number = 1, pageSize: number = 10) =>
    useGetPaginatedReservationsQuery({
      pagination: {
        page,
        pageSize,
      },
    });
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

export type PaginatedReservationHookResponse = {
  queryResponse: RTKUseQueryHookResult<PaginatedResponse<DetailedReservation>>;
  updateFilters: (newParams: PaginatedReservationParams) => void;
};

export const defaultPaginationConfig: PaginationParams = {
  page: 1,
  pageSize: 10,
};

export const defaultParamConfig: PaginatedReservationParams = {
  pagination: defaultPaginationConfig,
};

export const usePaginatedReservation: () => PaginatedReservationHookResponse = () => {
  const [params, setParams] = useState<PaginatedReservationParams | null>(defaultParamConfig);

  const queryResponse = useGetPaginatedReservationsQuery(params ?? defaultParamConfig, {
    skip: !params,
    refetchOnMountOrArgChange: true,
  });

  const updateFilters = (newParams: PaginatedReservationParams) => {
    setParams(newParams);
  };

  return {
    queryResponse,
    updateFilters,
  };
};
