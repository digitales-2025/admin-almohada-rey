import { toast } from "sonner";

import { useLogout } from "@/app/(auth)/log-in/_hooks/use-logout";
import { CustomErrorData } from "@/types/error";
import { translateError } from "@/utils/translateError";
import { useProfileQuery, useUpdatePasswordMutation } from "../_services/adminApi";
import { FormUpdateSecurityProps } from "../_types/form";
import { UpdateUsersSchema } from "../../users/_schema/createUsersSchema";
import { useUpdateUserMutation } from "../../users/_services/usersApi";
import { User } from "../../users/_types/user";
import { useAuth } from "./use-auth";

export const useProfile = () => {
  const { setUser } = useAuth();
  const { signOut } = useLogout();

  const { data: user, refetch } = useProfileQuery();
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();

  const onUpdate = async (dataForm: UpdateUsersSchema) => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          if (!user) {
            return reject(new Error("No se encontró el usuario"));
          }
          const result = await updateUser({
            id: user.id,
            ...dataForm,
          });
          if (result.error && typeof result.error === "object" && "data" in result.error) {
            const error = (result.error.data as CustomErrorData).message;
            const message = translateError(error as string);
            reject(new Error(message));
          }
          resolve(result);
          setUser(result?.data?.data as User);
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Actualizando información...",
      success: "información actualizado correctamente",
      error: (error) => error.message,
    });
  };

  const [updatePassword, { isLoading: isLoadingUpdatePassword }] = useUpdatePasswordMutation();

  const onUpdatePassword = async (data: FormUpdateSecurityProps) => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await updatePassword(data);
          if (result.error && typeof result.error === "object" && "data" in result.error) {
            const error = (result.error.data as CustomErrorData).message;

            const message = translateError(error as string);
            reject(new Error(message));
            return;
          }
          resolve(result);
          signOut();
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Actualizando contraseña...",
      success: "Contraseña actualizada correctamente",
      error: (error) => error.message,
    });
  };

  return {
    user,
    onUpdate,
    refetch,
    isLoading,
    isSuccess,
    onUpdatePassword,
    isLoadingUpdatePassword,
  };
};
