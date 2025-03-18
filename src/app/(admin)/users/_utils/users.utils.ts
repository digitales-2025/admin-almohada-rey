import { BookUser, ShieldUser } from "lucide-react";

import { UserRolType } from "../_types/user";

export const UserRolTypeLabels: Record<
  UserRolType,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [UserRolType.ADMIN]: {
    label: "Administrador",
    icon: ShieldUser,
    className: "text-blue-700",
  },
  [UserRolType.RECEPCIONIST]: {
    label: "Recepcionista",
    icon: BookUser,
    className: "text-orange-700",
  },
};
