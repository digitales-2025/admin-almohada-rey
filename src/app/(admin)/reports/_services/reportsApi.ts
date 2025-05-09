import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { DownloadReportParams } from "../../reports/interfaces/dowloadParams";

// API para reportes de Excel (profit, expense, balance)
export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    // Endpoint para descargar el reporte de profit (ganancias)
    downloadProfitReport: build.query<Blob, DownloadReportParams>({
      query: ({ month, year }) => ({
        // Endpoint del backend con parámetros de mes y año
        url: `/reports/profit?month=${month}&year=${year}`,
        method: "GET",
        // Convierte la respuesta en un archivo Blob (Excel)
        responseHandler: async (response: Response) => await response.blob(),
        credentials: "include",
      }),
    }),
    // Endpoint para descargar el reporte de expense (gastos)
    downloadExpenseReport: build.query<Blob, DownloadReportParams>({
      query: ({ month, year }) => ({
        url: `/reports/expense?month=${month}&year=${year}`,
        method: "GET",
        responseHandler: async (response: Response) => await response.blob(),
        credentials: "include",
      }),
    }),
    // Endpoint para descargar el reporte de balance (ganancias y gastos)
    downloadBalanceReport: build.query<Blob, DownloadReportParams>({
      query: ({ month, year }) => ({
        url: `/reports/balance?month=${month}&year=${year}`,
        method: "GET",
        responseHandler: async (response: Response) => await response.blob(),
        credentials: "include",
      }),
    }),
  }),
});

// Hooks para disparar la descarga de cada reporte desde los componentes
export const {
  useLazyDownloadProfitReportQuery,
  useLazyDownloadExpenseReportQuery,
  useLazyDownloadBalanceReportQuery,
} = reportsApi;
