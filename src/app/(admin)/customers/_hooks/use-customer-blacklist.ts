import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import { useToggleBlacklistMutation } from "../_services/customersApi";
import { Customer } from "../_types/customer";

interface ToggleBlacklistInput {
  id: string;
  isBlacklist: boolean;
  blacklistReason?: string;
  blacklistDate?: string;
}

export const useCustomerBlacklist = () => {
  const [toggleBlacklist, { isSuccess: isSuccessToggleBlacklist, isLoading: isLoadingToggleBlacklist }] =
    useToggleBlacklistMutation();

  const onToggleBlacklist = async (input: ToggleBlacklistInput): Promise<Customer> => {
    const promise = runAndHandleError(() => toggleBlacklist(input).unwrap());

    toast.promise(promise, {
      loading: input.isBlacklist
        ? "Agregando cliente a la lista negra..."
        : "Removiendo cliente de la lista negra...",
      success: input.isBlacklist
        ? "Cliente agregado a la lista negra correctamente"
        : "Cliente removido de la lista negra correctamente",
      error: (error) => error.message,
    });

    return await promise;
  };

  return {
    onToggleBlacklist,
    isSuccessToggleBlacklist,
    isLoadingToggleBlacklist,
  };
};

