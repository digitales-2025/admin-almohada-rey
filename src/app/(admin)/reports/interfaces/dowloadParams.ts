// Parámetros para reportes por rango de fechas
export interface DownloadReportDateRangeParams {
  startDate: string; // formato YYYY-MM-DD
  endDate: string; // formato YYYY-MM-DD
}

// Parámetros para reportes comparativos entre años
export interface DownloadReportCompareParams {
  year1: number;
  year2: number;
}

// Parámetros para reportes por tipo de habitación (rango de fechas)
export interface DownloadReportTypeRoomDateRangeParams {
  startDate: string; // formato YYYY-MM-DD
  endDate: string; // formato YYYY-MM-DD
  typeRoomId: string;
}

// Parámetros para reportes por tipo de habitación (comparativo)
export interface DownloadReportTypeRoomCompareParams {
  year1: number;
  year2: number;
  typeRoomId: string;
}

// Unión de tipos para flexibilidad
export type DownloadReportParams = DownloadReportDateRangeParams | DownloadReportCompareParams;
export type DownloadReportTypeRoomParams = DownloadReportTypeRoomDateRangeParams | DownloadReportTypeRoomCompareParams;

// Función helper para verificar si es rango de fechas
export function isDateRangeParams(params: DownloadReportParams): params is DownloadReportDateRangeParams {
  return "startDate" in params && "endDate" in params;
}

// Función helper para verificar si es comparativo
export function isCompareParams(params: DownloadReportParams): params is DownloadReportCompareParams {
  return "year1" in params && "year2" in params;
}

// Función helper para verificar si es rango de fechas (tipo habitación)
export function isTypeRoomDateRangeParams(
  params: DownloadReportTypeRoomParams
): params is DownloadReportTypeRoomDateRangeParams {
  return "startDate" in params && "endDate" in params;
}

// Función helper para verificar si es comparativo (tipo habitación)
export function isTypeRoomCompareParams(
  params: DownloadReportTypeRoomParams
): params is DownloadReportTypeRoomCompareParams {
  return "year1" in params && "year2" in params;
}
