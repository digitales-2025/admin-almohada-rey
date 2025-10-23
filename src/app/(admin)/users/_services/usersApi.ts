import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { AdvancedPaginationParams } from "@/types/query-filters/advanced-pagination";
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

    getPaginatedUsers: build.query<PaginatedResponse<User>, PaginatedUserParams | AdvancedPaginationParams>({
      query: (params) => {
        // Detectar si es el formato nuevo (AdvancedPaginationParams) o el formato viejo (PaginatedUserParams)
        const isAdvancedFormat = "filters" in params && "sort" in params;

        if (isAdvancedFormat) {
          // Formato avanzado
          const { pagination, filters, sort } = params as AdvancedPaginationParams;
          return {
            url: "/users/paginated",
            method: "GET",
            params: {
              page: pagination.page,
              pageSize: pagination.pageSize,
              ...(filters?.search && { search: filters.search }),
              ...(filters?.isActive && {
                isActive: Array.isArray(filters.isActive) ? filters.isActive.join(",") : filters.isActive,
              }),
              ...(filters?.userRol && {
                userRol: Array.isArray(filters.userRol) ? filters.userRol.join(",") : filters.userRol,
              }),
              ...(sort?.sortBy && { sortBy: sort.sortBy }),
              ...(sort?.sortOrder && { sortOrder: sort.sortOrder }),
            },
            credentials: "include",
          };
        } else {
          // Formato original (compatibilidad hacia atrás)
          const {
            pagination: { page = 1, pageSize = 10 },
          } = params as PaginatedUserParams;
          return {
            url: "/users/paginated",
            method: "GET",
            params: { page, pageSize },
            credentials: "include",
          };
        }
      },
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
