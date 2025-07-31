import {
  BarChart2,
  BedDouble,
  CalendarCheck,
  Clipboard,
  CreditCard,
  HandCoins,
  Hotel,
  LayoutDashboard,
  Package,
  PackageMinus,
  PackagePlus,
  ShoppingBag,
  Tag,
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
              url: "/inventory/output",
              icon: PackageMinus,
            },
          ],
        },
        {
          title: "Almacén",
          url: "/inventory/warehouse",
          icon: Warehouse,
        },
        {
          title: "Productos",
          icon: Package,
          items: [
            {
              title: "Comercial",
              url: "/inventory/products/commercial",
              icon: ShoppingBag,
            },
            {
              title: "Uso Interno",
              url: "/inventory/products/internal_use",
              icon: Clipboard,
            },
          ],
        },
      ],
    },
    {
      title: "Gestión Hotelera",
      items: [
        {
          title: "Habitaciones",
          icon: Hotel,
          items: [
            {
              title: "Listado",
              url: "/rooms/list",
              icon: BedDouble,
            },
            {
              title: "Tipos",
              url: "/rooms/room-types",
              icon: Tag,
            },
          ],
        },
        {
          title: "Reservas",
          url: "/reservation",
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
        {
          title: "Gastos",
          url: "/expenses",
          icon: HandCoins,
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
        {
          title: "Reportes",
          url: "/reports",
          icon: BarChart2,
        },
      ],
    },
  ],
};
