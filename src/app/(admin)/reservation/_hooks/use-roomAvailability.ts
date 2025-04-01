import { useState } from "react";

import { useGetAllAvailableRoomsQuery, useGetRoomAvailabilityQuery } from "../_services/reservationApi";
import { AvailabilityParams, GenericAvailabilityParams } from "../_types/room-availability-query-params";

export const useRoomAvailability = () => {
  const [params, setParams] = useState<AvailabilityParams | null>(null);

  // Usar un estado local para manejar los parámetros de consulta
  const { data, isLoading, isFetching, isError, error } = useGetRoomAvailabilityQuery(
    params ?? {
      roomId: "",
      checkInDate: "",
      checkOutDate: "",
    },
    {
      skip: !params,
      refetchOnMountOrArgChange: true,
    }
  );

  const isAvailable = data?.isAvailable ? data.isAvailable : false; //lookout this code

  const checkAvailability = (newParams: AvailabilityParams) => {
    setParams(newParams);
  };

  return {
    isAvailable,
    isLoading: isLoading || isFetching,
    checkAvailability,
    error,
    isError,
  };
};

export const useAllAvailableRoomsInTimeInterval = (defaultParams: GenericAvailabilityParams) => {
  const [params, setParams] = useState<GenericAvailabilityParams | null>(defaultParams);

  // Usar un estado local para manejar los parámetros de consulta
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAllAvailableRoomsQuery(
    params ?? {
      checkInDate: "",
      checkOutDate: "",
    },
    {
      skip: !params,
      refetchOnMountOrArgChange: true,
    }
  );

  const checkAvailability = (newParams: GenericAvailabilityParams) => {
    setParams(newParams);
  };

  return {
    availableRooms: data ?? [],
    isLoading: isLoading || isFetching,
    checkAvailability,
    error,
    isError,
    refetch,
  };
};
