import {
  ArrowDownCircle,
  ArrowUpCircle,
  BedDouble,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
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
              icon: ArrowDownCircle,
            },
            {
              title: "Salidas",
              url: "/inventory/outputs",
              icon: ArrowUpCircle,
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
          url: "/clients",
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
    {
      title: "Configuración",
      items: [
        {
          title: "Ajustes",
          url: "/ajustes",
          icon: Settings,
        },
      ],
    },
  ],
};
