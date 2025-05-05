"use client";

import { useState } from "react";
import { Users, type LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ReservationCustomer, ReservationGuest, ReservationUser } from "../../../_schemas/reservation.schemas";
import { CustomerMetadata } from "./CustomerMetadata";
import { GuestsTable } from "./GuestCardTable";
import { CustomerMetadataMobile } from "./GuestMobileCommonMetadata";

type DialogConfig = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

function AddInfoCard({ guests }: { guests: ReservationGuest[] }) {
  const CONFIG_DATA: DialogConfig = {
    title: "Información adicional",
    description: "Aquí puedes ver el detalle de la información adicional.",
    Icon: Users,
  };
  if (!guests || guests.length === 0 || guests.every((guest) => !guest.additionalInfo)) {
    return null;
  }
  const hasAdditionalInfo = guests.some((guest) => guest.additionalInfo !== undefined);
  if (!hasAdditionalInfo) return null;
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <CONFIG_DATA.Icon></CONFIG_DATA.Icon>
          <span>{CONFIG_DATA.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto space-y-3">
        {guests.map((guest, idx) => (
          <div key={guest?.documentId ?? idx} className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">{guest.name}</div>
            <p>{JSON.stringify(guest.additionalInfo, null, 2)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function GuestsDetailsDialog({
  guests,
  customer,
  user,
}: {
  guests: ReservationGuest[];
  customer: ReservationCustomer;
  user: ReservationUser;
}) {
  console.log("GuestsDetailsDialog", JSON.stringify(guests, null, 2));
  const DIALOG_MESSAGES = {
    button: "Mostrar Acompañantes",
    title: "Detalles de venta de productos",
    description: `Aquí puedes ver el detalle de la venta de productos.`,
    cancel: "Cerrar",
  } as const;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = () => {
    setOpen(false);
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      <Button type="button" variant="outline" className="w-full" onClick={handleClose}>
        {DIALOG_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => {
    // Función para determinar el color según la cantidad de acompañantes
    const getAvatarColor = (guestCount: number) => {
      // Colores que varían según la cantidad de acompañantes - solo bg
      if (guestCount === 1) return "bg-blue-500";
      if (guestCount === 2) return "bg-green-500";
      if (guestCount === 3) return "bg-amber-500";
      if (guestCount === 4) return "bg-orange-500";
      if (guestCount >= 5) return "bg-red-500";
      return "bg-gray-400"; // Color por defecto
    };

    // Color para el avatar de +N según la cantidad total
    const extraAvatarColor = getAvatarColor(guests.length);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              size="sm"
              aria-label="Mostrar Acompañantes"
              className="flex items-center gap-2 p-2 hover:scale-105 hover:transition-all"
            >
              <div className="flex -space-x-1 mr-1">
                {guests.slice(0, 3).map((guest, index) => (
                  <Avatar
                    key={guest?.documentId ?? index}
                    className={`border-2 border-background w-9 h-9 ${getAvatarColor(index + 1)} text-white`}
                  >
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={guest.name} />
                    <AvatarFallback className={`text-xs text-white ${extraAvatarColor}`}>
                      {guest.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {guests.length > 3 && (
                  <Avatar className={`border-2 border-background w-9 h-9  text-white`}>
                    <AvatarFallback className={`text-xs text-white ${extraAvatarColor}`}>
                      +{guests.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{DIALOG_MESSAGES.button}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)]">
          <DialogHeader className="sm:flex-row justify-between">
            <div className="space-y-2">
              <DialogTitle className="w-full">{DIALOG_MESSAGES.title}</DialogTitle>
              <div className="space-y-1">
                <DialogDescription className="w-full text-balance">{DIALOG_MESSAGES.description}</DialogDescription>
                <DialogDescription className="w-full text-balance capitalize">
                  Reservado por: {user.name}
                </DialogDescription>
              </div>
            </div>
            <CustomerMetadata data={customer}></CustomerMetadata>
          </DialogHeader>
          <div className="overflow-auto max-h-full space-y-3">
            <GuestsTable data={guests}></GuestsTable>
          </div>
          <AddInfoCard guests={guests}></AddInfoCard>
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent className="overflow-auto">
        <DialogHeader className="sm:flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="w-full">{DIALOG_MESSAGES.title}</DialogTitle>
            <DialogDescription className="w-full text-balance">{DIALOG_MESSAGES.description}</DialogDescription>
          </div>
          <CustomerMetadataMobile data={customer}></CustomerMetadataMobile>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)] space-y-3">
          <GuestsTable data={guests}></GuestsTable>
        </div>
        <AddInfoCard guests={guests}></AddInfoCard>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
