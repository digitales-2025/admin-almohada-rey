import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateCustomerMutation,
  useDeleteCustomersMutation,
  useGetAllCustomersQuery,
  useGetHistoryCustomerByIdQuery,
  useReactivateCustomersMutation,
  useSearchCustomersByDocumentIdQuery,
  useUpdateCustomerMutation,
} from "../_services/customersApi";
import { Customer } from "../_types/customer";
import { ReservationStatus } from "../../reservation/_schemas/reservation.schemas";

interface UseCustomerProps {
  search?: string;
  historyCustomerId?: string;
  historyYear?: string;
  historyStatus?: ReservationStatus;
}

export const useCustomers = (options: UseCustomerProps = {}) => {
  const { search, historyCustomerId, historyStatus, historyYear } = options;

  const { data: dataCustomersAll, error, isLoading, isSuccess, refetch } = useGetAllCustomersQuery();

  const searchQuery = useSearchCustomersByDocumentIdQuery(search || "None", {
    skip: !search, // Evita hacer la query si no hay id
    refetchOnMountOrArgChange: true,
  });

  const {
    data: historyCustomerById,
    refetch: refetchHistoryCustomerById,
    isLoading: isLoadingHistoryCustomerById,
  } = useGetHistoryCustomerByIdQuery(
    {
      id: historyCustomerId as string,
      year: historyYear,
      status: historyStatus,
    },
    {
      skip: !historyCustomerId, // Evita hacer la query si no hay id
    }
  );

  const [createCustomer, { isSuccess: isSuccessCreateCustomer }] = useCreateCustomerMutation();

  const [updateCustomer, { isSuccess: isSuccessUpdateCustomer, isLoading: isLoadingUpdateCustomer }] =
    useUpdateCustomerMutation();

  const [deleteCustomers, { isSuccess: isSuccessDeleteCustomers }] = useDeleteCustomersMutation();

  const [reactivateCustomers, { isSuccess: isSuccessReactivateCustomers, isLoading: isLoadingReactivateCustomers }] =
    useReactivateCustomersMutation();

  async function onCreateCustomer(input: Partial<Customer>) {
    const promise = runAndHandleError(() => createCustomer(input).unwrap());
    toast.promise(promise, {
      loading: "Creando cliente...",
      success: "Cliente creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateCustomer(input: Partial<Customer> & { id: string }) {
    const promise = runAndHandleError(() => updateCustomer(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando cliente...",
      success: "Cliente actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  const onDeleteCustomers = async (ids: Customer[]) => {
    const onlyIds = ids.map((user) => user.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => deleteCustomers(idsString).unwrap());

    toast.promise(promise, {
      loading: "Eliminando...",
      success: "Clientes eliminados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onReactivateCustomers = async (ids: Customer[]) => {
    const onlyIds = ids.map((customer) => customer.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => reactivateCustomers(idsString).unwrap());

    toast.promise(promise, {
      loading: "Reactivando...",
      success: "Clientes reactivados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  return {
    dataCustomersAll,
    error,
    isLoading,
    isSuccess,
    historyCustomerById,
    isLoadingHistoryCustomerById,
    refetchHistoryCustomerById,
    refetch,
    onCreateCustomer,
    isSuccessCreateCustomer,
    onUpdateCustomer,
    isSuccessUpdateCustomer,
    isLoadingUpdateCustomer,
    onDeleteCustomers,
    isSuccessDeleteCustomers,
    onReactivateCustomers,
    isSuccessReactivateCustomers,
    isLoadingReactivateCustomers,
    searchQuery,
  };
};

// export const useSearchCustomerByDocId = (docNumber: string) => useSearchCustomersByDocumentIdQuery(docNumber);
export const useSearchCustomerByDocId = (docNumber: string) => useSearchCustomersByDocumentIdQuery(docNumber);
