"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, CheckCircle, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCustomerBlacklist } from "../../_hooks/use-customer-blacklist";
import { toggleBlacklistSchema, type ToggleBlacklistSchema } from "../../_schema/toggleBlacklistSchema";
import { Customer } from "../../_types/customer";
import ToggleBlacklistForm from "./ToggleBlacklistForm";

interface ToggleBlacklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  onSuccess?: () => void;
}

const dataForm = {
  titleAdd: "Agregar a Lista Negra",
  titleRemove: "Remover de Lista Negra",
  descriptionAdd: "Complete los detalles para agregar el cliente a la lista negra.",
  descriptionRemove: "¿Está seguro que desea remover este cliente de la lista negra?",
};

export function ToggleBlacklistDialog({ open, onOpenChange, customer, onSuccess }: ToggleBlacklistDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [isTogglePending, startToggleTransition] = useTransition();
  const { onToggleBlacklist, isSuccessToggleBlacklist } = useCustomerBlacklist();

  const isCurrentlyBlacklisted = customer.isBlacklist === true;

  const form = useForm<ToggleBlacklistSchema>({
    resolver: zodResolver(toggleBlacklistSchema),
    defaultValues: {
      isBlacklist: !isCurrentlyBlacklisted, // Si está en blacklist, el toggle será para quitarlo (false)
      blacklistReason: "",
      blacklistDate: "",
    },
  });

  // Resetear el form cuando cambia el estado del cliente o se abre/cierra el dialog
  useEffect(() => {
    if (open) {
      form.reset({
        isBlacklist: !isCurrentlyBlacklisted,
        blacklistReason: "",
        blacklistDate: "",
      });
    }
  }, [open, isCurrentlyBlacklisted, form]);

  const onSubmit = async (input: ToggleBlacklistSchema) => {
    startToggleTransition(() => {
      onToggleBlacklist({
        id: customer.id,
        isBlacklist: input.isBlacklist,
        blacklistReason: input.blacklistReason,
        blacklistDate: input.blacklistDate,
      });
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessToggleBlacklist) {
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessToggleBlacklist]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent tabIndex={undefined} className="sm:max-w-[500px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{isCurrentlyBlacklisted ? dataForm.titleRemove : dataForm.titleAdd}</DialogTitle>
            <DialogDescription>
              {isCurrentlyBlacklisted ? dataForm.descriptionRemove : dataForm.descriptionAdd}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[70vh] px-0">
            <div className="px-6">
              <ToggleBlacklistForm
                form={form}
                onSubmit={onSubmit}
                isCurrentlyBlacklisted={isCurrentlyBlacklisted}
                customer={customer}
              >
                <DialogFooter className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isTogglePending} className="w-full">
                      {isTogglePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      {isCurrentlyBlacklisted ? (
                        <>
                          <CheckCircle className="mr-2 size-4" aria-hidden="true" />
                          Remover
                        </>
                      ) : (
                        <>
                          <Ban className="mr-2 size-4" aria-hidden="true" />
                          Agregar
                        </>
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </ToggleBlacklistForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle>{isCurrentlyBlacklisted ? dataForm.titleRemove : dataForm.titleAdd}</DrawerTitle>
          <DrawerDescription>
            {isCurrentlyBlacklisted ? dataForm.descriptionRemove : dataForm.descriptionAdd}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-0">
            <div className="px-4">
              <ToggleBlacklistForm
                form={form}
                onSubmit={onSubmit}
                isCurrentlyBlacklisted={isCurrentlyBlacklisted}
                customer={customer}
              >
                <DrawerFooter className="px-0 pt-2">
                  <Button disabled={isTogglePending} className="w-full">
                    {isTogglePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    {isCurrentlyBlacklisted ? (
                      <>
                        <CheckCircle className="mr-2 size-4" aria-hidden="true" />
                        Remover
                      </>
                    ) : (
                      <>
                        <Ban className="mr-2 size-4" aria-hidden="true" />
                        Agregar
                      </>
                    )}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </ToggleBlacklistForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
