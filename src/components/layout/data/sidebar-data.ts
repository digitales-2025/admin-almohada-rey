import {
  AlertCircle,
  AlertTriangle,
  AudioWaveform,
  Bell,
  Bug,
  CheckSquare,
  Command,
  FileLock,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LockOpen,
  MessageSquare,
  Package,
  Palette,
  PenTool,
  ServerOff,
  Settings,
  Shield,
  ShieldOff,
  UserCheck,
  Users,
  UserX,
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
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Apps",
          url: "/apps",
          icon: Package,
        },
        {
          title: "Chats",
          url: "/chats",
          badge: "3",
          icon: MessageSquare,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: LockOpen,
          items: [
            {
              title: "Sign In",
              url: "/sign-in",
            },
            {
              title: "Sign In (2 Col)",
              url: "/sign-in-2",
            },
            {
              title: "Sign Up",
              url: "/sign-up",
            },
            {
              title: "Forgot Password",
              url: "/forgot-password",
            },
            {
              title: "OTP",
              url: "/otp",
            },
          ],
        },
        {
          title: "Errors",
          icon: Bug,
          items: [
            {
              title: "Unauthorized",
              url: "/401",
              icon: Shield,
            },
            {
              title: "Forbidden",
              url: "/403",
              icon: ShieldOff,
            },
            {
              title: "Not Found",
              url: "/404",
              icon: AlertCircle,
            },
            {
              title: "Internal Server Error",
              url: "/500",
              icon: AlertTriangle,
            },
            {
              title: "Maintenance Error",
              url: "/503",
              icon: FileLock,
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: UserCheck,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: PenTool,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: FileLock,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
