import ReportesGrid from "@/app/(admin)/reports/_components/reports-grid";

export default function ReportesPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Panel de Reportes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Selecciona el tipo de reporte que deseas generar. Todos los reportes se descargarán en formato Excel.
          </p>
        </div>

        <ReportesGrid />
      </div>
    </div>
  );
}
