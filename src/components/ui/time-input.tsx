"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTimeChange?: (time: string) => void;
  label?: string;
  includeSeconds?: boolean;
  min?: string;
  max?: string;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      className,
      onTimeChange,
      onChange,
      label,
      value,
      defaultValue,
      disabled,
      includeSeconds = false,
      min,
      max,
      ...props
    },
    ref
  ) => {
    // Usar el hook para detectar pantallas móviles
    const isMobile = useMediaQuery("(max-width: 640px)");
    const [time, setTime] = React.useState<string>(
      (value as string) || (defaultValue as string) || (includeSeconds ? "12:00:00" : "12:00")
    );
    const [open, setOpen] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Actualizar estado interno cuando cambia el prop value
    React.useEffect(() => {
      if (value !== undefined) {
        setTime(value as string);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;

      // Solo actualizar si el tiempo está dentro del rango o si está vacío
      if (newTime === "" || isTimeInRange(newTime)) {
        setTime(newTime);

        if (onTimeChange) {
          onTimeChange(newTime);
        }

        if (onChange) {
          onChange(e);
        }
      }
    };

    // Memoizar las partes del tiempo para evitar cálculos repetidos
    const timeParts = React.useMemo(() => {
      const parts = time.split(":");
      return {
        hours: Number.parseInt(parts[0]),
        minutes: Number.parseInt(parts[1]),
        seconds: parts.length > 2 ? Number.parseInt(parts[2]) : 0,
      };
    }, [time]);

    // Función para convertir tiempo en string a minutos totales para comparación
    const timeToMinutes = React.useCallback((timeStr: string): number => {
      const parts = timeStr.split(":");
      const hours = Number.parseInt(parts[0], 10);
      const minutes = Number.parseInt(parts[1], 10);
      const seconds = parts.length > 2 ? Number.parseInt(parts[2], 10) / 60 : 0;
      return hours * 60 + minutes + seconds;
    }, []);

    // Verificar si un tiempo está dentro del rango permitido
    const isTimeInRange = React.useCallback(
      (timeToCheck: string): boolean => {
        if (!min && !max) return true;

        const timeInMinutes = timeToMinutes(timeToCheck);

        if (min && timeInMinutes < timeToMinutes(min)) return false;
        if (max && timeInMinutes > timeToMinutes(max)) return false;

        return true;
      },
      [min, max, timeToMinutes]
    );

    const { hours, minutes, seconds } = timeParts;

    // Optimizar la función updateTime con useCallback para evitar recreaciones
    const updateTime = React.useCallback(
      (newHours: number, newMinutes: number, newSeconds?: number) => {
        const formattedHours = newHours.toString().padStart(2, "0");
        const formattedMinutes = newMinutes.toString().padStart(2, "0");

        let newTime: string;

        if (includeSeconds) {
          const formattedSeconds = (newSeconds !== undefined ? newSeconds : seconds).toString().padStart(2, "0");
          newTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        } else {
          newTime = `${formattedHours}:${formattedMinutes}`;
        }

        // Verificar si el nuevo tiempo está dentro del rango permitido
        if (!isTimeInRange(newTime)) return;

        setTime(newTime);

        if (onTimeChange) {
          onTimeChange(newTime);
        }

        // Actualizar el input nativo
        if (inputRef.current) {
          inputRef.current.value = newTime;

          // Crear un evento sintético para mantener compatibilidad
          const event = new Event("change", { bubbles: true }) as any;
          Object.defineProperty(event, "target", {
            writable: false,
            value: { value: newTime, name: inputRef.current.name },
          });

          if (onChange) {
            onChange(event as React.ChangeEvent<HTMLInputElement>);
          }
        }
      },
      [includeSeconds, seconds, onTimeChange, onChange, isTimeInRange]
    );

    // Función para obtener el período (AM/PM)
    const getPeriod = React.useCallback((hour: number) => (hour < 12 ? "AM" : "PM"), []);

    // Reemplazar la función generateNumbers para que siempre muestre los números en orden descendente
    const generateNumbers = React.useCallback(
      (current: number, max: number) => {
        // Usar 3 elementos en móvil y 5 en escritorio
        const visible = isMobile ? 3 : 5;
        const half = Math.floor(visible / 2);
        const numbers = [];

        // Generar números en orden descendente, con el valor actual en el centro
        for (let i = 0; i < visible; i++) {
          // Calcular el offset desde el centro
          const offset = i - half;

          // Calcular el número para esta posición
          // Para mantener el orden descendente, usamos resta en lugar de suma
          let num = (current - offset + max) % max;

          // Asegurar que el número esté en el rango correcto
          if (num < 0) num += max;
          if (num >= max) num -= max;

          numbers.push(num);
        }

        return numbers;
      },
      [isMobile]
    );

    // Memoizar los arrays de valores visibles para evitar recálculos innecesarios
    const visibleHours = React.useMemo(() => generateNumbers(hours, 24), [generateNumbers, hours]);
    const visibleMinutes = React.useMemo(() => generateNumbers(minutes, 60), [generateNumbers, minutes]);
    const visibleSeconds = React.useMemo(
      () => (includeSeconds ? generateNumbers(seconds, 60) : []),
      [includeSeconds, generateNumbers, seconds]
    );

    // Funciones de incremento/decremento
    const incrementHour = React.useCallback(() => {
      const newHour = (hours + 1) % 24;
      if (
        isTimeInRange(
          `${newHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
        )
      ) {
        updateTime(newHour, minutes, seconds);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange, includeSeconds]);

    const decrementHour = React.useCallback(() => {
      const newHour = (hours - 1 + 24) % 24;
      if (
        isTimeInRange(
          `${newHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
        )
      ) {
        updateTime(newHour, minutes, seconds);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange, includeSeconds]);

    const incrementMinute = React.useCallback(() => {
      const newMinute = (minutes + 1) % 60;
      if (
        isTimeInRange(
          `${hours.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
        )
      ) {
        updateTime(hours, newMinute, seconds);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange, includeSeconds]);

    const decrementMinute = React.useCallback(() => {
      const newMinute = (minutes - 1 + 60) % 60;
      if (
        isTimeInRange(
          `${hours.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
        )
      ) {
        updateTime(hours, newMinute, seconds);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange, includeSeconds]);

    const incrementSecond = React.useCallback(() => {
      const newSecond = (seconds + 1) % 60;
      if (
        isTimeInRange(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${newSecond.toString().padStart(2, "0")}`
        )
      ) {
        updateTime(hours, minutes, newSecond);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange]);

    const decrementSecond = React.useCallback(() => {
      const newSecond = (seconds - 1 + 60) % 60;
      if (
        isTimeInRange(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${newSecond.toString().padStart(2, "0")}`
        )
      ) {
        updateTime(hours, minutes, newSecond);
      }
    }, [updateTime, hours, minutes, seconds, isTimeInRange]);

    const handleHourClick = React.useCallback(
      (hour: number) => () => updateTime(hour, minutes, seconds),
      [updateTime, minutes, seconds]
    );
    const handleMinuteClick = React.useCallback(
      (minute: number) => () => updateTime(hours, minute, seconds),
      [updateTime, hours, seconds]
    );
    const handleSecondClick = React.useCallback(
      (second: number) => () => updateTime(hours, minutes, second),
      [updateTime, hours, minutes]
    );

    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}

        <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
            {/* Icono de reloj con trigger del popover */}
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                  "text-gray-500 dark:text-gray-400 hover:text-primary",
                  "h-5 w-5 rounded-full flex items-center justify-center",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                  "transition-colors duration-200",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Clock className="h-4 w-4 shrink-0" />
              </button>
            </PopoverTrigger>

            {/* Input de tiempo */}
            <input
              ref={inputRef}
              type={includeSeconds ? "text" : "time"}
              value={time}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              className={cn(
                // Estilos base
                "w-full h-9 pl-10 rounded-md transition-all duration-200",
                "text-sm font-medium",
                "appearance-none",

                // Estilos de borde y fondo
                "border border-input",

                // Estados
                focused && "border-primary ring-2 ring-primary/20",
                hovered && !focused && "border-gray-400 dark:border-gray-600",
                disabled && "opacity-60 bg-gray-100 dark:bg-gray-900 cursor-not-allowed",

                // Estilos personalizados para el selector nativo
                "[&::-webkit-calendar-picker-indicator]:bg-transparent",
                "[&::-webkit-calendar-picker-indicator]:hover:bg-gray-200/30",
                "[&::-webkit-calendar-picker-indicator]:dark:hover:bg-gray-700/30",
                "[&::-webkit-calendar-picker-indicator]:rounded-md",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                "[&::-webkit-calendar-picker-indicator]:p-1",
                "[&::-webkit-calendar-picker-indicator]:opacity-0", // Ocultar el icono nativo

                // Clase personalizada
                className
              )}
              placeholder={includeSeconds ? "HH:MM:SS" : "HH:MM"}
              {...props}
            />

            {/* Contenido del popover - Selector de tiempo tipo minutero */}
            <PopoverContent
              className={cn(
                "p-0 border-0 shadow-xl rounded-xl overflow-hidden",
                includeSeconds ? "w-[400px]" : "w-[250px]"
              )}
              align="start"
              sideOffset={10}
            >
              <div className="bg-card">
                {/* Visualización de la hora seleccionada */}
                <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                  <div className="text-center bg-gray-50 dark:bg-gray-900 py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-800 ">
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center justify-center">
                      <span>{hours.toString().padStart(2, "0")}</span>
                      <span className="mx-2 text-gray-400">:</span>
                      <span>{minutes.toString().padStart(2, "0")}</span>
                      {includeSeconds && (
                        <>
                          <span className="mx-2 text-gray-400">:</span>
                          <span className="text-orange-500">{seconds.toString().padStart(2, "0")}</span>
                        </>
                      )}
                      <span className="ml-3 text-lg font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {getPeriod(hours)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selectores tipo minutero */}
                <div className={cn("flex p-4", includeSeconds ? "space-x-3" : "space-x-4")}>
                  {/* Selector de horas */}
                  <div className={cn("flex-1", includeSeconds && "flex-[0.8]")}>
                    <div className="flex items-center justify-center mb-2">
                      <label className="text-xs font-medium text-primary text-center">Horas</label>
                    </div>

                    {/* Selector tipo minutero para horas */}
                    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      {/* Botón para incrementar */}
                      <button
                        type="button"
                        onClick={incrementHour}
                        disabled={
                          !isTimeInRange(
                            `${((hours + 1) % 24).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          )
                        }
                        className={cn(
                          "absolute top-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-t-lg z-10 transition-colors",
                          !isTimeInRange(
                            `${((hours + 1) % 24).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          ) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      {/* Números del minutero */}
                      <div className="py-10 px-2">
                        <div className="relative">
                          {visibleHours.map((hour, index) => {
                            const isCenter = index === Math.floor(visibleHours.length / 2);

                            // Verificar si esta hora está dentro del rango permitido
                            const hourTime = `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`;
                            const isDisabled = !isTimeInRange(hourTime);

                            return (
                              <div
                                key={`hour-${index}`}
                                className={cn(
                                  "py-2 flex items-center justify-center transition-all duration-150",
                                  isCenter
                                    ? "bg-primary/10 text-primary font-bold rounded-md"
                                    : isDisabled
                                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                      : "text-gray-500 dark:text-gray-400 cursor-pointer"
                                )}
                                onClick={isDisabled ? undefined : handleHourClick(hour)}
                              >
                                <div className="flex items-center justify-center">
                                  <span>{hour.toString().padStart(2, "0")}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Botón para decrementar */}
                      <button
                        type="button"
                        onClick={decrementHour}
                        disabled={
                          !isTimeInRange(
                            `${((hours - 1 + 24) % 24).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          )
                        }
                        className={cn(
                          "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-b-lg z-10 transition-colors",
                          !isTimeInRange(
                            `${((hours - 1 + 24) % 24).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          ) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Selector de minutos */}
                  <div className={cn("flex-1", includeSeconds && "flex-[1]")}>
                    <div className="flex items-center justify-center mb-2">
                      <label className="text-xs font-medium text-primary">Minutos</label>
                    </div>

                    {/* Selector tipo minutero para minutos */}
                    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      {/* Botón para incrementar */}
                      <button
                        type="button"
                        onClick={incrementMinute}
                        disabled={
                          !isTimeInRange(
                            `${hours.toString().padStart(2, "0")}:${((minutes + 1) % 60).toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          )
                        }
                        className={cn(
                          "absolute top-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-t-lg z-10 transition-colors",
                          !isTimeInRange(
                            `${hours.toString().padStart(2, "0")}:${((minutes + 1) % 60).toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          ) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      {/* Números del minutero */}
                      <div className="py-10 px-2">
                        <div className="relative">
                          {visibleMinutes.map((minute, index) => {
                            const isCenter = index === Math.floor(visibleMinutes.length / 2);
                            const isMultipleOf5 = minute % 5 === 0;

                            // Verificar si este minuto está dentro del rango permitido
                            const minuteTime = `${hours.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`;
                            const isDisabled = !isTimeInRange(minuteTime);

                            return (
                              <div
                                key={`minute-${index}`}
                                className={cn(
                                  "py-2 flex items-center justify-center transition-all duration-150",
                                  isCenter
                                    ? "bg-primary/10 text-primary font-bold rounded-md"
                                    : isDisabled
                                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                      : isMultipleOf5
                                        ? "text-gray-700 dark:text-gray-300 cursor-pointer"
                                        : "text-gray-500 dark:text-gray-400 cursor-pointer"
                                )}
                                onClick={isDisabled ? undefined : handleMinuteClick(minute)}
                              >
                                <div className="flex items-center justify-center">
                                  <span>{minute.toString().padStart(2, "0")}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Botón para decrementar */}
                      <button
                        type="button"
                        onClick={decrementMinute}
                        disabled={
                          !isTimeInRange(
                            `${hours.toString().padStart(2, "0")}:${((minutes - 1 + 60) % 60).toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          )
                        }
                        className={cn(
                          "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-b-lg z-10 transition-colors",
                          !isTimeInRange(
                            `${hours.toString().padStart(2, "0")}:${((minutes - 1 + 60) % 60).toString().padStart(2, "0")}${includeSeconds ? `:${seconds.toString().padStart(2, "0")}` : ""}`
                          ) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Selector de segundos */}
                  {includeSeconds && (
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-orange-500">Segundos</label>
                      </div>

                      {/* Selector tipo minutero para segundos */}
                      <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        {/* Botón para incrementar */}
                        <button
                          type="button"
                          onClick={incrementSecond}
                          disabled={
                            !isTimeInRange(
                              `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${((seconds + 1) % 60).toString().padStart(2, "0")}`
                            )
                          }
                          className={cn(
                            "absolute top-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-t-lg z-10 transition-colors",
                            !isTimeInRange(
                              `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${((seconds + 1) % 60).toString().padStart(2, "0")}`
                            ) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Números del minutero */}
                        <div className="py-10 px-2">
                          <div className="relative">
                            {visibleSeconds.map((second, index) => {
                              const isCenter = index === Math.floor(visibleSeconds.length / 2);
                              const isMultipleOf5 = second % 5 === 0;

                              // Verificar si este segundo está dentro del rango permitido
                              const secondTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
                              const isDisabled = !isTimeInRange(secondTime);

                              return (
                                <div
                                  key={`second-${index}`}
                                  className={cn(
                                    "py-2 flex items-center justify-center transition-all duration-150",
                                    isCenter
                                      ? "bg-orange-500/10 text-orange-500 font-bold text-xl rounded-md"
                                      : isDisabled
                                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                        : isMultipleOf5
                                          ? "text-gray-700 dark:text-gray-300 cursor-pointer"
                                          : "text-gray-500 dark:text-gray-400 cursor-pointer"
                                  )}
                                  onClick={isDisabled ? undefined : handleSecondClick(second)}
                                >
                                  <div className="flex items-center justify-center">
                                    <span>{second.toString().padStart(2, "0")}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botón para decrementar */}
                        <button
                          type="button"
                          onClick={decrementSecond}
                          disabled={
                            !isTimeInRange(
                              `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${((seconds - 1 + 60) % 60).toString().padStart(2, "0")}`
                            )
                          }
                          className={cn(
                            "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-b-lg z-10 transition-colors",
                            !isTimeInRange(
                              `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${((seconds - 1 + 60) % 60).toString().padStart(2, "0")}`
                            ) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-card border-t border-gray-200 dark:border-gray-800">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-white dark:text-black"
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Input oculto para mantener compatibilidad con ref si es necesario */}
          {ref !== inputRef && <input type="hidden" ref={ref} value={time} name={props.name} disabled={disabled} />}
        </div>
      </div>
    );
  }
);
TimeInput.displayName = "TimeInput";

export { TimeInput };
