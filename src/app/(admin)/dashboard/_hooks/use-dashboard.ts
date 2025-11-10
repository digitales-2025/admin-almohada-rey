import {
  useGetAmenitiesByPriorityQuery,
  useGetAnnualStatisticsQuery,
  useGetAnnualSummaryFinanceQuery,
  useGetCustomerOriginSummaryQuery,
  useGetMonthlyBookingTrendQuery,
  useGetMonthlyCustomerOriginQuery,
  useGetMonthlyEarningsExpensesQuery,
  useGetNextPendingPaymentsQuery,
  useGetOccupationStatisticsPercentageByTypeQuery,
  useGetRecentReservationsQuery,
  useGetRoomOccupancyQuery,
  useGetTodayAvailableRoomsQuery,
  useGetTodayRecepcionistStatisticsQuery,
  useGetTop5PriorityPendingAmenitiesQuery,
  useGetTop5TodayCheckInQuery,
  useGetTop5TodayCheckOutQuery,
  useGetTop10CountriesCustomersQuery,
  useGetTop10ProvincesCustomersQuery,
  useGetWeekReservationsQuery,
} from "../_services/dashboardApi";

interface UseDashboardProps {
  year?: number;
  activeTab?: string;
  mode?: "admin" | "receptionist";
}

export const useDashboard = (options: UseDashboardProps = {}) => {
  const { year = new Date().getFullYear(), activeTab, mode = "admin" } = options;

  // ===== VARIABLES DE CONTROL =====
  const shouldLoadAdminData = mode === "admin";
  const shouldLoadReceptionistData = mode === "receptionist";
  const shouldLoadSummary = shouldLoadAdminData && (activeTab === "resumen" || !activeTab);
  const shouldLoadOccupancy = shouldLoadAdminData && (activeTab === "ocupacion" || !activeTab);
  const shouldLoadReservations = shouldLoadAdminData && (activeTab === "reservas" || !activeTab);
  const shouldLoadFinance = shouldLoadAdminData && (activeTab === "finanzas" || !activeTab);
  const shouldLoadOrigin = shouldLoadAdminData && (activeTab === "procedencia" || !activeTab);
  const shouldLoadToday = shouldLoadReceptionistData && (activeTab === "hoy" || !activeTab);
  const shouldLoadRooms = shouldLoadReceptionistData && (activeTab === "habitaciones" || !activeTab);
  const shouldLoadWeekReservations = shouldLoadReceptionistData && (activeTab === "semana-reservas" || !activeTab);
  const shouldLoadAmenities = shouldLoadReceptionistData && (activeTab === "amenidades" || !activeTab);

  // Estadísticas anuales (resumen)
  const {
    data: annualStatistics,
    isLoading: isLoadingAnnualStatistics,
    refetch: refetchAnnualStatistics,
  } = useGetAnnualStatisticsQuery(year, {
    skip: !shouldLoadSummary,
    refetchOnMountOrArgChange: true,
  });

  // Ganancias y gastos mensuales (resumen)
  const {
    data: monthlyEarningsExpenses,
    isLoading: isLoadingMonthlyEarningsExpenses,
    refetch: refetchMonthlyEarningsExpenses,
  } = useGetMonthlyEarningsExpensesQuery(year, {
    skip: !shouldLoadSummary,
    refetchOnMountOrArgChange: true,
  });

  // Mapa de ocupación de habitaciones (resumen, ocupación, habitaciones en receptionist)
  const shouldLoadRoomOccupancyForReceptionist = shouldLoadReceptionistData && shouldLoadRooms;
  const {
    data: roomOccupancy,
    isLoading: isLoadingRoomOccupancy,
    refetch: refetchRoomOccupancy,
  } = useGetRoomOccupancyQuery(undefined, {
    skip: !shouldLoadSummary && !shouldLoadOccupancy && !shouldLoadRoomOccupancyForReceptionist,
    refetchOnMountOrArgChange: true,
  });

  // Reservaciones recientes (resumen)
  const {
    data: recentReservations,
    isLoading: isLoadingRecentReservations,
    refetch: refetchRecentReservations,
  } = useGetRecentReservationsQuery(undefined, {
    skip: !shouldLoadSummary,
    refetchOnMountOrArgChange: true,
  });

  // Próximos pagos pendientes (resumen)
  const {
    data: nextPendingPayments,
    isLoading: isLoadingNextPendingPayments,
    refetch: refetchNextPendingPayments,
  } = useGetNextPendingPaymentsQuery(undefined, {
    skip: !shouldLoadSummary,
    refetchOnMountOrArgChange: true,
  });

  // Estadísticas de ocupación por tipo (ocupación)
  const {
    data: occupancyStatisticsPercentage,
    isLoading: isLoadingOccupancyStatisticsPercentage,
    refetch: refetchOccupancyStatisticsPercentage,
  } = useGetOccupationStatisticsPercentageByTypeQuery(year, {
    skip: !shouldLoadOccupancy,
    refetchOnMountOrArgChange: true,
  });

  // Tendencias de reservas mensuales (reservas)
  const {
    data: monthlyBookingTrend,
    isLoading: isLoadingMonthlyBookingTrend,
    refetch: refetchMonthlyBookingTrend,
  } = useGetMonthlyBookingTrendQuery(year, {
    skip: !shouldLoadReservations,
    refetchOnMountOrArgChange: true,
  });

  // Resumen financiero anual (finanzas)
  const {
    data: annualSummaryFinance,
    isLoading: isLoadingAnnualSummaryFinance,
    refetch: refetchAnnualSummaryFinance,
  } = useGetAnnualSummaryFinanceQuery(year, {
    skip: !shouldLoadFinance,
    refetchOnMountOrArgChange: true,
  });

  // Resumen de procedencia de clientes (procedencia)
  const {
    data: customerOriginSummary,
    isLoading: isLoadingCustomerOriginSummary,
    refetch: refetchCustomerOriginSummary,
  } = useGetCustomerOriginSummaryQuery(year, {
    skip: !shouldLoadOrigin,
    refetchOnMountOrArgChange: true,
  });

  // Procedencia mensual de clientes (procedencia)
  const {
    data: monthlyCustomerOrigin,
    isLoading: isLoadingMonthlyCustomerOrigin,
    refetch: refetchMonthlyCustomerOrigin,
  } = useGetMonthlyCustomerOriginQuery(year, {
    skip: !shouldLoadOrigin,
    refetchOnMountOrArgChange: true,
  });

  // Top 10 países de clientes (procedencia)
  const {
    data: top10CountriesCustomers,
    isLoading: isLoadingTop10CountriesCustomers,
    refetch: refetchTop10CountriesCustomers,
  } = useGetTop10CountriesCustomersQuery(year, {
    skip: !shouldLoadOrigin,
    refetchOnMountOrArgChange: true,
  });

  // Top 10 provincias de clientes (procedencia)
  const {
    data: top10ProvincesCustomers,
    isLoading: isLoadingTop10ProvincesCustomers,
    refetch: refetchTop10ProvincesCustomers,
  } = useGetTop10ProvincesCustomersQuery(year, {
    skip: !shouldLoadOrigin,
    refetchOnMountOrArgChange: true,
  });

  // ===== QUERIES PARA RECEPCIONISTA =====
  // Estadísticas de recepcionista para hoy (hoy)
  const {
    data: todayRecepcionistStatistics,
    isLoading: isLoadingTodayRecepcionistStatistics,
    refetch: refetchTodayRecepcionistStatistics,
  } = useGetTodayRecepcionistStatisticsQuery(undefined, {
    skip: !shouldLoadToday,
    refetchOnMountOrArgChange: true,
  });

  // Top 5 check-ins de hoy (hoy)
  const {
    data: top5TodayCheckIn,
    isLoading: isLoadingTop5TodayCheckIn,
    refetch: refetchTop5TodayCheckIn,
  } = useGetTop5TodayCheckInQuery(undefined, {
    skip: !shouldLoadToday,
    refetchOnMountOrArgChange: true,
  });

  // Top 5 check-outs de hoy (hoy)
  const {
    data: top5TodayCheckOut,
    isLoading: isLoadingTop5TodayCheckOut,
    refetch: refetchTop5TodayCheckOut,
  } = useGetTop5TodayCheckOutQuery(undefined, {
    skip: !shouldLoadToday,
    refetchOnMountOrArgChange: true,
  });

  // Top 5 amenidades pendientes por prioridad (hoy)
  const {
    data: top5PriorityPendingAmenities,
    isLoading: isLoadingTop5PriorityPendingAmenities,
    refetch: refetchTop5PriorityPendingAmenities,
  } = useGetTop5PriorityPendingAmenitiesQuery(undefined, {
    skip: !shouldLoadToday,
    refetchOnMountOrArgChange: true,
  });

  // Amenidades por prioridad (amenidades)
  const {
    data: amenitiesByPriority,
    isLoading: isLoadingAmenitiesByPriority,
    refetch: refetchAmenitiesByPriority,
  } = useGetAmenitiesByPriorityQuery(undefined, {
    skip: !shouldLoadAmenities,
    refetchOnMountOrArgChange: true,
  });

  // Habitaciones disponibles hoy (habitaciones)
  const {
    data: todayAvailableRooms,
    isLoading: isLoadingTodayAvailableRooms,
    refetch: refetchTodayAvailableRooms,
  } = useGetTodayAvailableRoomsQuery(undefined, {
    skip: !shouldLoadRooms,
    refetchOnMountOrArgChange: true,
  });

  // Reservas de la semana (semana-reservas)
  const {
    data: weekReservations,
    isLoading: isLoadingWeekReservations,
    refetch: refetchWeekReservations,
  } = useGetWeekReservationsQuery(undefined, {
    skip: !shouldLoadWeekReservations,
    refetchOnMountOrArgChange: true,
  });

  // Estados de carga organizados por categoría
  const isLoadingSummary =
    shouldLoadSummary &&
    (isLoadingAnnualStatistics ||
      isLoadingMonthlyEarningsExpenses ||
      isLoadingRoomOccupancy ||
      isLoadingRecentReservations ||
      isLoadingNextPendingPayments);

  const isLoadingOccupancy = shouldLoadOccupancy && isLoadingOccupancyStatisticsPercentage;

  const isLoadingReservations = shouldLoadReservations && isLoadingMonthlyBookingTrend;

  const isLoadingFinance = shouldLoadFinance && isLoadingAnnualSummaryFinance;

  const isLoadingOrigin =
    shouldLoadOrigin &&
    (isLoadingCustomerOriginSummary ||
      isLoadingMonthlyCustomerOrigin ||
      isLoadingTop10CountriesCustomers ||
      isLoadingTop10ProvincesCustomers);

  const isLoadingToday =
    shouldLoadToday &&
    (isLoadingTodayRecepcionistStatistics ||
      isLoadingTop5TodayCheckIn ||
      isLoadingTop5TodayCheckOut ||
      isLoadingTop5PriorityPendingAmenities);

  const isLoadingRooms = shouldLoadRooms && (isLoadingTodayAvailableRooms || isLoadingRoomOccupancy);

  const isLoadingWeekReservationsData = shouldLoadWeekReservations && isLoadingWeekReservations;

  const isLoadingAmenities = shouldLoadAmenities && isLoadingAmenitiesByPriority;

  // Estado de carga general
  const isLoading =
    isLoadingSummary ||
    isLoadingOccupancy ||
    isLoadingReservations ||
    isLoadingFinance ||
    isLoadingOrigin ||
    isLoadingToday ||
    isLoadingRooms ||
    isLoadingWeekReservationsData ||
    isLoadingAmenities;

  return {
    // Datos organizados por categoría
    data: {
      // Admin - Resumen
      annualStatistics,
      monthlyEarningsExpenses,
      roomOccupancy,
      recentReservations,
      nextPendingPayments,

      // Admin - Ocupación
      occupancyStatisticsPercentage,

      // Admin - Reservas
      monthlyBookingTrend,

      // Admin - Finanzas
      annualSummaryFinance,

      // Admin - Procedencia
      customerOriginSummary,
      monthlyCustomerOrigin,
      top10CountriesCustomers,
      top10ProvincesCustomers,

      // Recepcionista - Hoy
      todayRecepcionistStatistics,
      top5TodayCheckIn,
      top5TodayCheckOut,
      top5PriorityPendingAmenities,

      // Recepcionista - Habitaciones
      todayAvailableRooms,

      // Recepcionista - Reservas
      weekReservations,

      // Recepcionista - Amenidades
      amenitiesByPriority,
    },

    // Estados de carga organizados
    loading: {
      general: isLoading,
      summary: isLoadingSummary,
      occupancy: isLoadingOccupancy,
      reservations: isLoadingReservations,
      finance: isLoadingFinance,
      origin: isLoadingOrigin,
      today: isLoadingToday,
      rooms: isLoadingRooms,
      weekReservations: isLoadingWeekReservationsData,
      amenities: isLoadingAmenities,
    },

    // Funciones de actualización (solo las más importantes)
    refetch: {
      summary: () => {
        refetchAnnualStatistics();
        refetchMonthlyEarningsExpenses();
        refetchRoomOccupancy();
        refetchRecentReservations();
        refetchNextPendingPayments();
      },
      occupancy: refetchOccupancyStatisticsPercentage,
      reservations: refetchMonthlyBookingTrend,
      finance: refetchAnnualSummaryFinance,
      origin: () => {
        refetchCustomerOriginSummary();
        refetchMonthlyCustomerOrigin();
        refetchTop10CountriesCustomers();
        refetchTop10ProvincesCustomers();
      },
      today: () => {
        refetchTodayRecepcionistStatistics();
        refetchTop5TodayCheckIn();
        refetchTop5TodayCheckOut();
        refetchTop5PriorityPendingAmenities();
      },
      rooms: refetchTodayAvailableRooms,
      weekReservations: refetchWeekReservations,
      amenities: refetchAmenitiesByPriority,
    },
  };
};
