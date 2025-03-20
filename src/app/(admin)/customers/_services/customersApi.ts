import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Customer } from "../_types/customer";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer"],
  endpoints: (build) => ({
    //Crear clientes
    createCustomer: build.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Actualizar clientes
    updateCustomer: build.mutation<Customer, Partial<Customer> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Obtener cliente por id
    getCustomerById: build.query<Customer, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    //Obtener todos los clientes
    getAllCustomers: build.query<Customer[], void>({
      query: () => ({
        url: "/customers",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Customer"],
    }),
    //Eliminar clientes
    deleteCustomers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/customers/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
    //Activar clientes
    reactivateCustomers: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/customers/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetCustomerByIdQuery,
  useGetAllCustomersQuery,
  useDeleteCustomersMutation,
  useReactivateCustomersMutation,
} = customersApi;
