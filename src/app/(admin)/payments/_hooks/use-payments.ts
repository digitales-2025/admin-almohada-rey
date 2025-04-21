import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreatePaymentDetailsMutation,
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useRemovePaymentDetailMutation,
  useUpdatePaymentDetailMutation,
  useUpdatePaymentDetailsBatchMutation,
  useUpdatePaymentMutation,
} from "../_services/paymentsApi";
import { Payment, PaymentDetail, PaymentDetailMethod } from "../_types/payment";

interface UsePaymentsProps {
  id?: string;
}

export const usePayments = (options: UsePaymentsProps = {}) => {
  const { id } = options;

  const { data: dataPaymentsAll, error, isLoading, isSuccess, refetch } = useGetAllPaymentsQuery();

  const {
    data: paymentById,
    refetch: refetchPaymentById,
    isLoading: isLoadingPaymentById,
  } = useGetPaymentByIdQuery(
    {
      id: id as string,
    },
    {
      skip: !id, // Evita hacer la query si no hay id
    }
  );

  const [createPayment, { isSuccess: isSuccessCreatePayment }] = useCreatePaymentMutation();
  const [createPaymentDetails, { isSuccess: isSuccessCreatePaymentDetails, isLoading: isLoadingCreatePaymentDetails }] =
    useCreatePaymentDetailsMutation();

  const [updatePayment, { isSuccess: isSuccessUpdatePayment, isLoading: isLoadingUpdatePayment }] =
    useUpdatePaymentMutation();

  const [updatePaymentDetail, { isSuccess: isSuccessUpdatePaymentDetail, isLoading: isLoadingUpdatePaymentDetail }] =
    useUpdatePaymentDetailMutation();

  const [
    updatePaymentDetailsBatch,
    { isSuccess: isSuccessUpdatePaymentDetailsBatch, isLoading: isLoadingUpdatePaymentDetailsBatch },
  ] = useUpdatePaymentDetailsBatchMutation();

  const [removePaymentDetail, { isSuccess: isSuccessRemovePaymentDetail, isLoading: isLoadingRemovePaymentDetail }] =
    useRemovePaymentDetailMutation();

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

  async function onUpdatePayment(input: Partial<Payment> & { id: string }) {
    const promise = runAndHandleError(() => updatePayment(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando pago...",
      success: "Pago actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  async function onUpdatePaymentDetail(input: Partial<PaymentDetail> & { id: string }) {
    const promise = runAndHandleError(() => updatePaymentDetail(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando detalle de pago...",
      success: "Detalle de pago actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  async function onUpdatePaymentDetailsBatch(input: {
    paymentDetailIds: string[];
    paymentDate?: string;
    method?: PaymentDetailMethod;
  }) {
    const promise = runAndHandleError(() => updatePaymentDetailsBatch(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando detalles de pago...",
      success: "Detalles de pago actualizados exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  async function onRemovePaymentDetail(id: string) {
    const promise = runAndHandleError(() => removePaymentDetail(id).unwrap());
    toast.promise(promise, {
      loading: "Eliminando detalle de pago...",
      success: "Detalle de pago eliminado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  return {
    dataPaymentsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    paymentById,
    refetchPaymentById,
    isLoadingPaymentById,
    onCreatePayment,
    isSuccessCreatePayment,
    onCreatePaymentDetails,
    isSuccessCreatePaymentDetails,
    isLoadingCreatePaymentDetails,
    onUpdatePayment,
    isSuccessUpdatePayment,
    isLoadingUpdatePayment,
    onUpdatePaymentDetail,
    isSuccessUpdatePaymentDetail,
    isLoadingUpdatePaymentDetail,
    onUpdatePaymentDetailsBatch,
    isSuccessUpdatePaymentDetailsBatch,
    isLoadingUpdatePaymentDetailsBatch,
    onRemovePaymentDetail,
    isSuccessRemovePaymentDetail,
    isLoadingRemovePaymentDetail,
  };
};
