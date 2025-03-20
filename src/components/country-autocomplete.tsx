"use client";

import type React from "react";
import { forwardRef, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Search, X } from "lucide-react";

import { CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type CountryOption = {
  value: string;
  label: string;
  [key: string]: string;
};

// Define the props that EmbeddedFlag components expect
interface EmbeddedFlagProps {
  title: string;
  [key: string]: any;
}

type CountryAutocompleteProps = {
  options: CountryOption[];
  flags: Record<string, React.ComponentType<EmbeddedFlagProps>>;
  placeholder?: string;
  emptyMessage?: string;
  value?: CountryOption;
  onValueChange?: (value: CountryOption) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  showClearButton?: boolean;
};

const CountryAutocomplete = forwardRef<HTMLInputElement, CountryAutocompleteProps>(
  ({
    options,
    flags,
    placeholder = "Buscar país...",
    emptyMessage = "No se encontró ningún país",
    value,
    onValueChange,
    disabled = false,
    isLoading = false,
    className,
    showClearButton = true,
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<CountryOption | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label || "");
    const [inputFocused, setInputFocused] = useState(false);

    // Update internal state when value prop changes
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
          // Find exact matches based on label
          const exactMatches = options.filter(
            (option) => option.label.toLowerCase() === input.value.trim().toLowerCase()
          );

          if (exactMatches.length >= 1) {
            setSelected(exactMatches[0]);
            onValueChange?.(exactMatches[0]);
            setOpen(false);
          }
        }

        if (event.key === "Escape") {
          input.blur();
        }
      },
      [isOpen, options, onValueChange]
    );

    const handleBlur = useCallback(() => {
      setOpen(false);
      setInputValue(selected?.label || "");
      setInputFocused(false);
    }, [selected]);

    const handleFocus = useCallback(() => {
      setOpen(true);
      setInputFocused(true);
    }, []);

    const handleSelectOption = useCallback(
      (selectedOption: CountryOption) => {
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
      const emptyOption: CountryOption = { value: "", label: "" };
      setSelected(undefined);
      setInputValue("");
      onValueChange?.(emptyOption);
    }, [onValueChange]);

    // Filter options based on input value
    const filteredOptions = inputValue
      ? options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
      : options;

    // Get the flag component for the selected country
    const SelectedFlagComponent = selected?.value ? flags[selected.value] : null;

    // Custom input rendering to show flag alongside text
    const renderCustomInput = () => {
      if (!selected || !SelectedFlagComponent) {
        return (
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("border-0 focus-visible:ring-0 focus-visible:ring-offset-0", className)}
          />
        );
      }

      // When a country is selected and not focused, show custom display
      if (!inputFocused) {
        return (
          <div className="flex items-center w-full h-10 px-3 py-2 text-sm" onClick={() => inputRef.current?.focus()}>
            <div className="flex items-center gap-2 pl-6">
              <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                <SelectedFlagComponent title={selected.label} />
              </span>
              <span>{selected.label}</span>
            </div>
            <input ref={inputRef} onFocus={handleFocus} onBlur={handleBlur} className="absolute opacity-0 w-0 h-0" />
          </div>
        );
      }

      // When focused, show normal input
      return (
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pl-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0", className)}
        />
      );
    };

    return (
      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div className="relative" ref={wrapperRef}>
          <div className="relative flex items-center border rounded-md">
            <Search className="absolute left-3 h-4 w-4 shrink-0 opacity-50 z-[1]" />
            <div className="flex-1 overflow-hidden">{renderCustomInput()}</div>
            {selected && showClearButton && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 z-[2] bg-white"
                onClick={handleClearSelection}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className={cn("relative", isOpen ? "mt-1" : "mt-0")}>
            <div
              className={cn(
                "absolute top-0 z-10 w-full rounded-md border border-input bg-white shadow-md outline-none animate-in fade-in-0 zoom-in-95",
                isOpen ? "block" : "hidden"
              )}
            >
              <ScrollArea className="h-[300px]">
                <CommandList className="h-full rounded-md">
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
                        const FlagComponent = flags[option.value];

                        return (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                            onSelect={() => handleSelectOption(option)}
                            className={cn("flex items-center gap-2 py-2", !isSelected ? "pl-8" : null)}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                            {FlagComponent && (
                              <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                                <FlagComponent title={option.label} />
                              </span>
                            )}
                            <span>{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                  {!isLoading && filteredOptions.length === 0 && (
                    <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                      {emptyMessage}
                    </CommandPrimitive.Empty>
                  )}
                </CommandList>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CommandPrimitive>
    );
  }
);

CountryAutocomplete.displayName = "CountryAutocomplete";

export { CountryAutocomplete };
