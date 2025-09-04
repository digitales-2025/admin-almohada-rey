import Link from "next/link";
import { ArrowLeft, Home, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UnauthorizedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export function Unauthorized({
  title = "Acceso No Autorizado",
  description = "No tienes permisos para acceder a esta sección. Contacta al administrador si crees que esto es un error.",
  showBackButton = true,
  backUrl = "/dashboard",
}: UnauthorizedProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full border border-muted/10" />
          <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full border border-muted/8" />
          <div className="absolute bottom-1/4 left-1/3 h-24 w-24 rounded-full border border-muted/6" />
          <div className="absolute bottom-1/3 right-1/3 h-20 w-20 rounded-full border border-muted/12" />
        </div>

        {/* Main Content */}
        <div className="relative rounded-3xl border border-border bg-background/95 backdrop-blur-sm p-10 text-center">
          {/* Icon Container */}
          <div className="mb-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-destructive/30 bg-destructive/8">
              <ShieldX className="h-10 w-10 text-destructive" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-xl font-bold tracking-tight">{title}</h1>

          {/* Description */}
          <p className="mb-10 text-muted-foreground leading-relaxed text-sm max-w-sm mx-auto">{description}</p>

          {/* Action Button */}
          {showBackButton && (
            <div className="space-y-6">
              <Button asChild size="lg" className="group px-8">
                <Link href={backUrl} className="flex items-center gap-3">
                  <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="text-sm">Volver al Dashboard</span>
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>

              {/* Additional Info */}
              <div className="text-sm text-muted-foreground">
                <p>Contacta al administrador para obtener acceso</p>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full border border-muted/20 bg-background/60" />
        <div className="absolute -bottom-6 -right-6 h-8 w-8 rounded-full border border-muted/20 bg-background/60" />
        <div className="absolute top-1/2 -left-12 h-6 w-6 rounded-full border border-muted/15 bg-background/40" />
        <div className="absolute top-1/3 -right-12 h-4 w-4 rounded-full border border-muted/15 bg-background/40" />
      </div>
    </div>
  );
}
