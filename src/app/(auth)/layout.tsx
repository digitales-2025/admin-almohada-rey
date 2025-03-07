"use client";

import { ReactNode } from "react";
import Cookies from "js-cookie";

import { AppSidebar } from "@/components/layout/app-sidebar";
import SkipToMain from "@/components/skip-to-main";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SearchProvider } from "@/context/search-context";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const defaultOpen = Cookies.get("sidebar:state") !== "false";

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <div className="flex h-svh">
          <AppSidebar />
          <div
            id="content"
            className={cn(
              "ml-auto w-full max-w-full",
              "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
              "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
              "transition-[width] duration-200 ease-linear",
              "flex flex-col",
              "group-data-[scroll-locked=1]/body:h-full",
              "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
            )}
          >
            {children}
          </div>
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}
