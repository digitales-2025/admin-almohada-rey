/**
 * Utilidad para manejar fechas en la zona horaria de Perú (UTC-5)
 */

// Constantes
export const LIMA_TIME_ZONE = "America/Lima";
export const LIMA_TO_UTC_OFFSET = 5; // Diferencia horaria entre Lima y UTC

/**
 * Convierte una hora en formato "hh:mm AM/PM" a un objeto con hora y minutos en formato 24h
 */
export function parsePeruTimeString(timeString: string): { hour: number; minutes: number } {
  const [time, period] = timeString.split(/(?=[AaPp][Mm])/);
  console.log(`parsePeruTimeString: ${timeString} -> ${time}, ${period}`);
  const [hours, minutes] = time.split(":");
  let hour24 = parseInt(hours);

  // Convertir a formato 24 horas
  if (period.toLowerCase() === "pm" && hour24 < 12) {
    hour24 += 12;
  } else if (period.toLowerCase() === "am" && hour24 === 12) {
    hour24 = 0;
  }

  return { hour: hour24, minutes: parseInt(minutes) };
}

/**
 * Convierte una fecha y hora de Perú a UTC
 * @param peruDate La fecha en formato yyyy-MM-dd
 * @param peruTime La hora en formato "hh:mm AM/PM"
 * @returns Fecha en formato UTC (string ISO)
 */
export function peruDateTimeToUTC(peruDate: string, peruTime: string): string {
  // Parsear la fecha
  const [year, month, day] = peruDate.split("-").map(Number);

  // Parsear la hora
  const { hour, minutes } = parsePeruTimeString(peruTime);

  // Convertir a UTC sumando la diferencia horaria
  const utcHour = hour + LIMA_TO_UTC_OFFSET;

  // Crear fecha en UTC usando Date.UTC para evitar problemas con zonas horarias locales
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minutes, 0, 0));

  return utcDate.toISOString();
}

/**
 * Convierte una fecha ISO UTC a fecha y hora en formato de Perú
 * @param utcISOString Fecha en formato ISO UTC
 * @returns Objeto con la fecha y hora en formato de Perú
 */
export type PeruDateTime = {
  date: string;
  time: string;
  displayDateTime: string;
};
export function utcToPeruDateTime(utcISOString: string): PeruDateTime {
  const date = new Date(utcISOString);

  // Obtener la representación de la fecha en zona horaria de Lima
  const peruDateTimeString = date.toLocaleString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Separar fecha y hora
  const [dateStr, timeStr] = peruDateTimeString.split(", ");

  // Formatear la fecha como yyyy-MM-dd
  const [day, month, year] = dateStr.split("/");
  const formattedDate = `${year}-${month}-${day}`;

  return {
    date: formattedDate,
    time: timeStr,
    displayDateTime: peruDateTimeString,
  };
}

/**
 * Crea un objeto de fecha para un evento a partir de una fecha y hora de Perú
 * @param peruDate Fecha en formato yyyy-MM-dd
 * @param peruTime Hora en formato "hh:mm AM/PM"
 * @param durationMinutes Duración del evento en minutos
 * @returns Objeto con fechas de inicio y fin en formato ISO
 */
export function createPeruEventDateTime(
  peruDate: string,
  peruTime: string,
  durationMinutes = 15
): { start: string; end: string } {
  // Convertir fecha y hora a UTC
  const startUTC = peruDateTimeToUTC(peruDate, peruTime);

  // Crear fecha de fin sumando la duración
  const endDate = new Date(startUTC);
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);

  return {
    start: startUTC,
    end: endDate.toISOString(),
  };
}

/**
 * Devuelve objeto con información detallada de una cita para debugging
 */
export function getPeruAppointmentDebugInfo(
  peruDate: string,
  peruTime: string,
  durationMinutes = 15
): Record<string, string> {
  const { hour, minutes } = parsePeruTimeString(peruTime);
  const [year, month, day] = peruDate.split("-").map(Number);
  const utcHour = hour + LIMA_TO_UTC_OFFSET;

  const startDate = new Date(Date.UTC(year, month - 1, day, utcHour, minutes, 0, 0));
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);

  return {
    "Hora seleccionada (Perú)": peruTime,
    "Fecha seleccionada (Perú)": peruDate,
    "Inicio (Perú)": new Date(startDate).toLocaleString("es-PE", {
      timeZone: LIMA_TIME_ZONE,
    }),
    "Fin (Perú)": new Date(endDate).toLocaleString("es-PE", {
      timeZone: LIMA_TIME_ZONE,
    }),
    "Inicio (UTC)": startDate.toISOString(),
    "Fin (UTC)": endDate.toISOString(),
    Duración: `${durationMinutes} minutos`,
  };
}

/**
 * Hora estándar para check-in y check-out en hoteles peruanos
 * Falta definir segun las necesidades de la empresa
 */
export const DEFAULT_CHECKIN_TIME = "03:00 PM"; // 15:00
export const DEFAULT_CHECKOUT_TIME = "12:00 PM"; // 12:00

