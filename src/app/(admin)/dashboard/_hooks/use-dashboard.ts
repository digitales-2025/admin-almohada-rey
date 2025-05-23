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
  useGetTop10CountriesCustomersQuery,
  useGetTop10ProvincesCustomersQuery,
} from "../_services/dashbordApi";

interface UseDashboardProps {
  year?: number;
  yearReservation?: number;
  yearFinance?: number;
  yearOrigin?: number;
}

export const useDashboard = (options: UseDashboardProps = {}) => {
  const { year, yearReservation, yearFinance, yearOrigin } = options;

  // Estadísticas anuales
  const {
    data: annualStatistics,
    isLoading: isLoadingAnnualStatistics,
    refetch: refetchAnnualStatistics,
  } = useGetAnnualStatisticsQuery(year, {
    skip: !year,
  });

  // Ganancias y gastos mensuales
  const {
    data: monthlyEarningsExpenses,
    isLoading: isLoadingMonthlyEarningsExpenses,
    refetch: refetchMonthlyEarningsExpenses,
  } = useGetMonthlyEarningsExpensesQuery(year, {
    skip: !year,
  });

  // Mapa de ocupación de habitaciones
  const {
    data: roomOccupancy,
    isLoading: isLoadingRoomOccupancy,
    refetch: refetchRoomOccupancy,
  } = useGetRoomOccupancyQuery();

  // Reservaciones recientes
  const {
    data: recentReservations,
    isLoading: isLoadingRecentReservations,
    refetch: refetchRecentReservations,
  } = useGetRecentReservationsQuery();

  // Próximos pagos pendientes
  const {
    data: nextPendingPayments,
    isLoading: isLoadingNextPendingPayments,
    refetch: refetchNextPendingPayments,
  } = useGetNextPendingPaymentsQuery();

  const {
    data: occupancyStatisticsPercentage,
    isLoading: isLoadingOccupancyStatisticsPercentage,
    refetch: refetchOccupancyStatisticsPercentage,
  } = useGetOccupationStatisticsPercentageByTypeQuery(year, {
    skip: !year,
  });

  const {
    data: monthlyBookingTrend,
    isLoading: isLoadingMonthlyBookingTrend,
    refetch: refetchMonthlyBookingTrend,
  } = useGetMonthlyBookingTrendQuery(yearReservation, {
    skip: !yearReservation,
  });

  const {
    data: annualSummaryFinance,
    isLoading: isLoadingAnnualSummaryFinance,
    refetch: refetchAnnualSummaryFinance,
  } = useGetAnnualSummaryFinanceQuery(yearFinance, {
    skip: !yearFinance,
  });

  const {
    data: customerOriginSummary,
    isLoading: isLoadingCustomerOriginSummary,
    refetch: refetchCustomerOriginSummary,
  } = useGetCustomerOriginSummaryQuery(yearOrigin, {
    skip: !yearOrigin,
  });

  const {
    data: monthlyCustomerOrigin,
    isLoading: isLoadingMonthlyCustomerOrigin,
    refetch: refetchMonthlyCustomerOrigin,
  } = useGetMonthlyCustomerOriginQuery(yearOrigin, {
    skip: !yearOrigin,
  });

  const {
    data: top10CountriesCustomers,
    isLoading: isLoadingTop10CountriesCustomers,
    refetch: refetchTop10CountriesCustomers,
  } = useGetTop10CountriesCustomersQuery(yearOrigin, {
    skip: !yearOrigin,
  });

  const {
    data: top10ProvincesCustomers,
    isLoading: isLoadingTop10ProvincesCustomers,
    refetch: refetchTop10ProvincesCustomers,
  } = useGetTop10ProvincesCustomersQuery(yearOrigin, {
    skip: !yearOrigin,
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
  };
};
