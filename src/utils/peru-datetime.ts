/**
 * Utilidades de fecha y hora para el frontend, usando 'date-fns-tz' para un manejo
 * robusto y consistente de la zona horaria de Perú (America/Lima).
 *
 * VERSIÓN HÍBRIDA: Combina las mejoras de date-fns-tz con la lógica robusta original
 */
// Importaciones no utilizadas removidas
import { parse } from "date-fns";
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";

// --- CONFIGURACIÓN CENTRALIZADA ---

export const LIMA_TIME_ZONE = "America/Lima";
// ❌ ELIMINADO: LIMA_TO_UTC_OFFSET - Usar librerías estándar en su lugar

// Horas estándar de check-in y check-out
export const DEFAULT_CHECKIN_TIME = "03:00 PM"; // 15:00
export const DEFAULT_CHECKOUT_TIME = "12:00 PM"; // 12:00
export const DEFAULT_EXTENDED_CHECKOUT_TIME = "12:01 PM"; // 14:00

// --- ADVERTENCIA SOBRE EL ESTADO GLOBAL ---
// El objeto `persistentData` es una mala práctica en React. Sus cambios no
// provocarán que la UI se actualice. Este estado debe manejarse dentro de los
// componentes de React usando `useState`, `useContext` o una librería de estado.
// Se comenta como referencia de lo que NO se debe hacer.
/*
export const persistentData = { ... };
*/

// --- FUNCIONES NÚCLEO (REFACTORIZADAS) ---

/**
 * Convierte una hora en formato "hh:mm AM/PM" a un objeto con hora y minutos en formato 24h
 * MANTIENE tu lógica original mejorada
 */
export function parsePeruTimeString(timeString: string): { hour: number; minutes: number } {
  const [time, period] = timeString.split(/(?=[AaPp][Mm])/);
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
 * Convierte una fecha (string 'yyyy-MM-dd') y una hora (string 'hh:mm a') de Perú
 * a un objeto Date (timestamp UTC) universal y correcto.
 * Esta función reemplaza a la frágil 'peruDateTimeToUTC'.
 * @param dateStr La fecha en formato yyyy-MM-dd
 * @param timeStr La hora en formato "hh:mm a" (ej. "03:00 PM")
 * @returns Un objeto Date que representa ese momento exacto.
 */
export function peruDateTimeToDate(dateStr: string, timeStr: string): Date {
  // Validar que los parámetros no estén vacíos
  if (!dateStr || !timeStr) {
    console.error("peruDateTimeToDate: Parámetros vacíos", { dateStr, timeStr });
    return new Date(); // Retornar fecha actual como fallback
  }

  // Unimos las cadenas para que 'parse' las entienda.
  const combinedString = `${dateStr} ${timeStr}`;
  // 'h' es para hora 1-12, 'hh' para 01-12. 'a' es para AM/PM.
  const formatString = "yyyy-MM-dd hh:mm a";

  try {
    // Primero parsear la fecha en la zona horaria local
    const localDate = parse(combinedString, formatString, new Date());

    // Luego convertir a UTC usando fromZonedTime
    const result = fromZonedTime(localDate, LIMA_TIME_ZONE);

    // Validar que la fecha sea válida
    if (isNaN(result.getTime())) {
      console.error("peruDateTimeToDate: Fecha inválida generada", {
        dateStr,
        timeStr,
        combinedString,
        formatString,
        result,
      });
      return new Date(); // Retornar fecha actual como fallback
    }

    return result;
  } catch (error) {
    console.error("peruDateTimeToDate: Error al parsear fecha", {
      dateStr,
      timeStr,
      combinedString,
      formatString,
      error,
    });
    return new Date(); // Retornar fecha actual como fallback
  }
}

/**
 * Convierte un objeto Date (timestamp UTC) a sus componentes de fecha y hora en Perú.
 * Reemplaza a 'utcToPeruDateTime' con una implementación más robusta.
 * @param date El objeto Date a convertir.
 * @returns Un objeto con fecha y hora separadas en formato de Perú.
 */
export function dateToPeruDateTime(date: Date): { date: string; time: string } {
  // 'format' de date-fns-tz se encarga de la conversión y el formato.
  const dateStr = format(date, "yyyy-MM-dd", { timeZone: LIMA_TIME_ZONE });
  const timeStr = format(date, "hh:mm a", { timeZone: LIMA_TIME_ZONE, locale: es });

  return { date: dateStr, time: timeStr };
}

// --- FUNCIONES DE LÓGICA DE NEGOCIO (SIMPLIFICADAS) ---

/**
 * Crea un objeto de reserva con fechas de check-in y check-out en formato ISO.
 * @param checkInDate Fecha de check-in en 'yyyy-MM-dd'
 * @param checkOutDate Fecha de check-out en 'yyyy-MM-dd'
 * @param checkInTime Hora de check-in opcional
 * @param checkOutTime Hora de check-out opcional
 * @returns Objeto con fechas en formato ISO string.
 */
export function createBookingISOStrings(
  checkInDate: string,
  checkOutDate: string,
  checkInTime = DEFAULT_CHECKIN_TIME,
  checkOutTime = DEFAULT_CHECKOUT_TIME
): { checkIn: string; checkOut: string } {
  const checkIn = peruDateTimeToDate(checkInDate, checkInTime);
  const checkOut = peruDateTimeToDate(checkOutDate, checkOutTime);

  return {
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
  };
}

// Funciones movidas a la sección de funciones originales mejoradas

// --- FUNCIONES DE FORMATO PARA LA UI ---

// Función movida a la sección de funciones originales mejoradas

/**
 * Formatea una fecha ISO para mostrarla de forma legible.
 * @param isoDate Fecha en formato ISO string
 * @returns Fecha formateada como "sábado, 11 de octubre de 2025"
 */
export function formatISODateLong(isoDate: string): string {
  const date = new Date(isoDate);
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", {
    timeZone: LIMA_TIME_ZONE,
    locale: es,
  });
}

