"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectorFechasProps {
  mesSeleccionado: number | null;
  añoSeleccionado: number | null;
  onMesChange: (mes: number) => void;
  onAñoChange: (año: number) => void;
}

export default function SelectorFechas({
  mesSeleccionado,
  añoSeleccionado,
  onMesChange,
  onAñoChange,
}: SelectorFechasProps) {
  // Año actual como valor predeterminado
  const añoActual = new Date().getFullYear();
  const [añoMostrado, setAñoMostrado] = useState(añoSeleccionado || añoActual);

  // Lista de meses
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

  // Función para incrementar el año
  const incrementarAño = () => {
    const nuevoAño = añoMostrado + 1;
    setAñoMostrado(nuevoAño);
    onAñoChange(nuevoAño);
  };

  // Función para decrementar el año
  const decrementarAño = () => {
    const nuevoAño = añoMostrado - 1;
    setAñoMostrado(nuevoAño);
    onAñoChange(nuevoAño);
  };

  // Función para seleccionar un mes
  const seleccionarMes = (index: number) => {
    onMesChange(index);
    // Si no hay año seleccionado, seleccionar el año mostrado
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
            <Button variant="ghost" size="sm" className="w-full rounded-none hover:bg-muted" onClick={incrementarAño}>
              <ChevronUp className="h-5 w-5" />
            </Button>
            <div className="py-2 text-center font-medium text-lg w-full">{añoMostrado}</div>
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

      {/* Información de selección */}
      <div className="text-sm text-center text-muted-foreground">
        {mesSeleccionado !== null && añoSeleccionado !== null
          ? `Seleccionado: ${meses[mesSeleccionado]} ${añoSeleccionado}`
          : "Selecciona un mes y año para continuar"}
      </div>
    </div>
  );
}
