import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateCustomerMutation,
  useDeleteCustomersMutation,
  useGetAllCustomersQuery,
  useReactivateCustomersMutation,
  useSearchCustomersByDocumentIdQuery,
  useUpdateCustomerMutation,
} from "../_services/customersApi";
import { Customer } from "../_types/customer";

export const useCustomers = () => {
  const { data: dataCustomersAll, error, isLoading, isSuccess, refetch } = useGetAllCustomersQuery();

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
  };
};

export const useSearchCustomerByDocId = (docNumber: string) => useSearchCustomersByDocumentIdQuery(docNumber);
