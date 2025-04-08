import { ReservationStatus, ReservationStatusAvailableActions } from "../_schemas/reservation.schemas";

export function getAvailableActions(currentStatus: ReservationStatus): ReservationStatusAvailableActions {
  switch (currentStatus) {
    case "PENDING":
      return {
        canConfirm: true,
        canCheckIn: false,
        canCheckOut: false,
        canCancel: true,
        canModify: true,
        canReactivate: false,
      };
    case "CONFIRMED":
      return {
        canConfirm: false,
        canCheckIn: true,
        canCheckOut: false,
        canCancel: true,
        canModify: true,
        canReactivate: false,
      };
    case "CHECKED_IN":
      return {
        canConfirm: false,
        canCheckIn: false,
        canCheckOut: true,
        canCancel: false,
        canModify: false,
        canReactivate: false,
      };
    case "CHECKED_OUT":
      return {
        canConfirm: false,
        canCheckIn: false,
        canCheckOut: false,
        canCancel: false,
        canModify: false,
        canReactivate: false,
      };
    case "CANCELED":
      return {
        canConfirm: false,
        canCheckIn: false,
        canCheckOut: false,
        canCancel: false,
        canModify: false,
        canReactivate: true,
      };
    default:
      throw new Error(`Estado de reserva desconocido: ${currentStatus}`);
  }
}
