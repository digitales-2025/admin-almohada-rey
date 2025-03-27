import { useState } from "react";

import { useGetRoomAvailabilityQuery } from "../_services/reservationApi";
import { AvailabilityParams } from "../_types/room-availability-query-params";

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