/**
 * Crea un objeto de reserva para fechas de check-in y check-out en Perú
 * @param checkInDate Fecha de check-in en formato yyyy-MM-dd
 * @param checkOutDate Fecha de check-out en formato yyyy-MM-dd
 * @param checkInTime Hora de check-in en formato "hh:mm AM/PM"
 * @param checkOutTime Hora de check-out en formato "hh:mm AM/PM"
 * @returns Objeto con fechas de check-in y check-out en formato ISO
 */
export function createPeruBookingDateTime(
  checkInDate: string,
  checkOutDate: string,
  checkInTime: string = DEFAULT_CHECKIN_TIME,
  checkOutTime: string = DEFAULT_CHECKOUT_TIME
): { checkIn: string; checkOut: string } {
  // Convertir fecha y hora a UTC
  const checkInUTC = peruDateTimeToUTC(checkInDate, checkInTime);
  const checkOutUTC = peruDateTimeToUTC(checkOutDate, checkOutTime);

  return {
    checkIn: checkInUTC,
    checkOut: checkOutUTC,
  };
}

/**
 * Calcula la duración de la estancia en noches
 * @param checkInDate Fecha de check-in en formato ISO
 * @param checkOutDate Fecha de check-out en formato ISO
 * @returns Número de noches de estancia
 */
export function calculateStayNights(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Calculamos la diferencia en milisegundos y convertimos a días
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Convierte una fecha ISO a formato de fecha de Perú para formularios
 * @param isoDate Fecha ISO para convertir
 * @returns Fecha en formato yyyy-MM-dd para usar en inputs de tipo date
 */
export function isoToPeruDateInput(isoDate: string): string {
  const { date } = utcToPeruDateTime(isoDate);
  return date;
}

/**
 * Convierte una fecha string de formulario a ISO respetando zona horaria de Perú
 * @param dateString Fecha en formato yyyy-MM-dd o dd/MM/yyyy
 * @param isCheckIn Si es true, usa la hora de check-in por defecto, si no la de check-out
 * @param checkInTime Hora de check-in en formato "hh:mm AM/PM"
 * @param checkOutTime Hora de check-out en formato "hh:mm AM/PM"
 * @returns Fecha en formato ISO
 */
export function formDateToPeruISO(
  dateString: string,
  isCheckIn: boolean = true,
  checkInTime: string = DEFAULT_CHECKIN_TIME,
  checkOutTime: string = DEFAULT_CHECKOUT_TIME
): string {
  // Normalizamos el formato de fecha
  let formattedDate = dateString;

  // Si el formato es dd/MM/yyyy lo convertimos a yyyy-MM-dd
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    formattedDate = `${year}-${month}-${day}`;
  }

  // Usamos la hora por defecto según sea check-in o check-out
  let timeString = isCheckIn ? checkInTime : checkOutTime;

  // Si falta el formato AM/PM, asume que es AM para mañana y PM para tarde
  if (!timeString.includes("AM") && !timeString.includes("PM")) {
    const [hours] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    timeString = `${timeString} ${hourNum >= 12 ? "PM" : "AM"}`;
  }

  return peruDateTimeToUTC(formattedDate, timeString);
}

/**
 * Verifica si una fecha de check-in y check-out son válidas
 * @param checkInDate Fecha de check-in en formato ISO
 * @param checkOutDate Fecha de check-out en formato ISO
 * @returns Objeto con validación y mensaje de error si corresponde
 */
export function validateBookingDates(
  checkInDate: string,
  checkOutDate: string
): { isValid: boolean; message?: string } {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();

  if (checkIn < today) {
    return { isValid: false, message: "La fecha de check-in no puede ser en el pasado" };
  }

  if (checkOut <= checkIn) {
    return { isValid: false, message: "La fecha de check-out debe ser posterior al check-in" };
  }

  return { isValid: true };
}

/**
 * Formatea una fecha ISO para mostrar como check-in/check-out
 * @param isoDate Fecha en formato ISO
 * @returns Fecha formateada para mostrar al usuario
 */
