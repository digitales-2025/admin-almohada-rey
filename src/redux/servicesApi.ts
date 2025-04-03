import { createApi } from "@reduxjs/toolkit/query/react";

import { Service } from "@/types/services";
import baseQueryWithReauth from "@/utils/baseQuery";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Services"],
  endpoints: (build) => ({
    //Actualizar servicios
    updateService: build.mutation<Service, Partial<Service> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Services"],
    }),
    //Obtener servicio por id
    getServiceById: build.query<Service, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Services", id }],
    }),
    //Obtener todos los servicios
    getAllServices: build.query<Service[], void>({
      query: () => ({
        url: "/services",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Services"],
    }),
  }),
});

export const { useUpdateServiceMutation, useGetServiceByIdQuery, useGetAllServicesQuery } = servicesApi;
