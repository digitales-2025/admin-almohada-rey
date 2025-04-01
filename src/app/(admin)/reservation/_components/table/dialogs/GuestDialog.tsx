"use client";

import { useState } from "react";
import { Users } from "lucide-react";

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
import { useMediaQuery } from "@/hooks/use-media-query";
import { ReservationCustomer, ReservationGuest, ReservationUser } from "../../../_schemas/reservation.schemas";
import { CustomerMetadata } from "./CustomerMetadata";
import { GuestsTable } from "./GuestCardTable";
import { CustomerMetadataMobile } from "./GuestMobileCommonMetadata";

function AddInfoCard({ guests }: { guests: ReservationGuest[] }) {
  if (!guests || guests.length === 0 || guests.every((guest) => !guest.additionalInfo)) {
    return null;
  }
  const hasAdditionalInfo = guests.some((guest) => guest.additionalInfo !== undefined);
  if (!hasAdditionalInfo) return null;
  // const hasAdditionalInfoWithValue = guests.some((guest) => guest.additionalInfo !== undefined && guest.additionalInfo !== "" && Object.keys(guest.additionalInfo).length > 0);
  // if (!hasAdditionalInfoWithValue) return null;
  // const hasAdditionalInfoWithValueAndKeys = guests.some((guest) => guest.additionalInfo !== undefined && guest.additionalInfo !== "" && Object.keys(guest.additionalInfo).length > 0 && Object.keys(guest.additionalInfo).some((key) => guest.additionalInfo[key] !== undefined && guest.additionalInfo[key] !== "")
  // if (!hasAdditionalInfoWithValueAndKeys) return null;
  // const hasAdditionalInfoWithValueAndKeysAndValues = guests.some((guest) => guest.additionalInfo !== undefined && guest.additionalInfo !== "" && Object.keys(guest.additionalInfo).length > 0 && Object.keys(guest.additionalInfo).some((key) => guest.additionalInfo[key] !== undefined && guest.additionalInfo[key] !== "" && Object.keys(guest.additionalInfo[key]).length > 0)
  // )
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <Users></Users>
          <span>Detalles adicionales</span>
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
