import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import {
  AnnualAdministratorStatistics,
  MonthlyBookingTrend,
  MonthlyEarningsAndExpenses,
  NextPendingPayments,
  OccupationStatisticsPercentage,
  RecentReservations,
  RoomOccupancyMap,
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

    getOccupationStatisticsPercentageByType: build.query<OccupationStatisticsPercentage[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/occupation-statistics`,
        method: "GET",
        params: { year },
        credentials: "include",
      }),
      providesTags: ["Dashboard"],
    }),

    getMonthlyBookingTrend: build.query<MonthlyBookingTrend[], number | void>({
      query: (year = new Date().getFullYear()) => ({
        url: `dashboard/booking-trends`,
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
} = dashboardApi;
