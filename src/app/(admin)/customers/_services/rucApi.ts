import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { rucQueryResponse } from "../_types/api-external-queries";

export const rucApi = createApi({
  reducerPath: "rucApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Ruc"],
  endpoints: (build) => ({
    // Obtener datos de RUC desde SUNAT
    getDataByRuc: build.query<rucQueryResponse, string>({
      query: (ruc) => ({
        url: `/ruc/${ruc}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Ruc"],
    }),
  }),
});

export const { useGetDataByRucQuery } = rucApi;
