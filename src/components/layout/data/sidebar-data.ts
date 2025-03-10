import {
  ArrowDownCircle,
  ArrowUpCircle,
  AudioWaveform,
  BedDouble,
  Building2,
  CalendarCheck,
  ClipboardEdit,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  LayoutDashboard,
  ListPlus,
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
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
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
