import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { useGetDataByRucQuery } from "../_services/rucApi";

interface UseRucProps {
  ruc?: string;
}

export const useRuc = (options: UseRucProps = {}) => {
  const { ruc } = options;

  const {
    data: rucData,
    refetch: refetchRucData,
    isLoading: isLoadingRucData,
    error: errorRucData,
    isSuccess: isSuccessRucData,
  } = useGetDataByRucQuery(ruc as string, {
    skip: !ruc || ruc.length !== 11, // Evita hacer la query si no hay RUC o no tiene 11 dígitos
    refetchOnMountOrArgChange: true,
  });

  const onGetRucData = async (rucNumber: string) => {
    if (!rucNumber || rucNumber.length !== 11) {
      toast.error("El RUC debe tener 11 dígitos");
      return null;
    }

    const promise = runAndHandleError(() => refetchRucData());
    toast.promise(promise, {
      loading: "Consultando datos de RUC...",
      success: "Datos de RUC obtenidos exitosamente",
      error: (err) => err.message,
    });
    return await promise;
  };

  return {
    rucData,
    refetchRucData,
    isLoadingRucData,
    errorRucData,
    isSuccessRucData,
    onGetRucData,
  };
};
