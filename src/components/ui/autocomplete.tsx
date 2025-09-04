import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Skeleton } from "./skeleton";

export type Option = {
  value: string;
  label: string;
  [key: string]: string;
};

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  allowCustomInput?: boolean; // Nuevo prop para permitir entrada manual
  renderOption?: (option: Option) => ReactNode; // Nuevo prop para personalizar el renderizado de las opciones
  renderSelectedValue?: (option: Option) => ReactNode; // Nuevo prop para personalizar el valor seleccionado
};

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    {
      options,
      placeholder,
      emptyMessage,
      value,
      onValueChange,
      disabled,
      isLoading = false,
      className,
      showClearButton = true,
      allowCustomInput = false,
      renderOption,
      renderSelectedValue,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label || "");

    // Actualiza el estado interno cuando cambia la propiedad value
    useEffect(() => {
      setSelected(value);
      setInputValue(value?.label || "");
    }, [value]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (!input) {
          return;
        }

        if (!isOpen) {
          setOpen(true);
        }

        if (event.key === "Enter" && input.value.trim() !== "") {
          // Buscar coincidencias exactas basadas en el label
          const exactMatches = options.filter(
            (option) => option.label.toLowerCase() === input.value.trim().toLowerCase()
          );

          if (exactMatches.length === 1) {
            setSelected(exactMatches[0]);
            onValueChange?.(exactMatches[0]);
            setOpen(false);
          } else if (exactMatches.length > 1) {
            // Seleccionar la primera coincidencia o manejar múltiples según se requiera
            setSelected(exactMatches[0]);
            onValueChange?.(exactMatches[0]);
            setOpen(false);
          } else if (allowCustomInput) {
            // Si no hay coincidencias y se permite entrada manual, crear una nueva opción
            const customOption: Option = {
              value: input.value.trim(),
              label: input.value.trim(),
            };
            setSelected(customOption);
            onValueChange?.(customOption);
            setOpen(false);
          }
        }

        if (event.key === "Escape") {
          input.blur();
        }
      },
      [isOpen, options, onValueChange, allowCustomInput]
    );

    const handleBlur = useCallback(() => {
      setOpen(false);

      // Si se permite entrada manual y hay texto en el input, crear una opción personalizada
      if (allowCustomInput && inputValue.trim() !== "" && !selected) {
        const customOption: Option = {
          value: inputValue.trim(),
          label: inputValue.trim(),
        };
        setSelected(customOption);
        onValueChange?.(customOption);
      } else {
        setInputValue(selected?.label || "");
      }
    }, [selected, allowCustomInput, inputValue, onValueChange]);

    const handleSelectOption = useCallback(
      (selectedOption: Option) => {
        setInputValue(selectedOption.label);
        setSelected(selectedOption);
        onValueChange?.(selectedOption);
        setOpen(false);

        setTimeout(() => {
          inputRef?.current?.blur();
        }, 0);
      },
      [onValueChange]
    );

    const handleClearSelection = useCallback(() => {
      const emptyOption: Option = { value: "", label: "" };
      setSelected(undefined);
      setInputValue("");
      onValueChange?.(emptyOption);
      inputRef.current?.focus();
    }, [onValueChange]);

    const handleScrollCapture = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      e.stopPropagation();
    }, []);

    const handleCommandClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    // Filtrar opciones basadas en el input
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));

    // Crear un nuevo componente para mostrar el valor seleccionado personalizado
    const SelectedValueDisplay = () => {
      if (!selected) return null;

      if (renderSelectedValue) {
        return <div className="flex-1 overflow-hidden text-ellipsis">{renderSelectedValue(selected)}</div>;
      }

      return <div className="flex-1 overflow-hidden text-ellipsis capitalize">{selected.label}</div>;
    };

    return (
      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div className="relative" onClick={handleCommandClick}>
          {selected && renderSelectedValue ? (
            <div className="flex items-center border rounded-md pl-3 pr-8 py-2 h-10 bg-card dark:bg-slate-800 relative capitalize">
              <SelectedValueDisplay />
              {showClearButton && (
                <Button
                  type="button"
                  variant={"icon"}
                  size={"icon"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <CommandInput
                ref={ref}
                value={inputValue}
                onValueChange={isLoading ? undefined : setInputValue}
                onBlur={handleBlur}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(className, "capitalize")}
                showBorder={true}
              />
              {selected && showClearButton && (
                <Button
                  type="button"
                  variant={"icon"}
                  size={"icon"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>

        <div className={cn("relative", isOpen ? "mt-1" : "mt-0", className)}>
          {isOpen && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onMouseDown={() => {
                setOpen(false);
              }}
            />
          )}
          <div
            className={cn(
              "absolute top-0 z-50 w-full rounded-xl border border-input bg-card dark:bg-slate-800 shadow outline-none animate-in fade-in-0 zoom-in-95",
              isOpen ? "block" : "hidden"
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="max-h-[300px] overflow-y-auto" onScrollCapture={handleScrollCapture}>
              <CommandList
                className="h-full rounded-lg capitalize bg-card dark:bg-slate-800"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                {isLoading && (
                  <CommandPrimitive.Loading>
                    <div className="p-1">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CommandPrimitive.Loading>
                )}
                {!isLoading && filteredOptions.length > 0 && (
                  <CommandGroup>
                    {filteredOptions.map((option) => {
                      const isSelected = selected?.value === option.value;
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onSelect={() => handleSelectOption(option)}
                          className={cn("flex w-full items-center gap-2 ", !isSelected ? "pl-8" : null)}
                        >
                          {isSelected && <Check className="w-4" />}
                          {renderOption ? renderOption(option) : option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
                {!isLoading && filteredOptions.length === 0 && (
                  <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                    {allowCustomInput ? (
                      <div className="space-y-1">
                        <p>{emptyMessage}</p>
                        <p className="text-xs text-muted-foreground">
                          Presiona Enter para usar "{inputValue.trim()}" como valor personalizado
                        </p>
                      </div>
                    ) : (
                      emptyMessage
                    )}
                  </CommandPrimitive.Empty>
                )}
              </CommandList>
            </div>
          </div>
        </div>
      </CommandPrimitive>
    );
  }
);

AutoComplete.displayName = "AutoComplete";

export { AutoComplete };
