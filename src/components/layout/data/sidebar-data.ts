import {
  BedDouble,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Package,
  PackageMinus,
  PackagePlus,
  UserCircle,
  Users,
  Warehouse,
} from "lucide-react";

import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      title: "Inventario",
      items: [
        {
          title: "Movimientos",
          icon: Package,
          items: [
            {
              title: "Entradas",
              url: "/inventory/input",
              icon: PackagePlus,
            },
            {
              title: "Salidas",
              url: "/inventory/outputs",
              icon: PackageMinus,
            },
          ],
        },
        {
          title: "Almacén",
          url: "/inventory/warehouse",
          icon: Warehouse,
        },
      ],
    },
    {
      title: "Gestión Hotelera",
      items: [
        {
          title: "Habitaciones",
          url: "/rooms",
          icon: BedDouble,
        },
        {
          title: "Reservas",
          url: "/bookings",
          icon: CalendarCheck,
        },
        {
          title: "Clientes",
          url: "/customers",
          icon: UserCircle,
        },
        {
          title: "Pagos",
          url: "/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Administración",
      items: [
        {
          title: "Usuarios",
          url: "/users",
          icon: Users,
        },
      ],
    },
  ],
};
