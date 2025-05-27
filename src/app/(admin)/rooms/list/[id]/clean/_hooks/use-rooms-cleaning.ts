import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateRoomCleaningMutation,
  useGetAllRoomsCleaningByRoomIdQuery,
  useGetAllRoomsCleaningQuery,
  useUpdateRoomCleaningMutation,
} from "../_service/roomsCleaningApi";
import { RoomCleaning } from "../_types/roomCleaning";

interface UseRoomCleaningProps {
  roomId?: string;
  page?: string;
  month?: string;
  year?: string;
}

export const useRoomsCleaning = (options: UseRoomCleaningProps = {}) => {
  const { roomId, page, month, year } = options;
  const { data: dataRoomsCleaningAll, error, isLoading, isSuccess, refetch } = useGetAllRoomsCleaningQuery();

  const {
    data: roomsCleaningByRoomId,
    refetch: refetchRoomsCleaningByRoomId,
    isLoading: isLoadingRoomsCleaningByRoomId,
  } = useGetAllRoomsCleaningByRoomIdQuery(
    {
      roomId: roomId as string,
      page: page ? parseInt(page, 10) : undefined,
      month: month,
      year: year,
    },
    {
      skip: !roomId, // Evita hacer la query si no hay id
      refetchOnMountOrArgChange: true,
    }
  );

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
    roomsCleaningByRoomId,
    refetchRoomsCleaningByRoomId,
    isLoadingRoomsCleaningByRoomId,
    onCreateRoomCleaning,
    isSuccessCreateRoomCleaning,
    onUpdateRoomCleaning,
    isSuccessUpdateRoomCleaning,
    isLoadingUpdateRoomCleaning,
  };
};