// --- LÓGICA DE VALORES POR DEFECTO ---

/**
 * Sugiere una fecha de check-in apropiada.
 * Si es después de las 9 PM en Lima, sugiere mañana. Si no, hoy.
 * @returns Un objeto Date representando el inicio del día sugerido.
 */
export function getAppropriateCheckInDate(): Date {
  // Obtenemos la hora actual en la perspectiva de Lima
  const nowInLima = toZonedTime(new Date(), LIMA_TIME_ZONE);

  // Si la hora en Lima es 21:00 o más tarde...
  if (nowInLima.getHours() >= 21) {
    // ...sugerimos mañana.
    const tomorrow = new Date(nowInLima);
    tomorrow.setDate(nowInLima.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Inicio del día
    return tomorrow;
  }

  // Si no, sugerimos hoy.
  nowInLima.setHours(0, 0, 0, 0); // Inicio del día
  return nowInLima;
}

/**
 * Sugiere una hora de check-in apropiada basada en la hora actual.
 * Redondea hacia arriba a la siguiente hora.
 * @returns Hora de check-in dinámica
 */
export function getAppropriateCheckInTime(): string {
  // Obtenemos la hora actual en Lima
  const nowInLima = toZonedTime(new Date(), LIMA_TIME_ZONE);
  const currentHour = nowInLima.getHours();
  const currentMinute = nowInLima.getMinutes();

  // Si hay minutos, redondear hacia arriba
  let nextHour = currentMinute > 0 ? currentHour + 1 : currentHour;

  // Asegurar que no sea muy tarde (máximo 11 PM)
  if (nextHour > 23) {
    nextHour = 23;
  }

  // Asegurar que no sea muy temprano (mínimo 1 PM)
  if (nextHour < 13) {
    nextHour = 13; // 1 PM
  }

  // Convertir a formato 12 horas con AM/PM
  const isPM = nextHour >= 12;
  const hour12 = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
  const amPm = isPM ? "PM" : "AM";

  return `${hour12}:00 ${amPm}`;
}

/**
 * Obtiene el inicio del día de hoy en la zona horaria de Perú.
 * @returns Date representando el inicio del día de hoy en Lima
 */
export function getPeruStartOfToday(): Date {
  const nowInLima = toZonedTime(new Date(), LIMA_TIME_ZONE);
  nowInLima.setHours(0, 0, 0, 0);
  return nowInLima;
}

/**
 * Convierte fecha y hora de Perú a UTC usando librerías estándar.
 * ✅ CORREGIDO: Usa date-fns-tz en lugar de cálculos manuales
 * @param dateStr Fecha en formato yyyy-MM-dd
 * @param timeStr Hora en formato hh:mm a
 * @returns String ISO en UTC
 */
export function peruDateTimeToUTC(dateStr: string, timeStr: string): string {
  // Usar la función segura que ya tenemos
  const date = peruDateTimeToDate(dateStr, timeStr);

  // Validar que la fecha sea válida antes de convertir a ISO
  if (isNaN(date.getTime())) {
    console.error("peruDateTimeToUTC: Fecha inválida recibida", { dateStr, timeStr, date });
    return new Date().toISOString(); // Retornar fecha actual como fallback
  }

  return date.toISOString();
}

/**
 * Formatea el valor de tiempo para el input de check-in.
 * @param timeStr Hora en formato hh:mm a
 * @returns Hora formateada para el input
 */
export function getFormattedCheckInTimeValue(timeStr: string): string {
  // Convertir de formato 12h a 24h para el input
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":");
  let hour24 = parseInt(hours);

  if (period === "PM" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hour24 === 12) {
    hour24 = 0;
  }

  return `${String(hour24).padStart(2, "0")}:${minutes}`;
}

