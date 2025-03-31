import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateRoomCleaningMutation,
  useGetAllRoomsCleaningQuery,
  useUpdateRoomCleaningMutation,
} from "../_service/RoomsCleaningApi";
import { RoomCleaning } from "../_types/roomCleaning";

export const useRoomsCleaning = () => {
  const { data: dataRoomsCleaningAll, error, isLoading, isSuccess, refetch } = useGetAllRoomsCleaningQuery();

  const [createRoomCleaning, { isSuccess: isSuccessCreateRoomCleaning }] = useCreateRoomCleaningMutation();

  const [updateRoomCleaning, { isSuccess: isSuccessUpdateRoomCleaning, isLoading: isLoadingUpdateRoomCleaning }] =
    useUpdateRoomCleaningMutation();

  async function onCreateRoomCleaning(input: Partial<RoomCleaning>) {
    const promise = runAndHandleError(() => createRoomCleaning(input).unwrap());
    toast.promise(promise, {
      loading: "Creando historial de limpieza...",
      success: "Historial de limpieza creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateRoomCleaning(input: Partial<RoomCleaning> & { id: string }) {
    const promise = runAndHandleError(() => updateRoomCleaning(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando historial de limpieza...",
      success: "Historial de limpieza actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  return {
    dataRoomsCleaningAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    onCreateRoomCleaning,
    isSuccessCreateRoomCleaning,
    onUpdateRoomCleaning,
    isSuccessUpdateRoomCleaning,
    isLoadingUpdateRoomCleaning,
  };
};
