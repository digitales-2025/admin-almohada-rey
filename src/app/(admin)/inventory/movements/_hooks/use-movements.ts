import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateMovementsMutation,
  useDeleteMovementsMutation,
  useGetAllMovementsQuery,
  useGetMovementsByIdQuery,
  useUpdateMovementsMutation,
} from "../_services/movementsApi";
import { MovementCreate, Movements } from "../_types/movements";

interface UseMovementsProps {
  id?: string;
}

export const useMovements = (options: UseMovementsProps = {}) => {
  const { id } = options;
  const { data: dataMovementsAll, error, isLoading, isSuccess, refetch } = useGetAllMovementsQuery();

  const { data: movementsById, refetch: refetchMovementsById } = useGetMovementsByIdQuery(
    { id: id as string },
    {
      skip: !id, // Evita hacer la query si no hay id
      refetchOnMountOrArgChange: true,
    }
  );

  const [createMovements, { isSuccess: isSuccessCreateMovements }] = useCreateMovementsMutation();

  const [updateMovements, { isSuccess: isSuccessUpdateMovements, isLoading: isLoadingUpdateMovements }] =
    useUpdateMovementsMutation();

  const [deleteMovements, { isSuccess: isSuccessDeleteMovements }] = useDeleteMovementsMutation();

  async function onCreateMovements(input: Partial<MovementCreate>) {
    const promise = runAndHandleError(() => createMovements(input).unwrap());
    toast.promise(promise, {
      loading: "Creando movimiento...",
      success: "Movimiento creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateMovements(input: Partial<Movements> & { id: string }) {
    const promise = runAndHandleError(() => updateMovements(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando movimiento...",
      success: "Movimiento actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  async function onDeleteMovements(id: string) {
    const promise = runAndHandleError(() => deleteMovements(id).unwrap());
    toast.promise(promise, {
      loading: "Eliminando movimiento...",
      success: "Movimiento eliminado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  return {
    dataMovementsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    movementsById,
    refetchMovementsById,
    onCreateMovements,
    isSuccessCreateMovements,
    onUpdateMovements,
    isLoadingUpdateMovements,
    isSuccessUpdateMovements,
    onDeleteMovements,
    isSuccessDeleteMovements,
  };
};
