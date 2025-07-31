import { toast } from "sonner";

import { CustomErrorData } from "@/types/error";
import { runAndHandleError } from "@/utils/baseQuery";
import { translateError } from "@/utils/translateError";
import { CreateUsersSchema, UpdateUsersSchema } from "../_schema/createUsersSchema";
import { SendNewPasswordSchema } from "../_schema/sendNewPasswordSchema";
import {
  PaginatedUserParams,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useGeneratePasswordMutation,
  useGetPaginatedUsersQuery,
  useGetUsersQuery,
  useReactivateUsersMutation,
  useSendNewPasswordMutation,
  useUpdateUserMutation,
} from "../_services/usersApi";
import { User } from "../_types/user";

export const useUsers = () => {
  const { data, error, isLoading } = useGetUsersQuery();
  const [generatePassword, { data: password }] = useGeneratePasswordMutation();
  const [createUser, { isSuccess: isSuccessCreateUser }] = useCreateUserMutation();
  const [updateUser, { isSuccess: isSuccessUpdateUser, isLoading: isLoadingUpdateUser }] = useUpdateUserMutation();
  const [deleteUsers, { isSuccess: isSuccessDeleteUsers }] = useDeleteUsersMutation();

  const [reactivateUsers, { isSuccess: isSuccessReactivateUsers, isLoading: isLoadingReactivateUsers }] =
    useReactivateUsersMutation();

  const [
    sendNewPassword,
    { data: dataSendNewPassword, isSuccess: isSuccessSendNewPassword, isLoading: isLoadingSendNewPasswrod },
  ] = useSendNewPasswordMutation();

  const handleGeneratePassword = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await generatePassword(null);
          if (result.error && typeof result.error === "object" && "data" in result.error) {
            const error = (result.error.data as CustomErrorData).message;
            const message = translateError(error as string);
            reject(new Error(message));
          }
          if (result.error) {
            reject(new Error("Ocurrió un error inesperado, por favor intenta de nuevo"));
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Generando...",
      success: "Contraseña generada",
      error: (error) => error.message,
    });
  };

  async function onCreateUser(input: CreateUsersSchema) {
    const promise = runAndHandleError(() => createUser(input).unwrap());
    toast.promise(promise, {
      loading: "Creando y Enviando correo...",
      success: "Usuario creado y envío exitoso.",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateUser(input: UpdateUsersSchema & { id: string }) {
    const promise = runAndHandleError(() => updateUser(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando usuario...",
      success: "Usuario actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  const onDeleteUsers = async (ids: User[]) => {
    const onlyIds = ids.map((user) => user.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => deleteUsers(idsString).unwrap());

    toast.promise(promise, {
      loading: "Eliminando...",
      success: "Usuarios eliminados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onReactivateUsers = async (ids: User[]) => {
    const onlyIds = ids.map((user) => user.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => reactivateUsers(idsString).unwrap());

    toast.promise(promise, {
      loading: "Reactivando...",
      success: "Usuarios reactivados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onSendNewPassword = async (data: SendNewPasswordSchema & { email: string }) => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const result = await sendNewPassword(data);
          if (result.error && typeof result.error === "object" && "data" in result.error) {
            const error = (result.error.data as CustomErrorData).message;
            const message = translateError(error as string);
            reject(new Error(message));
          }
          if (result.error) {
            reject(new Error("Ocurrió un error inesperado, por favor intenta de nuevo"));
          }

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Enviando correo...",
      success: "Envío exitoso.",
      error: (error) => error.message,
    });
  };

  return {
    data,
    error,
    isLoading,
    handleGeneratePassword,
    password,
    onCreateUser,
    isSuccessCreateUser,
    onDeleteUsers,
    isSuccessDeleteUsers,
    onReactivateUsers,
    isSuccessReactivateUsers,
    isLoadingReactivateUsers,
    onUpdateUser,
    isSuccessUpdateUser,
    isLoadingUpdateUser,
    onSendNewPassword,
    isSuccessSendNewPassword,
    isLoadingSendNewPasswrod,
    dataSendNewPassword,
  };
};

interface UsePaginatedUsersProps {
  page?: number;
  pageSize?: number;
}

export const usePaginatedUsers = (options: UsePaginatedUsersProps = {}) => {
  const { page = 1, pageSize = 10 } = options;

  const paginationParams: PaginatedUserParams = {
    pagination: { page, pageSize },
  };

  const {
    data: paginatedUsers,
    isLoading: isLoadingPaginatedUsers,
    refetch: refetchPaginatedUsers,
  } = useGetPaginatedUsersQuery(paginationParams, {
    skip: !paginationParams,
    refetchOnMountOrArgChange: true,
  });

  return {
    paginatedUsers,
    isLoadingPaginatedUsers,
    refetchPaginatedUsers,
  };
};
