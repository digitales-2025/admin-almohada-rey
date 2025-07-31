import { toast } from "sonner";

import { useGetAllServicesQuery, useUpdateServiceMutation } from "@/redux/servicesApi";
import { Service } from "@/types/services";
import { runAndHandleError } from "@/utils/baseQuery";

export const useServices = () => {
  const { data: dataServicesAll, error, isLoading, isSuccess, refetch } = useGetAllServicesQuery();

  const [updateService, { isSuccess: isSuccessUpdateService, isLoading: isLoadingUpdateService }] =
    useUpdateServiceMutation();

  async function onUpdateService(input: Partial<Service> & { id: string }) {
    const promise = runAndHandleError(() => updateService(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando servicio...",
      success: "Servicio actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  return {
    dataServicesAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    onUpdateService,
    isSuccessUpdateService,
    isLoadingUpdateService,
  };
};