export function formatPeruBookingDate(isoDate: string): {
  localeDateString: string;
  customPeruDateTime: PeruDateTime;
} {
  const peruDate = utcToPeruDateTime(isoDate);

  // Formato: "Lunes, 28 de marzo de 2023 a las 3:00 PM"
  const date = new Date(isoDate);

  return {
    localeDateString: date.toLocaleDateString("es-PE", {
      timeZone: LIMA_TIME_ZONE,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    customPeruDateTime: peruDate,
  };
}

type BookingTimeType = "checkin" | "checkout";

/**
 * Devuelve las opciones de hora disponibles según el tipo (check-in o check-out)
 * @param type Tipo de hora (checkin o checkout)
 * @returns Array de strings con los horarios disponibles
 */
export function getTimeOptionsForDay(type: BookingTimeType = "checkin"): string[] {
  if (type === "checkin") {
    // Devuelve opciones de hora para check-in (típicamente tarde)
    return [
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "07:00 PM",
      "08:00 PM",
      "09:00 PM",
    ];
  } else {
    // Devuelve opciones de hora para check-out (típicamente mañana)
    return ["07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
  }
}

/**
 * Calcula el precio por estancia basado en tarifa diaria
 * @param checkInDate Fecha ISO de check-in
 * @param checkOutDate Fecha ISO de check-out
 * @param dailyRate Tarifa diaria en la moneda local
 * @returns Precio total de la estancia
 */
export function calculateStayPrice(checkInDate: string, checkOutDate: string, dailyRate: number): number {
  const nights = calculateStayNights(checkInDate, checkOutDate);
  return nights * dailyRate;
}

/**
 * Formatea un rango de fechas de estancia para mostrar al usuario
 * @param checkInDate Fecha ISO de check-in
 * @param checkOutDate Fecha ISO de check-out
 * @returns Objeto con fechas formateadas en este formato "28 Mar - 30 Mar (2 noches)"
 *          localeDateTimeResult: Fecha formateada para mostrar al usuario
 *          customLocaleDateTimeResult: Fecha formateada para mostrar al usuario
 */
export function formatStayDateRange(
  checkInDate: string,
  checkOutDate: string
): {
  localeDateTimeResult: string;
  customLocaleDateTimeResult: string;
} {
  const checkIn = utcToPeruDateTime(checkInDate);
  const checkOut = utcToPeruDateTime(checkOutDate);

  // Formato: "28 Mar - 30 Mar (2 noches)"
  const date1 = new Date(checkInDate);
  const date2 = new Date(checkOutDate);
  const nights = calculateStayNights(checkInDate, checkOutDate);

  const localeDateTimeResult = `${date1.toLocaleDateString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    day: "numeric",
    month: "short",
  })} - ${date2.toLocaleDateString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    day: "numeric",
    month: "short",
  })} (${nights} ${nights === 1 ? "noche" : "noches"})`;

  const customLocaleDateTimeResult = `${checkIn.date} - ${checkOut.date} (${nights} ${nights === 1 ? "noche" : "noches"})`;

  return {
    localeDateTimeResult,
    customLocaleDateTimeResult,
  };
}

/**
 * Formatea una fecha para obtener la hora en formato "hh:mm AM/PM"
 * @param date Fecha a formatear
 * @returns String con formato de hora "hh:mm AM/PM"
 */
export function formatTimeToHHMMAMPM(date: Date): string {
  // Usamos el locale en-US para garantizar formato AM/PM consistente
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: LIMA_TIME_ZONE,
  });
}

/**
 * Obtiene la fecha y hora actual en Perú (America/Lima, UTC-5)
 * @param format Formato de salida deseado ('iso' | 'date' | 'time' | 'full' | 'object')
 * @returns La fecha actual en Perú en el formato solicitado
 */
export function getCurrentPeruDateTime(
  format: "iso" | "date" | "time" | "full" | "object" = "object"
): string | PeruDateTime | Date {
  // Obtener la fecha actual en UTC
  const now = new Date();

  // Obtener representación en zona horaria de Perú
  const peruNow = new Date(now.toLocaleString("en-US", { timeZone: LIMA_TIME_ZONE }));

  switch (format) {
    case "iso":
      // Formato ISO pero con la zona horaria de Perú
      return now.toISOString();

    case "date":
      // Solo la fecha en formato yyyy-MM-dd
      return peruNow.toISOString().split("T")[0];

    case "time":
      // Solo la hora en formato hh:mm AM/PM
      return formatTimeToHHMMAMPM(peruNow);

    case "full":
      // Fecha y hora completa en formato localizado español
      return peruNow.toLocaleString("es-PE", {
        timeZone: LIMA_TIME_ZONE,
        dateStyle: "full",
        timeStyle: "short",
      });

    case "object":
    default:
      // Devolver el objeto PeruDateTime como se usa en otras funciones
      return utcToPeruDateTime(now.toISOString());
  }
}

// Obtener la fecha y hora actual de Perú como objeto
export const peruNow = getCurrentPeruDateTime();
// { date: "2025-03-31", time: "02:45 PM", displayDateTime: "31/03/2025, 02:45 PM" }

// Obtener solo la fecha actual en formato yyyy-MM-dd
export const todayDate = getCurrentPeruDateTime("date") as string;
// "2025-03-31"

// Obtener solo la hora actual en formato hh:mm AM/PM
export const currentTime = getCurrentPeruDateTime("time") as string;
// "02:45 PM"

// Obtener representación completa
export const fullDateTime = getCurrentPeruDateTime("full") as string;
// "lunes, 31 de marzo de 2025, 14:45"

/**
 * Obtiene solo la fecha actual en Perú (sin hora) como objeto Date
 * @returns Objeto Date configurado en la zona horaria de Lima al inicio del día
 */
export function getPeruStartOfToday(): Date {
  const peruToday = new Date(getCurrentPeruDateTime("iso") as string);
  return new Date(peruToday.getFullYear(), peruToday.getMonth(), peruToday.getDate(), 0, 0, 0, 0);
}
