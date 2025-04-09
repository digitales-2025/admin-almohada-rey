import { ReactElement, useState } from "react";
import { toast } from "sonner";

import { PaginatedResponse, PaginationParams } from "@/types/api/paginated-response";
import { RTKUseQueryHookResult } from "@/types/hooks/RTKQueryResult";
import { runAndHandleError } from "@/utils/baseQuery";
import { processError } from "@/utils/process-error";
import {
  CreateReservationInput,
  DetailedReservation,
  ReservationStatus,
  UpdateReservationInput,
} from "../_schemas/reservation.schemas";
import {
  PaginatedReservationParams,
  useCreateReservationMutation,
  useDeactivateReservationsMutation,
  useGetPaginatedReservationsQuery,
  useGetReservationByIdQuery,
  useReactivateReservationsMutation,
  useTransitionReservationStatusMutation,
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
  const [transitionReservationStatus, transitionReservationStatusResponse] = useTransitionReservationStatusMutation();
  const [deactivateReservations, deactivateReservationResponse] = useDeactivateReservationsMutation();
  const [reactivateReservations, reactivateReservationsResponse] = useReactivateReservationsMutation();
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
  async function onTransitionReservationStatus(input: { id: string; status: ReservationStatus }) {
    const promise = runAndHandleError(() => transitionReservationStatus(input).unwrap());
    toast.promise(promise, {
      loading: "Cambiando estado de la reservación...",
      success: "Estado de la reservación cambiado con éxito",
      error: (err) => processError(err) ?? "Error desconocido al cambiar el estado de la reservación",
    });
    return await promise;
  }
  async function onDeactivateReservations(input: { ids: string[] }) {
    const promise = runAndHandleError(() => deactivateReservations(input).unwrap());
    toast.promise(promise, {
      loading: "Desactivando reservaciones...",
      success: (response) => {
        const { successful, failed } = response.data;
        if (failed.length === 0) {
          return "Reservaciones desactivadas con éxito";
        }
        const successMessage: ReactElement = (
          <div className="w-full flex flex-col gap-3 text-sm">
            <span>
              {successful.length} reservaciones desactivadas con éxito.
              <br />
              {failed.length} reservaciones fallidas.
            </span>
            {failed.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Razones</span>
                <div className="flex flex-col gap-1">
                  {failed.map((reservation) => (
                    <span key={reservation.id} className="text-red-500">
                      {"- "}
                      {reservation.reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        return successMessage;
      },
      error: (err) => processError(err) ?? "Error desconocido al desactivar reservaciones",
    });
    return await promise;
  }
  async function onReactivateReservations(input: { ids: string[] }) {
    const promise = runAndHandleError(() => reactivateReservations(input).unwrap());
    toast.promise(promise, {
      loading: "Reactivando reservaciones...",
      success: (response) => {
        const { successful, failed } = response.data;
        if (failed.length === 0) {
          return "Reservaciones reactivadas con éxito";
        }
        const successMessage: ReactElement = (
          <div className="w-full flex flex-col gap-3 text-sm">
            <span>
              {successful.length} reservaciones reactivadas con éxito.
              <br />
              {failed.length} reservaciones fallidas.
            </span>
            {failed.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Razones</span>
                <div className="flex flex-col gap-1">
                  {failed.map((reservation) => (
                    <span key={reservation.id} className="text-red-500">
                      {"- "}
                      {reservation.reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        return successMessage;
      },
      error: (err) => processError(err) ?? "Error desconocido al reactivar reservaciones",
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
    onTransitionReservationStatus,
    transitionReservationStatusResponse,
    onDeactivateReservations,
    deactivateReservationResponse,
    onReactivateReservations,
    reactivateReservationsResponse,
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
