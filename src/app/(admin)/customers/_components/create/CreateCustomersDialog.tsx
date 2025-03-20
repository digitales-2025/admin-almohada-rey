"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCustomers } from "../../_hooks/use-customers";
import { CreateCustomersSchema, customersSchema } from "../../_schema/createCustomersSchema";
import CreateUserForm from "./CreateCustomersForm";

const dataForm = {
  button: "Crear cliente",
  title: "Crear Cliente",
  description: "Complete los detalles a continuación para crear nuevos clientes.",
};

export function CreateCustomersDialog() {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateCustomer, isSuccessCreateCustomer } = useCustomers();

  const form = useForm<CreateCustomersSchema>({
    resolver: zodResolver(customersSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      birthPlace: "",
      country: "",
      documentType: undefined,
      documentNumber: "",
      maritalStatus: undefined,
      occupation: "",
    },
  });

  const onSubmit = async (input: CreateCustomersSchema) => {
    startCreateTransition(() => {
      onCreateCustomer(input);
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessCreateCustomer) {
      form.reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateCustomer]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              <CreateUserForm form={form} onSubmit={onSubmit}>
                <DialogFooter className="w-full">
                  <div className="flex gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isCreatePending} className="w-full">
                      {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      Registrar
                    </Button>
                  </div>
                </DialogFooter>
              </CreateUserForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {dataForm.button}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
        </DrawerHeader>

        {/* The key fix is in this ScrollArea configuration */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[40vh] px-0">
            <div className="px-4">
              <CreateUserForm form={form} onSubmit={onSubmit}>
                <DrawerFooter className="px-0 pt-2">
                  <Button disabled={isCreatePending} className="w-full">
                    {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    Registrar
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </CreateUserForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
