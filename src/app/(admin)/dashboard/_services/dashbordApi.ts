import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import {
  AnnualAdministratorStatistics,
  CustomerOriginSummary,
  MonthlyBookingTrend,
  MonthlyCustomerOrigin,
  MonthlyEarningsAndExpenses,
  NextPendingPayments,
  OccupationStatisticsPercentage,
  RecentReservations,
  RoomOccupancyMap,
  SummaryFinance,
  Top10CountriesProvinces,
} from "../_types/dashboard";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Dashboard"],
  endpoints: (build) => ({
    // Obtener estadísticas administrativas anuales
    getAnnualStatistics: build.query<AnnualAdministratorStatistics, number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/annual-statistics`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener ganancias y gastos mensuales
    getMonthlyEarningsExpenses: build.query<MonthlyEarningsAndExpenses[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/monthly-earnings-expenses`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener mapa de ocupación de habitaciones
    getRoomOccupancy: build.query<RoomOccupancyMap, void>({
      query: () => ({
        url: `dashboard/room-occupancy`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener reservaciones recientes y del día actual
    getRecentReservations: build.query<RecentReservations, void>({
      query: () => ({
        url: `dashboard/recent-reservations`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener próximos pagos pendientes
    getNextPendingPayments: build.query<NextPendingPayments, void>({
      query: () => ({
        url: `dashboard/next-pending-payments`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener estadísticas de ocupación por tipo
    getOccupationStatisticsPercentageByType: build.query<OccupationStatisticsPercentage[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/occupation-statistics`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener tendencia de reservas mensuales
    getMonthlyBookingTrend: build.query<MonthlyBookingTrend[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/booking-trends`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener resumen financiero anual
    getAnnualSummaryFinance: build.query<SummaryFinance, number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/summary-finance`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener resumen de origen de clientes
    getCustomerOriginSummary: build.query<CustomerOriginSummary, number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/customer-origin`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener tendencia de origen de clientes mensuales
    getMonthlyCustomerOrigin: build.query<MonthlyCustomerOrigin[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/monthly-customer-origin`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener top 10 países
    getTop10CountriesCustomers: build.query<Top10CountriesProvinces[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/top-countries`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    // Obtener top 10 provincias
    getTop10ProvincesCustomers: build.query<Top10CountriesProvinces[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/top-provinces`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAnnualStatisticsQuery,
  useGetMonthlyEarningsExpensesQuery,
  useGetRoomOccupancyQuery,
  useGetRecentReservationsQuery,
  useGetNextPendingPaymentsQuery,
  useGetOccupationStatisticsPercentageByTypeQuery,
  useGetMonthlyBookingTrendQuery,
  useGetAnnualSummaryFinanceQuery,
  useGetCustomerOriginSummaryQuery,
  useGetMonthlyCustomerOriginQuery,
  useGetTop10CountriesCustomersQuery,
  useGetTop10ProvincesCustomersQuery,
} = dashboardApi;
