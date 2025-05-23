import {
  useGetAnnualStatisticsQuery,
  useGetAnnualSummaryFinanceQuery,
  useGetMonthlyBookingTrendQuery,
  useGetMonthlyEarningsExpensesQuery,
  useGetNextPendingPaymentsQuery,
  useGetOccupationStatisticsPercentageByTypeQuery,
  useGetRecentReservationsQuery,
  useGetRoomOccupancyQuery,
} from "../_services/dashbordApi";

interface UseDashboardProps {
  year?: number;
  yearReservation?: number;
  yearFinance?: number;
}

export const useDashboard = (options: UseDashboardProps = {}) => {
  const { year, yearReservation, yearFinance } = options;

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

  // Estado de carga combinado
  const isLoading =
    isLoadingAnnualStatistics ||
    isLoadingMonthlyEarningsExpenses ||
    isLoadingRoomOccupancy ||
    isLoadingRecentReservations ||
    isLoadingNextPendingPayments ||
    isLoadingOccupancyStatisticsPercentage;

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

    // Funciones de actualización
    refetchAnnualStatistics,
    refetchMonthlyEarningsExpenses,
    refetchRoomOccupancy,
    refetchRecentReservations,
    refetchNextPendingPayments,
    refetchOccupancyStatisticsPercentage,
    refetchMonthlyBookingTrend,
    refetchAnnualSummaryFinance,
  };
};
