"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Props que recibe el componente para controlar la selección de mes y año
interface SelectorFechasProps {
  mesSeleccionado: number | null; // Índice del mes seleccionado (0-11)
  añoSeleccionado: number | null; // Año seleccionado
  onMesChange: (mes: number) => void; // Callback para cambiar el mes
  onAñoChange: (año: number) => void; // Callback para cambiar el año
}

// Componente selector de fechas (mes y año)
export default function SelectorFechas({
  mesSeleccionado,
  añoSeleccionado,
  onMesChange,
  onAñoChange,
}: SelectorFechasProps) {
  // Año actual como valor predeterminado
  const añoActual = new Date().getFullYear();
  // Estado local para mostrar el año en el selector
  const [añoMostrado, setAñoMostrado] = useState(añoSeleccionado || añoActual);

  // Lista de nombres de los meses
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Incrementa el año mostrado y lo notifica al padre
  const incrementarAño = () => {
    const nuevoAño = añoMostrado + 1;
    setAñoMostrado(nuevoAño);
    onAñoChange(nuevoAño);
  };

  // Decrementa el año mostrado y lo notifica al padre
  const decrementarAño = () => {
    const nuevoAño = añoMostrado - 1;
    setAñoMostrado(nuevoAño);
    onAñoChange(nuevoAño);
  };

  // Selecciona un mes y, si no hay año seleccionado, selecciona el año mostrado
  const seleccionarMes = (index: number) => {
    onMesChange(index);
    if (añoSeleccionado === null) {
      onAñoChange(añoMostrado);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Selector de año */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-full max-w-[200px] mx-auto border rounded-lg overflow-hidden">
          <div className="flex flex-col items-center">
            {/* Botón para aumentar el año */}
            <Button variant="ghost" size="sm" className="w-full rounded-none hover:bg-muted" onClick={incrementarAño}>
              <ChevronUp className="h-5 w-5" />
            </Button>
            {/* Año mostrado */}
            <div className="py-2 text-center font-medium text-lg w-full">{añoMostrado}</div>
            {/* Botón para disminuir el año */}
            <Button variant="ghost" size="sm" className="w-full rounded-none hover:bg-muted" onClick={decrementarAño}>
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selector de mes */}
      <div className="grid grid-cols-3 gap-2">
        {meses.map((mes, index) => (
          <Button
            key={index}
            variant={mesSeleccionado === index ? "default" : "outline"}
            className={cn(
              "h-auto py-2 px-1 text-sm",
              mesSeleccionado === index && "bg-primary text-primary-foreground"
            )}
            onClick={() => seleccionarMes(index)}
          >
            {mes}
          </Button>
        ))}
      </div>

      {/* Información de selección actual */}
      <div className="text-sm text-center text-muted-foreground">
        {mesSeleccionado !== null && añoSeleccionado !== null
          ? `Seleccionado: ${meses[mesSeleccionado]} ${añoSeleccionado}`
          : "Selecciona un mes y año para continuar"}
      </div>
    </div>
  );
}
