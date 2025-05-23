import { ReservationStatus } from "../../reservation/_schemas/reservation.schemas";
import { RoomStatus } from "../../rooms/list/_types/room";

// Extendiendo RoomStatus para incluir MAINTENANCE
export type ExtendedRoomStatus = RoomStatus | "MAINTENANCE";

export interface AnnualAdministratorStatistics {
  totalIncome: number;
  occupancyRate: number;
  newCustomers: number;
  pendingPayments: number;
}

export interface MonthlyEarningsAndExpenses {
  month: string;
  earnings: number;
  expenses: number;
}

export interface RoomOccupancyMap {
  countAvailable: number;
  countOccupied: number;
  countCleaning: number;
  countMaintenance: number;
  countIncomplete: number;
  roomsByType: Record<string, ListRoom[]>;
}

export interface ListRoom {
  id: string;
  number: number;
  status: ExtendedRoomStatus;
}

export interface RecentReservations {
  todayReservations: number;
  newReservations: Top5Reservations[];
}

export interface Top5Reservations {
  id: string;
  customerName: string;
  status: ReservationStatus;
  roomNumber: number;
  checkInDate: Date;
  checkOutDate: Date;
}

export interface NextPendingPayments {
  monthPendingPayments: number;
  newPayments: Top5PendingPayments[];
}

export interface Top5PendingPayments {
  id: string;
  customerName: string;
  roomNumber: number;
  code: string;
  amount: number;
}

export interface OccupationStatisticsPercentage {
  id: string;
  type: string;
  percentage: number;
}

export interface MonthlyBookingTrend {
  month: string;
  webBookings: number;
  directBookings: number;
}

export interface SummaryFinance {
  totalIncome: number;
  totalExpenses: number;
  totalProfit: number;
  totalRoomReservations: number;
  totalServices: number;
  totalProducts: number;
  totalLateCheckout: number;
  totalExpensesFixed: number;
  totalExpensesVariable: number;
  totalExpensesOther: number;
  totalExpensesProducts: number;
}
