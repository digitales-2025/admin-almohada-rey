import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateRoomMutation,
  useDeleteRoomsMutation,
  useGetAllRoomsQuery,
  useReactivateRoomsMutation,
  useUpdateRoomMutation,
} from "../_services/roomsApi";
import { Room } from "../_types/room";

export const useRooms = () => {
  const { data: dataRoomsAll, error, isLoading, isSuccess, refetch } = useGetAllRoomsQuery();

  const [createRoom, { isSuccess: isSuccessCreateRoom }] = useCreateRoomMutation();

  const [updateRoom, { isSuccess: isSuccessUpdateRoom, isLoading: isLoadingUpdateRoom }] = useUpdateRoomMutation();

  const [deleteRooms, { isSuccess: isSuccessDeleteRooms }] = useDeleteRoomsMutation();

  const [reactivateRooms, { isSuccess: isSuccessReactivateRooms, isLoading: isLoadingReactivateRooms }] =
    useReactivateRoomsMutation();

  async function onCreateRoom(input: Partial<Room>) {
    const promise = runAndHandleError(() => createRoom(input).unwrap());
    toast.promise(promise, {
      loading: "Creando habitación...",
      success: "Habitación creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateRoom(input: Partial<Room> & { id: string }) {
    const promise = runAndHandleError(() => updateRoom(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando habitación...",
      success: "Habitación actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  const onDeleteRooms = async (ids: Room[]) => {
    const onlyIds = ids.map((room) => room.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => deleteRooms(idsString).unwrap());

    toast.promise(promise, {
      loading: "Eliminando...",
      success: "Habitaciones eliminados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onReactivateRooms = async (ids: Room[]) => {
    const onlyIds = ids.map((room) => room.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => reactivateRooms(idsString).unwrap());

    toast.promise(promise, {
      loading: "Reactivando...",
      success: "Habitaciones reactivados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  return {
    dataRoomsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    onCreateRoom,
    isSuccessCreateRoom,
    onUpdateRoom,
    isSuccessUpdateRoom,
    isLoadingUpdateRoom,
    onDeleteRooms,
    isSuccessDeleteRooms,
    onReactivateRooms,
    isSuccessReactivateRooms,
    isLoadingReactivateRooms,
  };
};
