import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateCustomerMutation,
  useDeleteCustomersMutation,
  useGetAllCustomersQuery,
  useGetCustomerDataByDniQuery,
  useGetHistoryCustomerByIdQuery,
  useImportCustomersMutation,
  useLazyDownloadCustomerTemplateQuery,
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
  dni?: string;
}

export const useCustomers = (options: UseCustomerProps = {}) => {
  const { search, historyCustomerId, historyStatus, historyYear, dni } = options;

  const { data: dataCustomersAll, error, isLoading, isSuccess, refetch } = useGetAllCustomersQuery();

  const searchQuery = useSearchCustomersByDocumentIdQuery(search || "None", {
    skip: !search, // Evita hacer la query si no hay id
    refetchOnMountOrArgChange: true,
  });

  // Agregar el hook para DNI siguiendo el mismo patrón
  const {
    data: customerDataByDni,
    refetch: refetchCustomerDataByDni,
    isLoading: isLoadingCustomerDataByDni,
    isFetching: isFetchingCustomerDataByDni,
    error: errorCustomerDataByDni,
    isSuccess: isSuccessCustomerDataByDni,
  } = useGetCustomerDataByDniQuery(dni as string, {
    skip: !dni || dni.length < 8, // Evita hacer la query si no hay DNI o no tiene 8 dígitos
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

  // Nuevos hooks para importación y descarga de plantilla
  const [importCustomers, { isSuccess: isSuccessImportCustomers, isLoading: isLoadingImportCustomers }] =
    useImportCustomersMutation();

  const [downloadTemplate, { isLoading: isLoadingDownloadTemplate }] = useLazyDownloadCustomerTemplateQuery();

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

  const onImportCustomers = async (file: File, continueOnError: boolean = false) => {
    const promise = runAndHandleError(() => importCustomers({ file, continueOnError }).unwrap());

    toast.promise(promise, {
      loading: "Importando clientes...",
      success: (data) => data.message || "Importación completada con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onDownloadTemplate = async () => {
    const toastId = toast.loading("Descargando plantilla...");

    try {
      const blob = await downloadTemplate().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla_clientes.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("Plantilla descargada con éxito", { id: toastId });
      return true;
    } catch (error: any) {
      toast.error(`Error al descargar: ${error.message}`, { id: toastId });
      return false;
    }
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
    onImportCustomers,
    isSuccessImportCustomers,
    isLoadingImportCustomers,
    onDownloadTemplate,
    isLoadingDownloadTemplate,
    customerDataByDni,
    refetchCustomerDataByDni,
    isLoadingCustomerDataByDni,
    isFetchingCustomerDataByDni,
    errorCustomerDataByDni,
    isSuccessCustomerDataByDni,
  };
};

// export const useSearchCustomerByDocId = (docNumber: string) => useSearchCustomersByDocumentIdQuery(docNumber);
export const useSearchCustomerByDocId = (docNumber: string) => useSearchCustomersByDocumentIdQuery(docNumber);