/**
 * Formatea el valor de tiempo para el input de check-out.
 * @param timeStr Hora en formato hh:mm a
 * @returns Hora formateada para el input
 */
export function getFormattedCheckOutTimeValue(timeStr: string): string {
  return getFormattedCheckInTimeValue(timeStr);
}

/**
 * Convierte fecha del formulario a formato ISO de Perú.
 * @param dateStr Fecha en formato yyyy-MM-dd
 * @param isCheckIn Si es check-in o check-out
 * @param checkInTime Hora de check-in
 * @param checkOutTime Hora de check-out (opcional)
 * @returns String ISO
 */
export function formDateToPeruISO(
  dateStr: string,
  isCheckIn: boolean,
  checkInTime: string,
  checkOutTime?: string
): string {
  // Si no se proporciona checkOutTime, usar el valor por defecto
  const finalCheckOutTime = checkOutTime || DEFAULT_CHECKOUT_TIME;
  const timeToUse = isCheckIn ? checkInTime : finalCheckOutTime;
  return peruDateTimeToUTC(dateStr, timeToUse);
}

// --- FUNCIONES ORIGINALES MEJORADAS (MANTIENEN TU LÓGICA) ---

// Función parsePeruTimeString movida a la sección de funciones núcleo

/**
 * Convierte una fecha ISO UTC a fecha y hora en formato de Perú
 * MANTIENE tu lógica original
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
 * Crea un objeto de reserva para fechas de check-in y check-out en Perú
 * MANTIENE tu lógica original
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
 * Convierte una fecha ISO a formato "hh:mm AM/PM"
 * MANTIENE tu lógica original
 */
