"use client";

import { useEffect, useState } from "react";

export function useReportQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Actualizar el estado inicialmente
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Callback para cuando cambia el estado
    const listener = () => {
      setMatches(media.matches);
    };

    // Agregar listener
    media.addEventListener("change", listener);

    // Limpiar listener
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [matches, query]);

  return matches;
}
