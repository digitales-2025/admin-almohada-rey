import { Car, Coffee, Sparkles, Utensils, Waves, Wifi, Wine, Zap } from "lucide-react";

import { PaymentDetailType } from "@/app/(admin)/payment/_types/payment";
import { HistoryCustomer } from "../../../_types/customer";

// Actualizar la función getAmenityIcon para usar los nombres de los servicios
export const getAmenityIcon = (amenityName: string) => {
  const amenityNameLower = amenityName.toLowerCase();

  if (amenityNameLower.includes("desayuno") || amenityNameLower.includes("breakfast")) {
    return <Coffee className="h-4 w-4" />;
  } else if (amenityNameLower.includes("spa")) {
    return <Sparkles className="h-4 w-4" />;
  } else if (amenityNameLower.includes("room service") || amenityNameLower.includes("servicio a la habitación")) {
    return <Utensils className="h-4 w-4" />;
  } else if (
    amenityNameLower.includes("aeropuerto") ||
    amenityNameLower.includes("traslado") ||
    amenityNameLower.includes("transport")
  ) {
    return <Car className="h-4 w-4" />;
  } else if (amenityNameLower.includes("piscina") || amenityNameLower.includes("pool")) {
    return <Waves className="h-4 w-4" />;
  } else if (
    amenityNameLower.includes("champagne") ||
    amenityNameLower.includes("bebida") ||
    amenityNameLower.includes("wine")
  ) {
    return <Wine className="h-4 w-4" />;
  } else if (amenityNameLower.includes("wifi") || amenityNameLower.includes("internet")) {
    return <Wifi className="h-4 w-4" />;
  } else {
    return <Zap className="h-4 w-4" />;
  }
};

// Format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Función para obtener los amenities de una reserva
export const getAmenitiesFromReservation = (booking: HistoryCustomer["reservations"][0]) => {
  if (!booking.payment || !booking.payment.paymentDetail) {
    return [];
  }

  // Filtrar los detalles de pago que sean servicios (amenities)
  const serviceDetails = booking.payment.paymentDetail.filter(
    (detail) => detail.type === PaymentDetailType.EXTRA_SERVICE && detail.service
  );

  // Extraer los nombres de los servicios
  return serviceDetails.map((detail) => detail.service?.name || "");
};

// Group bookings by year
export const groupBookingsByYear = (historyCustomerById: HistoryCustomer | undefined) => {
  if (!historyCustomerById || !historyCustomerById.reservations || !Array.isArray(historyCustomerById.reservations)) {
    return {};
  }

  const grouped: Record<string, (typeof historyCustomerById.reservations)[number][]> = {};

  historyCustomerById.reservations.forEach((reservation) => {
    const date = new Date(reservation.checkInDate);
    const year = date.getFullYear().toString();

    if (!grouped[year]) {
      grouped[year] = [];
    }

    grouped[year].push(reservation);
  });

  return grouped;
};

// Calculate total stats
export const calculateStats = (historyCustomerById: HistoryCustomer | undefined) => {
  if (!historyCustomerById || !historyCustomerById.reservations) {
    return { totalStays: 0, totalNights: 0, totalSpent: 0 };
  }

  const totalStays = historyCustomerById.reservations.length;

  const totalNights = historyCustomerById.reservations.reduce((sum, reservation) => {
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);

  const totalSpent = historyCustomerById.reservations.reduce((sum, reservation) => {
    if (reservation.payment && reservation.payment.amount) {
      return sum + reservation.payment.amount;
    }
    return sum;
  }, 0);

  return { totalStays, totalNights, totalSpent };
};
