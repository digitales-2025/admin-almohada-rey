import { PackagePlus } from "lucide-react";

import { PageMetadata } from "@/types/statics/pageMetadata";

export const METADATA: PageMetadata = {
  title: "Reservaciones",
  entityName: "Reservación",
  entityPluralName: "Reservaciones",
  description: "Gestiona las reservaciones de habitaciones.",
  Icon: PackagePlus,
  dataDependencies: [
    {
      dependencyName: "Habitaciones",
      dependencyUrl: "/rooms",
    },
  ],
} as const;
