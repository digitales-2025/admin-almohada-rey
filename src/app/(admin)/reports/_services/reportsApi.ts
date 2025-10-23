import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import {
  DownloadReportParams,
  DownloadReportTypeRoomParams,
  isCompareParams,
  isDateRangeParams,
  isTypeRoomCompareParams,
  isTypeRoomDateRangeParams,
} from "../../reports/interfaces/dowloadParams";

// API para reportes de Excel (profit, expense, balance)
export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    // Endpoint para descargar el reporte de profit (ganancias)
    downloadProfitReport: build.query<Blob, DownloadReportParams>({
      query: (params) => {
        let url = "/reports/profit?";

        if (isDateRangeParams(params)) {
          url += `startDate=${params.startDate}&endDate=${params.endDate}`;
        } else if (isCompareParams(params)) {
          url += `year1=${params.year1}&year2=${params.year2}`;
        }

        return {
          url,
          method: "GET",
          responseHandler: async (response: Response) => await response.blob(),
          credentials: "include",
        };
      },
    }),
    // Endpoint para descargar el reporte de expense (gastos)
    downloadExpenseReport: build.query<Blob, DownloadReportParams>({
      query: (params) => {
        let url = "/reports/expense?";

        if (isDateRangeParams(params)) {
          url += `startDate=${params.startDate}&endDate=${params.endDate}`;
        } else if (isCompareParams(params)) {
          url += `year1=${params.year1}&year2=${params.year2}`;
        }

        return {
          url,
          method: "GET",
          responseHandler: async (response: Response) => await response.blob(),
          credentials: "include",
        };
      },
    }),

    // Endpoint para descargar el reporte de balance (ganancias y gastos)
    downloadBalanceReport: build.query<Blob, DownloadReportParams>({
      query: (params) => {
        let url = "/reports/balance?";

        if (isDateRangeParams(params)) {
          url += `startDate=${params.startDate}&endDate=${params.endDate}`;
        } else if (isCompareParams(params)) {
          url += `year1=${params.year1}&year2=${params.year2}`;
        }

        return {
          url,
          method: "GET",
          responseHandler: async (response: Response) => await response.blob(),
          credentials: "include",
        };
      },
    }),

    // Endpoint para descargar el reporte de profit por tipo de habitación
    downloadProfitTypeRoomReport: build.query<Blob, DownloadReportTypeRoomParams>({
      query: (params) => {
        let url = "/reports/profitRoomType?";

        if (isTypeRoomDateRangeParams(params)) {
          url += `startDate=${params.startDate}&endDate=${params.endDate}&typeRoomId=${params.typeRoomId}`;
        } else if (isTypeRoomCompareParams(params)) {
          url += `year1=${params.year1}&year2=${params.year2}&typeRoomId=${params.typeRoomId}`;
        }

        return {
          url,
          method: "GET",
          responseHandler: async (response: Response) => await response.blob(),
          credentials: "include",
        };
      },
    }),

    // Endpoint para descargar el reporte de ocupación
    downloadOccupancyReport: build.query<Blob, DownloadReportParams>({
      query: (params) => {
        let url = "/reports/occupancy?";

        if (isDateRangeParams(params)) {
          url += `startDate=${params.startDate}&endDate=${params.endDate}`;
        } else if (isCompareParams(params)) {
          url += `year1=${params.year1}&year2=${params.year2}`;
        }

        return {
          url,
          method: "GET",
          responseHandler: async (response: Response) => await response.blob(),
          credentials: "include",
        };
      },
    }),
  }),
});

// Hooks para disparar la descarga de cada reporte desde los componentes
export const {
  useLazyDownloadProfitReportQuery,
  useLazyDownloadExpenseReportQuery,
  useLazyDownloadBalanceReportQuery,
  useLazyDownloadProfitTypeRoomReportQuery,
  useLazyDownloadOccupancyReportQuery,
} = reportsApi;
