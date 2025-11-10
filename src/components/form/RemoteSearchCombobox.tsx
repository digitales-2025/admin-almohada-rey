"use client";

import * as React from "react";
import { useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SmallErrorMessage } from "../errors/small-error-message";
import { Loading } from "../loading/small-loading";
import { NotFoundSearchResults } from "./not-found-search-comboox";

import "@reduxjs/toolkit";

//import { ALIGN_OPTIONS } from "@radix-ui/react-popper";

export type ComboBoxItemType<V> = {
  value: string;
  label: string | React.ReactNode;
  entity?: V;
  keywords?: string[];
};

export type RTKUseQueryHookResult<T, E> = {
  data?: T;
  error?: E;
  isLoading: boolean;
  isError: boolean;
  isLoadingError: boolean;
  refetch: () => void;
};

type ComboboxProps<T> = {
  value?: string;
  label?: string | React.ReactNode;
  onSelect: (value: string, label?: string, entity?: T) => void;
  items: ComboBoxItemType<T>[];
  queryState: RTKUseQueryHookResult<T[], Error>;
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string | React.ReactNode;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  onSearchChange?: (e: string) => void;
  disabled?: boolean;
  selected?: string[];
  popoverSameWidthAsTrigger?: boolean;
  align?: "start" | "center" | "end";
  popoverContentClassName?: string;
  total?: number;
  regexInput?: RegExp;
  notFoundAction?: React.ReactNode; // Nuevo prop para el componente de acción
};

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function SearchCombobox<T = unknown>({
  value,
  label,
  onSelect,
  items,
  queryState,
  searchPlaceholder = "Busca un item...",
  noResultsMsg = "Sin resultados",
  selectItemMsg = "Selecciona un item",
  className,
  unselect = false,
  unselectMsg = "Limpiar", //"None"
  onSearchChange,
  disabled = false,
  selected = [],
  popoverSameWidthAsTrigger = true,
  align,
  popoverContentClassName,
  total,
  regexInput,
  notFoundAction, // Nuevo prop utilizado
}: ComboboxProps<T>) {
  const [open, setOpenState] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const defaultError = new Error("Algo salió mal");
  const { isError, isLoading, isLoadingError, error, data, refetch } = queryState;
  const warningsMessages = useMemo(
    () => ({
      loading: "Cargando...",
      loadingError: "Fallo en la carga de los items",
      noItemsFound: "Sin resultados",
      //additionalOptions: "additional options are hidden.",
    }),
    []
  );

  const more = total ? total - items.length : 0;

  // Filtrar items localmente basado en el valor de búsqueda
  // Solo aplicar filtrado local si NO hay búsqueda remota (onSearchChange)
  const filteredItems = useMemo(() => {
    // Si hay búsqueda remota, NO filtrar localmente (dejar que el servidor filtre)
    if (onSearchChange) {
      return items;
    }

    // Solo filtrar localmente si NO hay búsqueda remota
    if (!searchValue.trim()) {
      return items;
    }

    const searchLower = searchValue.toLowerCase().trim();
    return items.filter((item) => {
      // Si tiene keywords, buscar en ellos
      if (item.keywords && item.keywords.length > 0) {
        return item.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower));
      }
      // Si el label es un string, buscar en él
      if (typeof item.label === "string") {
        return item.label.toLowerCase().includes(searchLower);
      }
      // Si no, buscar en el value
      return item.value.toLowerCase().includes(searchLower);
    });
  }, [items, searchValue, onSearchChange]);

  // Para búsqueda remota, usar debounce exactamente como antes
  const handleOnSearchChange = useDebouncedCallback((value: string) => {
    if (regexInput) {
      // Only call onSearchChange if the value matches the regex pattern or is empty
      if (regexInput.test(value) || value === "") {
        onSearchChange?.(value);
      }
    } else {
      onSearchChange?.(value);
    }
  }, 300) as (value: string) => void;

  // Handler para búsqueda local: actualiza inmediatamente (sin debounce)
  const handleOnSearchChangeImmediate = (value: string) => {
    // Actualizar el valor de búsqueda local inmediatamente para filtrado local
    setSearchValue(value);
  };

  function setOpen(isOpen: boolean) {
    setOpenState(isOpen);
    // Resetear la búsqueda cuando se abre o cierra el popover
    if (isOpen) {
      // Resetear el valor de búsqueda cuando se abre el popover
      setSearchValue("");
    } else {
      // Resetear el valor de búsqueda cuando se cierra el popover
      setSearchValue("");
      // Usar setTimeout para evitar el bucle infinito
      setTimeout(() => {
        handleOnSearchChange("None");
      }, 0);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between w-full truncate", className)}
          disabled={disabled}
        >
          <span className="truncate flex items-center capitalize">
            {typeof label === "string" ? label : (label ?? selectItemMsg)}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={popoverSameWidthAsTrigger ? popOverStyles : {}}
        className={cn("p-0", popoverContentClassName)}
        align={align}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={onSearchChange ? undefined : searchValue}
            onValueChange={onSearchChange ? handleOnSearchChange : handleOnSearchChangeImmediate}
          />
          <CommandList>
            {/* <CommandEmpty>{noResultsMsg}</CommandEmpty> */}
            {!isLoading && !isError && filteredItems.length === 0 && items.length > 0 && (
              <CommandEmpty>{noResultsMsg}</CommandEmpty>
            )}
            {!isLoading && !isError && items.length === 0 && <CommandEmpty>{noResultsMsg}</CommandEmpty>}
            {isLoading && <CommandEmpty>{warningsMessages.loading}</CommandEmpty>}
            {isError && <CommandEmpty>{error?.message}</CommandEmpty>}
            {isLoadingError && <CommandEmpty>{warningsMessages.loadingError}</CommandEmpty>}
            {isLoading && (
              <CommandGroup>
                <Loading variant="dots" size="sm" text="Buscando..." />
              </CommandGroup>
            )}
            {isError && (
              <CommandGroup>
                <SmallErrorMessage error={error ? error : defaultError} reset={refetch}></SmallErrorMessage>
              </CommandGroup>
            )}
            {isLoadingError && (
              <CommandGroup>
                <SmallErrorMessage error={error ? error : defaultError} reset={refetch}></SmallErrorMessage>
              </CommandGroup>
            )}
            {!isLoading && !isError && filteredItems.length === 0 && items.length > 0 && (
              <CommandGroup>
                <NotFoundSearchResults>{notFoundAction}</NotFoundSearchResults>
              </CommandGroup>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <CommandGroup>
                <NotFoundSearchResults>{notFoundAction}</NotFoundSearchResults>
              </CommandGroup>
            )}
            {data && (
              <CommandGroup>
                {unselect && (
                  <CommandItem
                    key="unselect"
                    value=""
                    onSelect={() => {
                      onSelect("");
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === "" ? "opacity-100" : "opacity-0")} />
                    {unselectMsg}
                  </CommandItem>
                )}
                {filteredItems.map((item) => {
                  const isSelected = value === item.value || selected.includes(item.value);
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      keywords={item.keywords ?? (typeof item.label === "string" ? [item.label] : [])}
                      onSelect={(value) => {
                        const labelText = typeof item.label === "string" ? item.label : item.value;
                        onSelect(value, labelText, item?.entity);
                        setOpen(false);
                      }}
                      className="capitalize"
                      disabled={isSelected}
                    >
                      {typeof item.label === "string" ? item.label : item.label}
                      <Check className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
          {!!more && <div className="px-3 py-2.5 text-sm opacity-50">{more} additional options are hidden.</div>}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
