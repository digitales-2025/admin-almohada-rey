import { toast } from "sonner";

import {
  useLazyDownloadBalanceReportQuery,
  useLazyDownloadExpenseReportQuery,
  useLazyDownloadProfitReportQuery,
} from "../_services/reportsApi";
import { DownloadReportParams } from "../interfaces/dowloadParams";
import { ReportType } from "../interfaces/report-type";

export function useDownloadReport() {
  const [downloadProfit] = useLazyDownloadProfitReportQuery();
  const [downloadExpense] = useLazyDownloadExpenseReportQuery();
  const [downloadBalance] = useLazyDownloadBalanceReportQuery();

  // Función para descargar el reporte según el tipo
  const onDownloadReport = async (type: ReportType, params: DownloadReportParams) => {
    const toastId = toast.loading("Descargando reporte...");
    try {
      let blob: Blob;
      let filename = "";

      if (type === "profit") {
        blob = await downloadProfit(params).unwrap();
        filename = `profit_${params.year}_${params.month}.xlsx`;
      } else if (type === "expense") {
        blob = await downloadExpense(params).unwrap();
        filename = `expense_${params.year}_${params.month}.xlsx`;
      } else {
        blob = await downloadBalance(params).unwrap();
        filename = `balance_${params.year}_${params.month}.xlsx`;
      }

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success("Reporte descargado con éxito", { id: toastId });
      return true;
    } catch (error: any) {
      toast.error(`Error al descargar: ${error.message}`, { id: toastId });
      return false;
    }
  };

  return { onDownloadReport };
}
