"use client";

import React, { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMovements } from "../../_hooks/use-movements";
import ViewMovementsContent from "./ViewMovementsContent";

interface ViewMovementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}

export default function ViewMovementsDialog({ open, onOpenChange, id }: ViewMovementsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const { movementsById } = useMovements({
    id,
  });

  const totalAmount = movementsById?.movementsDetail.reduce((sum, item) => sum + (item.subtotal ?? 0), 0) ?? 0;
  const totalItems = movementsById?.movementsDetail.reduce((sum, item) => sum + item.quantity, 0);

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = movementsById?.movementsDetail.filter((detail) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      detail.product?.name?.toLowerCase().includes(searchTermLower) ||
      detail.product?.code?.toLowerCase().includes(searchTermLower)
    );
  });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-0">
          <DialogHeader className="sr-only">
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Detalle del Movimiento
            </DialogTitle>
            <DialogDescription className="text-slate-500">Detalle del movimiento de inventario</DialogDescription>
          </DialogHeader>
          <ViewMovementsContent
            filteredProducts={filteredProducts}
            isDesktop={isDesktop}
            movementsById={movementsById}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalAmount={totalAmount}
            totalItems={totalItems}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 overflow-hidden border-0">
        <DrawerHeader className="sr-only">
          <DrawerTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Detalle del Movimiento
          </DrawerTitle>
          <DrawerDescription className="text-slate-500">Detalle del movimiento de inventario</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className=" h-[70vh] pb-6">
          {" "}
          <ViewMovementsContent
            filteredProducts={filteredProducts}
            isDesktop={isDesktop}
            movementsById={movementsById}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalAmount={totalAmount}
            totalItems={totalItems}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
