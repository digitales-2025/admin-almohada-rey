import { toast } from "sonner";

import {
  useLazyDownloadBalanceReportQuery,
  useLazyDownloadExpenseReportQuery,
  useLazyDownloadOccupancyReportQuery,
  useLazyDownloadProfitReportQuery,
  useLazyDownloadProfitTypeRoomReportQuery,
} from "../_services/reportsApi";
import { DownloadReportParams } from "../interfaces/dowloadParams";
import { ReportType } from "../interfaces/report-type";

// Hook personalizado para descargar reportes de Excel según el tipo
export function useDownloadReport() {
  // Hooks de RTK Query para cada tipo de reporte
  const [downloadProfit] = useLazyDownloadProfitReportQuery();
  const [downloadExpense] = useLazyDownloadExpenseReportQuery();
  const [downloadBalance] = useLazyDownloadBalanceReportQuery();
  const [downloadProfitTypeRoom] = useLazyDownloadProfitTypeRoomReportQuery();
  const [downloadOccupancy] = useLazyDownloadOccupancyReportQuery();

  // Ahora recibe también el título del reporte
  const onDownloadReport = async (
    type: ReportType,
    params: DownloadReportParams,
    tituloReporte?: string // Nuevo parámetro opcional
  ): Promise<boolean> => {
    const toastId = toast.loading("Descargando reporte...");
    try {
      let blob: Blob;

      // Selecciona el endpoint correcto según el tipo de reporte usando switch
      switch (type) {
        case "profit":
          blob = await downloadProfit(params).unwrap();
          break;
        case "expense":
          blob = await downloadExpense(params).unwrap();
          break;
        case "balance":
          blob = await downloadBalance(params).unwrap();
          break;
        case "typeRoom":
          blob = await downloadProfitTypeRoom(params).unwrap();
          break;
        case "occupancy":
          blob = await downloadOccupancy(params).unwrap();
          break;
        default:
          throw new Error("Tipo de reporte no soportado");
      }

      // Usa el título para el nombre del archivo, quitando espacios y acentos si es necesario
      const safeTitle = (tituloReporte || type)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/\s+/g, "_"); // reemplaza espacios por guiones bajos

      const filename = `${safeTitle}_${params.year}_${params.month}.xlsx`;

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Usa el título si está disponible
      toast.success(`Reporte de ${tituloReporte ? tituloReporte : type} descargado con éxito`, { id: toastId });
      return true;
    } catch (error) {
      // Tipado seguro para error
      if (error instanceof Error) {
        toast.error(`Error al descargar: ${error.message}`, { id: toastId });
      } else {
        toast.error("Error desconocido al descargar el reporte", { id: toastId });
      }
      return false;
    }
  };

  // Retorna la función para ser usada en los componentes
  return { onDownloadReport };
}
