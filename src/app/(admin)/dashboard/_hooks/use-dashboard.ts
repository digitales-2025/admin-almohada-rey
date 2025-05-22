import {
  useGetAnnualStatisticsQuery,
  useGetMonthlyEarningsExpensesQuery,
  useGetNextPendingPaymentsQuery,
  useGetRecentReservationsQuery,
  useGetRoomOccupancyQuery,
} from "../_services/dashbordApi";

interface UseDashboardProps {
  year?: number;
}

export const useDashboard = (options: UseDashboardProps = {}) => {
  const { year } = options;

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

  // Estado de carga combinado
  const isLoading =
    isLoadingAnnualStatistics ||
    isLoadingMonthlyEarningsExpenses ||
    isLoadingRoomOccupancy ||
    isLoadingRecentReservations ||
    isLoadingNextPendingPayments;

  return {
    // Datos
    annualStatistics,
    monthlyEarningsExpenses,
    roomOccupancy,
    recentReservations,
    nextPendingPayments,

    // Estados de carga
    isLoadingAnnualStatistics,
    isLoadingMonthlyEarningsExpenses,
    isLoadingRoomOccupancy,
    isLoadingRecentReservations,
    isLoadingNextPendingPayments,
    isLoading,

    // Funciones de actualización
    refetchAnnualStatistics,
    refetchMonthlyEarningsExpenses,
    refetchRoomOccupancy,
    refetchRecentReservations,
    refetchNextPendingPayments,
  };
};
