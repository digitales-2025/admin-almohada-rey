import {
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
  useGetTodayRecepcionistStatisticsQuery,
  useGetTop5PriorityPendingAmenitiesQuery,
  useGetTop5TodayCheckInQuery,
  useGetTop5TodayCheckOutQuery,
  useGetTop10CountriesCustomersQuery,
  useGetTop10ProvincesCustomersQuery,
} from "../_services/dashboardApi";

interface UseDashboardProps {
  year?: number;
  yearReservation?: number;
  yearFinance?: number;
  yearOrigin?: number;
  activeTab?: string;
}

export const useDashboard = (options: UseDashboardProps = {}) => {
  const { year, yearReservation, yearFinance, yearOrigin, activeTab } = options;

  // Estadísticas anuales
  const {
    data: annualStatistics,
    isLoading: isLoadingAnnualStatistics,
    refetch: refetchAnnualStatistics,
  } = useGetAnnualStatisticsQuery(year, {
    skip: !year,
    refetchOnMountOrArgChange: true,
  });

  // Ganancias y gastos mensuales
  const {
    data: monthlyEarningsExpenses,
    isLoading: isLoadingMonthlyEarningsExpenses,
    refetch: refetchMonthlyEarningsExpenses,
  } = useGetMonthlyEarningsExpensesQuery(year, {
    skip: !year,
    refetchOnMountOrArgChange: true,
  });

  // Mapa de ocupación de habitaciones
  const {
    data: roomOccupancy,
    isLoading: isLoadingRoomOccupancy,
    refetch: refetchRoomOccupancy,
  } = useGetRoomOccupancyQuery(undefined, {
    skip: activeTab !== "habitaciones" && activeTab !== "ocupacion",
    refetchOnMountOrArgChange: true,
  });

  // Reservaciones recientes
  const {
    data: recentReservations,
    isLoading: isLoadingRecentReservations,
    refetch: refetchRecentReservations,
  } = useGetRecentReservationsQuery(undefined, {
    skip: activeTab !== "resumen",
    refetchOnMountOrArgChange: true,
  });

  // Próximos pagos pendientes
  const {
    data: nextPendingPayments,
    isLoading: isLoadingNextPendingPayments,
    refetch: refetchNextPendingPayments,
  } = useGetNextPendingPaymentsQuery(undefined, {
    skip: activeTab !== "resumen",
    refetchOnMountOrArgChange: true,
  });

  const {
    data: occupancyStatisticsPercentage,
    isLoading: isLoadingOccupancyStatisticsPercentage,
    refetch: refetchOccupancyStatisticsPercentage,
  } = useGetOccupationStatisticsPercentageByTypeQuery(year, {
    skip: !year,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: monthlyBookingTrend,
    isLoading: isLoadingMonthlyBookingTrend,
    refetch: refetchMonthlyBookingTrend,
  } = useGetMonthlyBookingTrendQuery(yearReservation, {
    skip: !yearReservation,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: annualSummaryFinance,
    isLoading: isLoadingAnnualSummaryFinance,
    refetch: refetchAnnualSummaryFinance,
  } = useGetAnnualSummaryFinanceQuery(yearFinance, {
    skip: !yearFinance,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: customerOriginSummary,
    isLoading: isLoadingCustomerOriginSummary,
    refetch: refetchCustomerOriginSummary,
  } = useGetCustomerOriginSummaryQuery(yearOrigin, {
    skip: !yearOrigin,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: monthlyCustomerOrigin,
    isLoading: isLoadingMonthlyCustomerOrigin,
    refetch: refetchMonthlyCustomerOrigin,
  } = useGetMonthlyCustomerOriginQuery(yearOrigin, {
    skip: !yearOrigin,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: top10CountriesCustomers,
    isLoading: isLoadingTop10CountriesCustomers,
    refetch: refetchTop10CountriesCustomers,
  } = useGetTop10CountriesCustomersQuery(yearOrigin, {
    skip: !yearOrigin,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: top10ProvincesCustomers,
    isLoading: isLoadingTop10ProvincesCustomers,
    refetch: refetchTop10ProvincesCustomers,
  } = useGetTop10ProvincesCustomersQuery(yearOrigin, {
    skip: !yearOrigin,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: todayRecepcionistStatistics,
    isLoading: isLoadingTodayRecepcionistStatistics,
    refetch: refetchTodayRecepcionistStatistics,
  } = useGetTodayRecepcionistStatisticsQuery(undefined, {
    skip: activeTab !== "hoy",
    refetchOnMountOrArgChange: true,
  });

  const {
    data: top5TodayCheckIn,
    isLoading: isLoadingTop5TodayCheckIn,
    refetch: refetchTop5TodayCheckIn,
  } = useGetTop5TodayCheckInQuery(undefined, {
    skip: activeTab !== "hoy",
    refetchOnMountOrArgChange: true,
  });

  const {
    data: top5TodayCheckOut,
    isLoading: isLoadingTop5TodayCheckOut,
    refetch: refetchTop5TodayCheckOut,
  } = useGetTop5TodayCheckOutQuery(undefined, {
    skip: activeTab !== "hoy",
    refetchOnMountOrArgChange: true,
  });

  const {
    data: top5PriorityPendingAmenities,
    isLoading: isLoadingTop5PriorityPendingAmenities,
    refetch: refetchTop5PriorityPendingAmenities,
  } = useGetTop5PriorityPendingAmenitiesQuery(undefined, {
    skip: activeTab !== "hoy",
    refetchOnMountOrArgChange: true,
  });

  // Estado de carga combinado
  const isLoading =
    isLoadingAnnualStatistics ||
    isLoadingMonthlyEarningsExpenses ||
    isLoadingRoomOccupancy ||
    isLoadingRecentReservations ||
    isLoadingNextPendingPayments ||
    isLoadingOccupancyStatisticsPercentage;

  const isLoadingOrigin =
    isLoadingCustomerOriginSummary ||
    isLoadingMonthlyCustomerOrigin ||
    isLoadingTop10CountriesCustomers ||
    isLoadingTop10ProvincesCustomers;

  const isLoadingTodayRecepcionist =
    isLoadingTodayRecepcionistStatistics ||
    isLoadingTop5TodayCheckIn ||
    isLoadingTop5TodayCheckOut ||
    isLoadingTop5PriorityPendingAmenities;

  return {
    // Datos
    annualStatistics,
    monthlyEarningsExpenses,
    roomOccupancy,
    recentReservations,
    nextPendingPayments,
    occupancyStatisticsPercentage,
    monthlyBookingTrend,
    annualSummaryFinance,
    customerOriginSummary,
    monthlyCustomerOrigin,
    top10CountriesCustomers,
    top10ProvincesCustomers,
    todayRecepcionistStatistics,
    top5TodayCheckIn,
    top5TodayCheckOut,
    top5PriorityPendingAmenities,

    // Estados de carga
    isLoadingAnnualStatistics,
    isLoadingMonthlyEarningsExpenses,
    isLoadingRoomOccupancy,
    isLoadingRecentReservations,
    isLoadingNextPendingPayments,
    isLoadingOccupancyStatisticsPercentage,
    isLoading,
    isLoadingMonthlyBookingTrend,
    isLoadingAnnualSummaryFinance,
    isLoadingOrigin,
    isLoadingCustomerOriginSummary,
    isLoadingMonthlyCustomerOrigin,
    isLoadingTop10CountriesCustomers,
    isLoadingTop10ProvincesCustomers,
    isLoadingTodayRecepcionist,
    isLoadingTodayRecepcionistStatistics,
    isLoadingTop5TodayCheckIn,
    isLoadingTop5TodayCheckOut,
    isLoadingTop5PriorityPendingAmenities,

    // Funciones de actualización
    refetchAnnualStatistics,
    refetchMonthlyEarningsExpenses,
    refetchRoomOccupancy,
    refetchRecentReservations,
    refetchNextPendingPayments,
    refetchOccupancyStatisticsPercentage,
    refetchMonthlyBookingTrend,
    refetchAnnualSummaryFinance,
    refetchCustomerOriginSummary,
    refetchMonthlyCustomerOrigin,
    refetchTop10CountriesCustomers,
    refetchTop10ProvincesCustomers,
    refetchTodayRecepcionistStatistics,
    refetchTop5TodayCheckIn,
    refetchTop5TodayCheckOut,
    refetchTop5PriorityPendingAmenities,
  };
};