export function isoToPeruTimeString(isoDateString: string): string {
  const date = new Date(isoDateString);

  // Formatear a "hh:mm AM/PM" usando la zona horaria de Lima
  return date
    .toLocaleString("en-US", {
      timeZone: LIMA_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/,.*$/, "")
    .trim(); // Elimina cualquier parte de fecha y espacios extras
}

/**
 * Calcula la duración de la estancia en noches (lógica hotelera correcta)
 * ✅ CORREGIDO: Calcula noches basado en fechas, no en horas
 */
export function calculateStayNights(checkInDate: string | Date, checkOutDate: string | Date): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Para hoteles: 1 noche = 1 día de diferencia en las fechas
  // Ignoramos las horas y calculamos solo la diferencia de días
  const checkInDateOnly = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
  const checkOutDateOnly = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());

  // Calcular diferencia en días
  const diffTime = checkOutDateOnly.getTime() - checkInDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Convierte una fecha ISO a formato de fecha de Perú para formularios
 * MANTIENE tu lógica original
 */
export function isoToPeruDateInput(isoDate: string): string {
  const { date } = utcToPeruDateTime(isoDate);
  return date;
}

/**
 * Verifica si una fecha de check-in y check-out son válidas
 * MANTIENE tu lógica original
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
 * MANTIENE tu lógica original completa
 */
export function formatPeruBookingDate(isoDate: string): {
  longLocaleDateString: string;
  localeDateString: string;
  customPeruDateTime: PeruDateTime;
} {
  const peruDate = utcToPeruDateTime(isoDate);

  // Formato: "Lunes, 28 de marzo de 2023 a las 3:00 PM"
  const date = new Date(isoDate);

  const longLocaleDateString = date.toLocaleDateString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const shortLocaleDateString = date.toLocaleDateString("es-PE", {
    timeZone: LIMA_TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    longLocaleDateString,
    localeDateString: shortLocaleDateString,
    customPeruDateTime: peruDate,
  };
}

type BookingTimeType = "checkin" | "checkout";

/**
 * Devuelve las opciones de hora disponibles según el tipo (check-in o check-out)
 * MANTIENE tu lógica original
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
 * MANTIENE tu lógica original
 */
export function calculateStayPrice(checkInDate: string, checkOutDate: string, dailyRate: number): number {
  const nights = calculateStayNights(checkInDate, checkOutDate);
  return nights * dailyRate;
}

/**
 * Formatea un rango de fechas de estancia para mostrar al usuario
 * MANTIENE tu lógica original
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
 * MANTIENE tu lógica original
 */
export function formatTimeToHHMMAMPM(date: Date): string {
  // Usamos el locale en-US para garantizar formato AM/PM consistente
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: LIMA_TIME_ZONE,
  });

  return timeStr;
}

/**
 * Obtiene la fecha y hora actual en Perú (America/Lima, UTC-5)
 * MANTIENE tu lógica original completa
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
 * Función para obtener la fecha y hora actuales en Perú usando librerías estándar.
 * ✅ CORREGIDO: Usa date-fns-tz en lugar de cálculos manuales
 */
export const getPeruCurrentDatetime = () => {
  const now = new Date();

  // Usar date-fns-tz para obtener la hora correcta en Lima
  const limaTime = toZonedTime(now, LIMA_TIME_ZONE);

  return {
    date: limaTime,
    hour: limaTime.getHours(),
    minute: limaTime.getMinutes(),
  };
};

// Estado persistente para el componente de CREAR (temporal hasta refactorizar)
export const createPersistentData = {
  initialized: false,
  renderCount: 0,
  initialValues: {
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
  currentValues: {
    activeTab: "checkin" as "checkin" | "checkout",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
};

// Estado persistente para el componente de ACTUALIZAR (temporal hasta refactorizar)
export const updatePersistentData = {
  initialized: false,
  renderCount: 0,
  currentReservationId: null as string | null,
  initialValues: {
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
  currentValues: {
    activeTab: "checkin" as "checkin" | "checkout",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    checkInTime: DEFAULT_CHECKIN_TIME,
    checkOutTime: DEFAULT_CHECKOUT_TIME,
  },
};

// Mantener el nombre original para compatibilidad (usar createPersistentData)
export const persistentData = createPersistentData;
