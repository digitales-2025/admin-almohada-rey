"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export default function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const [val, setVal] = useState(pathname ?? "/settings");

  return (
    <>
      {/* Versión móvil con Select */}
      <div className="p-1 md:hidden">
        <Select
          value={val}
          onValueChange={(value) => {
            setVal(value);
            window.location.href = value;
          }}
        >
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Seleccionar sección" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex items-center gap-x-2">
                  {item.icon}
                  {item.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Versión desktop con ScrollArea */}
      <div className="hidden md:block">
        <ScrollArea className="w-full py-2">
          <nav className={cn("flex flex-col space-y-1", className)} {...props}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}
