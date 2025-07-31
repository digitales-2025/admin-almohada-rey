import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { CreateUsersSchema, UpdateUsersSchema } from "../_schema/createUsersSchema";
import { SendNewPasswordSchema } from "../_schema/sendNewPasswordSchema";
import { User } from "../_types/user";

interface UserUpdate {
  data: User;
  message: string;
  statusCode: number;
}

export type PaginatedUserParams = PaginatedQueryParams<User>;

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (build) => ({
    // Crear un nuevo usuario
    createUser: build.mutation<CreateUsersSchema, CreateUsersSchema>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),

    // Actualizar información del usuario por id del parametro /users/:id
    updateUser: build.mutation<UserUpdate, UpdateUsersSchema & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["Users"],
    }),

    // Eliminar varios usuarios
    deleteUsers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: "users/deactivate/all",
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),

    // Reactivar varios usuarios
    reactivateUsers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: "users/reactivate/all",
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),

    // Mostrar todos los usuarios
    getUsers: build.query<User[], void>({
      query: () => ({
        url: "users",
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),

    getPaginatedUsers: build.query<PaginatedResponse<User>, PaginatedUserParams>({
      query: ({ pagination: { page = 1, pageSize = 10 } }) => ({
        url: "/users/paginated",
        method: "GET",
        params: { page, pageSize },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Users", id: result?.meta.page },
        ...(result?.data.map(({ id }) => ({ type: "Users" as const, id })) ?? []),
      ],
    }),

    // Generar una constraseña
    generatePassword: build.mutation({
      query: () => ({
        url: "users/generate-password",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),

    // Enviar un correo con una nueva contraseña
    sendNewPassword: build.mutation<
      SendNewPasswordSchema & { email: string },
      SendNewPasswordSchema & { email: string }
    >({
      query: (data) => ({
        url: "users/send-new-password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetPaginatedUsersQuery,
  useGeneratePasswordMutation,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useReactivateUsersMutation,
  useSendNewPasswordMutation,
} = usersApi;
