import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateCustomerReservationHistoryMutation,
  useDeleteCustomerReservationHistoriesMutation,
  useGetCustomerReservationHistoriesByCustomerIdQuery,
  useUpdateCustomerReservationHistoryMutation,
} from "../_services/customerReservationHistoryApi";

// Import DTOs from the API service
type CreateCustomerReservationHistoryData = {
  customerId: string;
  date: string;
  description?: string;
};

type UpdateCustomerReservationHistoryData = {
  date?: string;
  description?: string;
};

interface UseCustomerReservationHistoryProps {
  customerId?: string;
}

export const useCustomerReservationHistory = (options: UseCustomerReservationHistoryProps = {}) => {
  const { customerId } = options;

  // Get customer reservation histories by customer ID
  const {
    data: customerReservationHistories = [],
    error,
    isLoading,
    isSuccess,
    refetch: refetchCustomerReservationHistories,
  } = useGetCustomerReservationHistoriesByCustomerIdQuery(customerId as string, {
    skip: !customerId, // Skip query if no customerId provided
    refetchOnMountOrArgChange: true,
  });

  // Create customer reservation history
  const [createCustomerReservationHistory, { isSuccess: isSuccessCreateHistory, isLoading: isLoadingCreateHistory }] =
    useCreateCustomerReservationHistoryMutation();

  // Update customer reservation history
  const [updateCustomerReservationHistory, { isSuccess: isSuccessUpdateHistory, isLoading: isLoadingUpdateHistory }] =
    useUpdateCustomerReservationHistoryMutation();

  // Delete customer reservation histories
  const [
    deleteCustomerReservationHistories,
    { isSuccess: isSuccessDeleteHistories, isLoading: isLoadingDeleteHistories },
  ] = useDeleteCustomerReservationHistoriesMutation();

  // Create customer reservation history function
  async function onCreateCustomerReservationHistory(input: CreateCustomerReservationHistoryData) {
    const promise = runAndHandleError(() => createCustomerReservationHistory(input).unwrap());
    toast.promise(promise, {
      loading: "Creando historial de reserva...",
      success: "Historial de reserva creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  // Update customer reservation history function
  async function onUpdateCustomerReservationHistory(input: { id: string; body: UpdateCustomerReservationHistoryData }) {
    const promise = runAndHandleError(() => updateCustomerReservationHistory(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando historial de reserva...",
      success: "Historial de reserva actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  // Delete customer reservation histories function
  const onDeleteCustomerReservationHistories = async (ids: string[]) => {
    const deleteData = {
      ids: ids,
    };
    const promise = runAndHandleError(() => deleteCustomerReservationHistories(deleteData).unwrap());

    toast.promise(promise, {
      loading: "Eliminando historiales...",
      success: "Historiales de reserva eliminados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  return {
    // Data and state
    customerReservationHistories,
    error,
    isLoading,
    isSuccess,
    refetchCustomerReservationHistories,

    // Create functions
    onCreateCustomerReservationHistory,
    isSuccessCreateHistory,
    isLoadingCreateHistory,

    // Update functions
    onUpdateCustomerReservationHistory,
    isSuccessUpdateHistory,
    isLoadingUpdateHistory,

    // Delete functions
    onDeleteCustomerReservationHistories,
    isSuccessDeleteHistories,
    isLoadingDeleteHistories,
  };
};

// Hook for getting customer reservation histories by customer ID
export const useCustomerReservationHistoriesByCustomerId = (customerId: string) => {
  return useGetCustomerReservationHistoriesByCustomerIdQuery(customerId, {
    skip: !customerId,
    refetchOnMountOrArgChange: true,
  });
};
