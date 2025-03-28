"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { ReservationCustomer, ReservationGuest, ReservationUser } from "../../../_schemas/reservation.schemas";
import { CustomerMetadata } from "./CustomerMetadata";
import { GuestsTable } from "./GuestCardTable";
import { CustomerMetadataMobile } from "./GuestMobileCommonMetadata";

export function GuestsDetailsDialog({
  guests,
  customer,
  user,
}: {
  guests: ReservationGuest[];
  customer: ReservationCustomer;
  user: ReservationUser;
}) {
  const DIALOG_MESSAGES = {
    button: "Mostrar Acompañantes",
    title: "Detalles de venta de productos",
    description: `Aquí puedes ver el detalle de la venta de productos.`,
    cancel: "Cerrar",
  } as const;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  //   if (branchQuery.isLoading) {
  //     return (
  //       <Button type="button" disabled className="w-full flex items-center gap-2">
  //         <Skeleton className="h-4 w-4 rounded-full" />
  //         <Skeleton className="h-4 w-24" />
  //       </Button>
  //     );
  //   }

  //   if (branchQuery.isError) {
  //     return (
  //       <Button type="button" disabled className="w-full flex items-center gap-2">
  //         Error
  //       </Button>
  //     );
  //   }

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

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="ghost"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted text-sm bg-primary/10 hover:scale-105 hover:transition-all"
    >
      <Users className="text-primary !size-5" />
      {DIALOG_MESSAGES.button}
    </Button>
  );

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
            {/* <MovementsTable data={data}></MovementsTable> */}
            <GuestsTable data={guests}></GuestsTable>
          </div>
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
          {/* <MovementsTable data={data}></MovementsTable> */}
          <GuestsTable data={guests}></GuestsTable>
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
