import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreatePaymentDetailsMutation,
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
} from "../_services/paymentsApi";
import { Payment } from "../_types/payment";

export const usePayments = () => {
  const { data: dataPaymentsAll, error, isLoading, isSuccess, refetch } = useGetAllPaymentsQuery();
  const [createPayment, { isSuccess: isSuccessCreatePayment }] = useCreatePaymentMutation();
  const [createPaymentDetails, { isSuccess: isSuccessCreatePaymentDetails, isLoading: isLoadingCreatePaymentDetails }] =
    useCreatePaymentDetailsMutation();

  async function onCreatePayment(input: Partial<Payment>) {
    const promise = runAndHandleError(() => createPayment(input).unwrap());
    toast.promise(promise, {
      loading: "Creando pago...",
      success: "Pago creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onCreatePaymentDetails(input: Partial<Payment>) {
    const promise = runAndHandleError(() => createPaymentDetails(input).unwrap());
    toast.promise(promise, {
      loading: "Creando detalle de pago...",
      success: "Detalle de pago creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  return {
    dataPaymentsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    onCreatePayment,
    isSuccessCreatePayment,
    onCreatePaymentDetails,
    isSuccessCreatePaymentDetails,
    isLoadingCreatePaymentDetails,
  };
};
