import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface NotFoundSearchResultsProps {
  children?: ReactNode;
  title?: string;
  description?: string;
}

export function NotFoundSearchResults({
  children,
  title = "No se encontraron resultados",
  description = "Intenta ajustar tu búsqueda o utiliza diferentes términos.",
}: NotFoundSearchResultsProps) {
  return (
    <div className="flex h-fit shrink-0 flex-col items-center justify-center rounded-md border border-dashed p-4">
      {children ? (
        <div className="w-full">{children}</div>
      ) : (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  );
}
