"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AlertCircle, Building2, CheckCircle, Info, Loader2, Search } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRuc } from "../../_hooks/use-ruc";
import type { CreateCustomersSchema } from "../../_schema/createCustomersSchema";

interface RucLookupProps {
  form: UseFormReturn<CreateCustomersSchema>;
}

export default function RucLookup({ form }: RucLookupProps) {
  const [rucInput, setRucInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  // Se permite consultar el mismo RUC múltiples veces; no se necesita recordar el último buscado
  const [rucToSearch, setRucToSearch] = useState("");

  const { rucData, isLoadingRucData, isFetchingRucData, errorRucData, isSuccessRucData, refetchRucData } = useRuc({
    ruc: rucToSearch,
  });

  // Validar si el RUC es válido (11 dígitos)
  const isRucValid = rucInput.length === 11 && /^\d{11}$/.test(rucInput);

  // Determinar si el botón debe estar deshabilitado
  const isQueryLoading = isLoadingRucData || isFetchingRucData;
  const isButtonDisabled = isQueryLoading || !isRucValid;

  // Manejar la búsqueda del RUC - Solo cuando se presiona el botón
  const handleRucSearch = async () => {
    if (isButtonDisabled) return;

    setHasSearched(true);
    if (rucInput === rucToSearch) {
      // Forzar refetch cuando se busca el mismo RUC
      refetchRucData();
    } else {
      setRucToSearch(rucInput);
    }
  };

  // Auto-llenar el formulario cuando se encuentren datos
  useEffect(() => {
    if (isSuccessRucData && rucData) {
      // Asignar los datos del RUC a los campos correspondientes del formulario
      form.setValue("companyName", rucData.nombreORazonSocial || "");
      form.setValue("ruc", rucData.ruc || "");
      form.setValue("companyAddress", rucData.domicilioFiscal || "");
    }
  }, [isSuccessRucData, rucData, form]);

  // Manejar el cambio en el input del RUC
  const handleRucChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 11);
    setRucInput(numericValue);
    form.setValue("ruc", numericValue);
  };

  // Manejar Enter para buscar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      e.preventDefault();
      handleRucSearch();
    }
  };

  const hasError = (): boolean => {
    return Boolean(errorRucData);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <Input
              placeholder="Ingrese RUC (11 dígitos)"
              value={rucInput}
              onChange={(e) => handleRucChange(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={11}
              className={`
                tracking-wider transition-all duration-200
                ${isRucValid ? "border-primary/60 bg-primary/5" : ""}
                ${hasSearched && errorRucData ? "border-destructive/60 bg-destructive/5" : ""}
              `}
            />

            {/* Indicador de progreso sutil */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${(rucInput.length / 11) * 100}%` }}
              />
            </div>

            {/* Icono de estado */}
            {rucInput.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isRucValid ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                )}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleRucSearch}
            disabled={isButtonDisabled}
            variant={!isButtonDisabled ? "default" : "outline"}
            size="default"
            className="px-4"
          >
            {isQueryLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </>
            )}
          </Button>
        </div>

        {/* Status simple */}
        {rucInput.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isRucValid ? (
                <span className="text-primary font-medium">
                  ✓ RUC válido. Verifique y haga clic en "Buscar" para consultar
                </span>
              ) : (
                <span className="text-muted-foreground">{rucInput.length}/11 dígitos</span>
              )}
            </div>

            {/* Ya no mostramos "Consultado"; se permite consultar repetidamente */}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoadingRucData && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <div className="text-sm">
            <span className="font-medium">Consultando SUNAT...</span>
            <span className="text-muted-foreground ml-2">RUC {rucInput}</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccessRucData && rucData && hasSearched && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
          <div className="p-1.5 rounded-md bg-primary/10">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">Datos encontrados</div>
            <div className="text-foreground font-semibold">{rucData.nombreORazonSocial}</div>
            <div className="text-xs text-muted-foreground">RUC: {rucData.ruc}</div>
            {rucData.domicilioFiscal && (
              <div className="text-xs text-muted-foreground">Dirección: {rucData.domicilioFiscal}</div>
            )}
          </div>
          <Building2 className="h-5 w-5 text-primary/60 shrink-0" />
        </div>
      )}

      {/* Error State */}
      {hasSearched && hasError() && (
        <div className="flex items-start gap-3 p-3 rounded-lg border bg-destructive/5 border-destructive/20">
          <div className="p-1.5 rounded-md bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-destructive">Error en la consulta</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {errorRucData instanceof Error
                ? errorRucData.message
                : typeof errorRucData === "object" && errorRucData !== null && "message" in errorRucData
                  ? String((errorRucData as any).message)
                  : "No se pudo obtener los datos del RUC. Verifique el número e intente nuevamente."}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!hasSearched && rucInput.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Los datos de la empresa se completarán automáticamente una vez encontrados
          </span>
        </div>
      )}
    </div>
  );
}
