// Puedes agregar más campos en el futuro sin romper el código
export interface DownloadReportParams {
  month: number;
  year: number;
  // filtroOpcional?: string;
}

export interface DownloadReportTypeRoomParams {
  month: number;
  year: number;
  typeRoomId?: string;
  // filtroOpcional?: string;
}
