"use client";

import { useState } from "react";
import { Calendar, DollarSign, FileText, LogOut, ShoppingCart, TrendingUp, Truck, Users } from "lucide-react";

import ReporteDialog from "@/app/(admin)/reports/_components/report-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Definición de tipos de reportes
const tiposReportes = [
  {
    id: "gastos",
    titulo: "Gastos",
    descripcion: "Reporte detallado de todos los gastos del período",
    icono: DollarSign,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "salidas",
    titulo: "Salidas",
    descripcion: "Registro de salidas de inventario y productos",
    icono: LogOut,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "reservas",
    titulo: "Reservas",
    descripcion: "Estado y detalle de todas las reservas",
    icono: Calendar,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "ventas",
    titulo: "Ventas",
    descripcion: "Reporte de ventas y facturación",
    icono: ShoppingCart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "clientes",
    titulo: "Clientes",
    descripcion: "Análisis de clientes y comportamiento",
    icono: Users,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "ingresos",
    titulo: "Ingresos",
    descripcion: "Detalle de todos los ingresos del período",
    icono: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "proveedores",
    titulo: "Proveedores",
    descripcion: "Reporte de proveedores y compras",
    icono: Truck,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "general",
    titulo: "Reporte General",
    descripcion: "Reporte completo de todas las operaciones",
    icono: FileText,
    color: "bg-gray-100 text-gray-600",
  },
];

export default function ReportesGrid() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReporteClick = (id: string) => {
    setReporteSeleccionado(id);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {tiposReportes.map((reporte) => (
          <Card
            key={reporte.id}
            className="transition-all duration-200 hover:shadow-md cursor-pointer"
            onClick={() => handleReporteClick(reporte.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{reporte.titulo}</CardTitle>
                <div className={`p-2 rounded-full ${reporte.color}`}>
                  <reporte.icono className="h-5 w-5" />
                </div>
              </div>
              <CardDescription>{reporte.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">Formato: Excel (.xlsx)</div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">Haz clic para generar</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {reporteSeleccionado && (
        <ReporteDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          tipoReporte={reporteSeleccionado}
          tituloReporte={tiposReportes.find((r) => r.id === reporteSeleccionado)?.titulo || ""}
        />
      )}
    </>
  );
}
