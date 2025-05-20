import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { CreateExtendStay, CreateLateCheckout } from "../_schemas/extension-reservation.schemas";
import {
  useApplyLateCheckoutMutation,
  useCheckExtendedCheckoutAvailabilityQuery,
  useExtendStayMutation,
  useRemoveLateCheckoutMutation,
} from "../_services/reservationApi";

interface UseExtendReservationProps {
  id?: string;
  newCheckoutDate?: string;
}

export const useExtendReservation = (options: UseExtendReservationProps = {}) => {
  const { id, newCheckoutDate } = options;

  // Query para verificar disponibilidad
  const {
    data: checkoutAvailabilityData,
    isLoading: isLoadingAvailability,
    refetch: refetchAvailability,
    isSuccess: isSuccessAvailability,
  } = useCheckExtendedCheckoutAvailabilityQuery(
    {
      id: id as string,
      newCheckoutDate: newCheckoutDate as string,
    },
    {
      skip: !id || !newCheckoutDate,
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutations para aplicar cambios
  const [applyLateCheckout, { isLoading: isLoadingLateCheckout, isSuccess: isSuccessLateCheckout }] =
    useApplyLateCheckoutMutation();

  const [removeLateCheckout, { isLoading: isLoadingRemoveLateCheckout, isSuccess: isSuccessRemoveLateCheckout }] =
    useRemoveLateCheckoutMutation();

  const [extendStay, { isLoading: isLoadingExtendStay, isSuccess: isSuccessExtendStay }] = useExtendStayMutation();

  // Función para aplicar late checkout
  async function onApplyLateCheckout(id: string, data: CreateLateCheckout) {
    const promise = runAndHandleError(() => applyLateCheckout({ id, data }).unwrap());

    toast.promise(promise, {
      loading: "Aplicando late checkout...",
      success: "Late checkout aplicado con éxito",
      error: (err) => err.message,
    });

    return await promise;
  }

  // Función para remover late checkout
  async function onRemoveLateCheckout(id: string) {
    const promise = runAndHandleError(() => removeLateCheckout(id).unwrap());

    toast.promise(promise, {
      loading: "Eliminando late checkout...",
      success: "Late checkout eliminado con éxito",
      error: (err) => err.message,
    });

    return await promise;
  }

  // Función para extender estadía
  async function onExtendStay(id: string, data: CreateExtendStay) {
    const promise = runAndHandleError(() => extendStay({ id, data }).unwrap());

    toast.promise(promise, {
      loading: "Extendiendo estadía...",
      success: "Estadía extendida con éxito",
      error: (err) => err.message,
    });

    return await promise;
  }

  return {
    // Datos de disponibilidad
    isAvailable: checkoutAvailabilityData?.isAvailable || false,
    isLoadingAvailability,
    isSuccessAvailability,
    refetchAvailability,

    // Funciones principales
    onApplyLateCheckout,
    onRemoveLateCheckout,
    onExtendStay,

    // Estados de late checkout
    isLoadingLateCheckout,
    isSuccessLateCheckout,

    // Estados de remove late checkout
    isLoadingRemoveLateCheckout,
    isSuccessRemoveLateCheckout,

    // Estados de extend stay
    isLoadingExtendStay,
    isSuccessExtendStay,
  };
};

export default useExtendReservation;
