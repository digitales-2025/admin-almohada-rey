import { useState } from "react";

import {
  useGetAllAvailableRoomsForUpdateQuery,
  useGetAllAvailableRoomsQuery,
  useGetRoomAvailabilityForUpdateQuery,
  useGetRoomAvailabilityQuery,
} from "../_services/reservationApi";
import {
  AvailabilityFormUpdateParams,
  AvailabilityParams,
  GenericAvailabilityFormUpdateParams,
  GenericAvailabilityParams,
} from "../_types/room-availability-query-params";

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

  const isAvailable = data?.isAvailable ? data.isAvailable : false;

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

export const useRoomAvailabilityForUpdate = ({
  reservationId,
  checkInDate,
  checkOutDate,
  roomId,
}: AvailabilityFormUpdateParams) => {
  const [params, setParams] = useState<AvailabilityFormUpdateParams | null>(null);

  // Usar un estado local para manejar los parámetros de consulta
  const { data, isLoading, isFetching, isError, error } = useGetRoomAvailabilityForUpdateQuery(
    params ?? {
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      reservationId: reservationId,
    },
    {
      skip: !params,
      refetchOnMountOrArgChange: true,
    }
  );

  const isAvailable = data?.isAvailable ? data.isAvailable : false;

  const checkAvailability = (newParams: AvailabilityFormUpdateParams) => {
    setParams({
      ...newParams,
      reservationId: reservationId,
    });
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

export const useAllAvailableRoomsInTimeIntervalForUpdate = (
  defaultParams: GenericAvailabilityFormUpdateParams,
  reservationId: string
) => {
  const [params, setParams] = useState<GenericAvailabilityFormUpdateParams | null>(defaultParams);

  // Usar un estado local para manejar los parámetros de consulta
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAllAvailableRoomsForUpdateQuery(
    params ?? {
      checkInDate: defaultParams.checkInDate,
      checkOutDate: defaultParams.checkOutDate,
      reservationId: reservationId,
    },
    {
      skip: !params,
      refetchOnMountOrArgChange: true,
    }
  );

  const checkAvailability = (newParams: GenericAvailabilityFormUpdateParams) => {
    setParams({
      ...newParams,
      reservationId: reservationId,
    });
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
