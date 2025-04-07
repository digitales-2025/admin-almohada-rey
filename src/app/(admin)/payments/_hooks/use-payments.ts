import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { useCreatePaymentMutation } from "../_services/paymentsApi";
import { Payment } from "../_types/payment";

export const usePayments = () => {
  const [createPayment, { isSuccess: isSuccessCreatePayment }] = useCreatePaymentMutation();

  async function onCreatePayment(input: Partial<Payment>) {
    const promise = runAndHandleError(() => createPayment(input).unwrap());
    toast.promise(promise, {
      loading: "Creando pago...",
      success: "Pago creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  return {
    onCreatePayment,
    isSuccessCreatePayment,
  };
};
