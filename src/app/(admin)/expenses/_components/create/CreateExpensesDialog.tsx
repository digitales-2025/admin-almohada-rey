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
import { useExpenses } from "../../_hooks/use-expenses";
import { createExpenseSchema, CreateExpenseSchema } from "../../_schema/createExpensesSchema";
import CreateExpensesForm from "./CreateExpensesForm";

const dataForm = {
  button: "Crear gasto",
  title: "Crear Gasto",
  description: "Complete los detalles a continuación para registrar un nuevo gasto.",
};

interface CreateExpensesDialogProps {
  refetchPaginatedExpenses: () => void;
}

export function CreateExpensesDialog({ refetchPaginatedExpenses }: CreateExpensesDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateExpense, isSuccessCreateExpense } = useExpenses();

  const form = useForm<CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      description: "",
      category: undefined,
      paymentMethod: undefined,
      amount: 0,
      date: "",
      documentType: undefined,
      documentNumber: "",
      dataDocument: true,
    },
  });

  const onSubmit = async (input: CreateExpenseSchema) => {
    const { dataDocument, ...rest } = input;

    startCreateTransition(() => {
      if (dataDocument) {
        onCreateExpense({
          ...rest,
          documentType: input.documentType,
          documentNumber: input.documentNumber,
        });
      } else {
        onCreateExpense(rest);
      }
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessCreateExpense) {
      form.reset();
      refetchPaginatedExpenses();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateExpense]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4 px-0">
            <div className="px-6">
              <CreateExpensesForm form={form} onSubmit={onSubmit}>
                <DialogFooter className="w-full">
                  <div className="grid grid-cols-2 gap-2 w-full">
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
              </CreateExpensesForm>
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
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] px-0">
            <div className="px-4">
              <CreateExpensesForm form={form} onSubmit={onSubmit}>
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
              </CreateExpensesForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
