import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  PaginatedRoomParams,
  StatusRoomDto,
  useCreateRoomMutation,
  useDeleteRoomsMutation,
  useGetAllRoomsQuery,
  useGetPaginatedRoomsQuery,
  useReactivateRoomsMutation,
  useUpdateAmenitiesMutation,
  useUpdateRoomMutation,
  useUpdateRoomStatusMutation,
} from "../_services/roomsApi";
import { Room, RoomStatus } from "../_types/room";

export const useRooms = () => {
  const { data: dataRoomsAll, error, isLoading, isSuccess, refetch } = useGetAllRoomsQuery();

  const [createRoom, { isSuccess: isSuccessCreateRoom }] = useCreateRoomMutation();

  const [updateRoom, { isSuccess: isSuccessUpdateRoom, isLoading: isLoadingUpdateRoom }] = useUpdateRoomMutation();

  const [updateAmenities, { isSuccess: isSuccessUpdateAmenities, isLoading: isLoadingUpdateAmenities }] =
    useUpdateAmenitiesMutation();

  const [updateRoomStatus, { isSuccess: isSuccessUpdateRoomStatus, isLoading: isLoadingUpdateRoomStatus }] =
    useUpdateRoomStatusMutation();

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

  async function onUpdateRoom(input: Partial<Room> & { id: string }, showToast: boolean = true) {
    const promise = runAndHandleError(() => updateRoom(input).unwrap());

    if (showToast) {
      toast.promise(promise, {
        loading: "Actualizando habitación...",
        success: "Habitación actualizada exitosamente",
        error: (error) => {
          return error.message;
        },
      });
    }

    return await promise;
  }

  async function onUpdateAmenities(input: Partial<Room> & { id: string }, showToast: boolean = true) {
    const promise = runAndHandleError(() => updateAmenities(input).unwrap());

    if (showToast) {
      toast.promise(promise, {
        loading: "Actualizando amenidades de habitación...",
        success: "Amenidades actualizadas exitosamente",
        error: (error) => {
          return error.message;
        },
      });
    }

    return await promise;
  }

  async function onUpdateRoomStatus(roomId: string, status: RoomStatus) {
    const statusDto: StatusRoomDto = { status };
    const promise = runAndHandleError(() => updateRoomStatus({ id: roomId, statusDto }).unwrap());

    toast.promise(promise, {
      loading: "Actualizando disponibilidad de habitación...",
      success: "Disponibilidad actualizada exitosamente",
      error: (error) => error.message,
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
    onUpdateAmenities,
    isSuccessUpdateAmenities,
    isLoadingUpdateAmenities,
    onUpdateRoomStatus,
    isSuccessUpdateRoomStatus,
    isLoadingUpdateRoomStatus,
    onDeleteRooms,
    isSuccessDeleteRooms,
    onReactivateRooms,
    isSuccessReactivateRooms,
    isLoadingReactivateRooms,
  };
};

interface UsePaginatedRoomsProps {
  page?: number;
  pageSize?: number;
}

export const usePaginatedRooms = (options: UsePaginatedRoomsProps = {}) => {
  const { page = 1, pageSize = 10 } = options;

  const paginationParams: PaginatedRoomParams = {
    pagination: { page, pageSize },
  };

  const {
    data: paginatedRooms,
    isLoading: isLoadingPaginatedRooms,
    refetch: refetchPaginatedRooms,
  } = useGetPaginatedRoomsQuery(paginationParams, {
    skip: !paginationParams,
    refetchOnMountOrArgChange: true,
  });

  return {
    paginatedRooms,
    isLoadingPaginatedRooms,
    refetchPaginatedRooms,
  };
};
