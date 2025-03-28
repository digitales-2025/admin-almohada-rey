import { Grid3X3, Layers } from "lucide-react";

import { FloorTypeEnum } from "../_types/roomTypes";

export const FloorTypeLabels: Record<
  FloorTypeEnum,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    description: string;
  }
> = {
  [FloorTypeEnum.LAMINATING]: {
    label: "Laminado",
    icon: Layers,
    className: "text-amber-700 border-amber-200 bg-amber-50",
    description: "Piso de madera laminada, elegante y fácil de limpiar",
  },
  [FloorTypeEnum.CARPETING]: {
    label: "Alfombra",
    icon: Grid3X3,
    className: "text-blue-700 border-blue-200 bg-blue-50",
    description: "Piso alfombrado, cálido y confortable",
  },
};
