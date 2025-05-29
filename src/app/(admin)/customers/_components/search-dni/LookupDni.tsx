"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Info, Loader2, Search, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "../../_hooks/use-customers";
import type { CreateCustomersSchema } from "../../_schema/createCustomersSchema";

interface DniLookupProps {
  form: UseFormReturn<CreateCustomersSchema>;
}

export default function DniLookup({ form }: DniLookupProps) {
  const [dniInput, setDniInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchedDni, setLastSearchedDni] = useState("");
  const [dniToSearch, setDniToSearch] = useState("");

  const { customerDataByDni, isLoadingCustomerDataByDni, errorCustomerDataByDni, isSuccessCustomerDataByDni } =
    useCustomers({ dni: dniToSearch });

  // Validar si el DNI es válido (8 dígitos)
  const isDniValid = dniInput.length === 8 && /^\d{8}$/.test(dniInput);

  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = isLoadingCustomerDataByDni || dniInput === lastSearchedDni || !isDniValid;

  // Manejar la búsqueda del DNI - Solo cuando se presiona el botón
  const handleDniSearch = async () => {
    if (isButtonDisabled) return;

    setHasSearched(true);
    setLastSearchedDni(dniInput);
    setDniToSearch(dniInput);
  };

  // Auto-llenar el formulario cuando se encuentren datos
  useEffect(() => {
    if (isSuccessCustomerDataByDni && customerDataByDni) {
      form.setValue("name", customerDataByDni.name);
      form.setValue("documentNumber", customerDataByDni.dni);
    }
  }, [isSuccessCustomerDataByDni, customerDataByDni, form]);

  // Manejar el cambio en el input del DNI
  const handleDniChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 8);
    setDniInput(numericValue);
    form.setValue("documentNumber", numericValue);
  };

  // Manejar Enter para buscar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isButtonDisabled) {
      e.preventDefault();
      handleDniSearch();
    }
  };

  const hasError = (): boolean => {
    return Boolean(errorCustomerDataByDni);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <Input
              placeholder="Ingrese DNI (8 dígitos)"
              value={dniInput}
              onChange={(e) => handleDniChange(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={8}
              className={`
                tracking-wider transition-all duration-200
                ${isDniValid ? "border-primary/60 bg-primary/5" : ""}
                ${hasSearched && errorCustomerDataByDni ? "border-destructive/60 bg-destructive/5" : ""}
              `}
            />

            {/* Indicador de progreso sutil */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${(dniInput.length / 8) * 100}%` }}
              />
            </div>

            {/* Icono de estado */}
            {dniInput.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isDniValid ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                )}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={handleDniSearch}
            disabled={isButtonDisabled}
            variant={!isButtonDisabled ? "default" : "outline"}
            size="default"
            className="px-4"
          >
            {isLoadingCustomerDataByDni ? (
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
        {dniInput.length > 0 && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isDniValid ? (
                <span className="text-primary font-medium">
                  ✓ DNI válido. Verifique y haga clic en "Buscar" para consultar
                </span>
              ) : (
                <span className="text-muted-foreground">{dniInput.length}/8 dígitos</span>
              )}
            </div>

            {dniInput === lastSearchedDni && hasSearched && (
              <Badge variant="secondary" className="text-xs">
                Consultado
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoadingCustomerDataByDni && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <div className="text-sm">
            <span className="font-medium">Consultando RENIEC...</span>
            <span className="text-muted-foreground ml-2">DNI {dniInput}</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {isSuccessCustomerDataByDni && customerDataByDni && hasSearched && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
          <div className="p-1.5 rounded-md bg-primary/10">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">Datos encontrados</div>
            <div className="text-foreground font-semibold">{customerDataByDni.name}</div>
            <div className="text-xs text-muted-foreground">DNI: {customerDataByDni.dni}</div>
          </div>
          <User className="h-5 w-5 text-primary/60 shrink-0" />
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
              {errorCustomerDataByDni instanceof Error
                ? errorCustomerDataByDni.message
                : typeof errorCustomerDataByDni === "object" &&
                    errorCustomerDataByDni !== null &&
                    "message" in errorCustomerDataByDni
                  ? String((errorCustomerDataByDni as any).message)
                  : "No se pudo obtener los datos del DNI. Verifique el número e intente nuevamente."}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!hasSearched && dniInput.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Los datos se completarán automáticamente una vez encontrados
          </span>
        </div>
      )}
    </div>
  );
}
