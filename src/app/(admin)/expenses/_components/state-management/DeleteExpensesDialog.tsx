"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { useExpenses } from "../../_hooks/use-expenses";
import { HotelExpense } from "../../_types/expenses";

interface DeleteExpensesDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  expenses: Row<HotelExpense>["original"][] | HotelExpense[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteExpensesDialog({ expenses, showTrigger = true, onSuccess, ...props }: DeleteExpensesDialogProps) {
  const [isDeletePending, startTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onDeleteExpenses } = useExpenses();

  const onDeleteExpensesHandler = () => {
    startTransition(async () => {
      await onDeleteExpenses(expenses.map((e) => e.id));
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Eliminar ({expenses.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará <span className="font-medium">{expenses.length}</span>
              {expenses.length === 1 ? " gasto" : " gastos"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected rows"
              onClick={onDeleteExpensesHandler}
              disabled={isDeletePending}
            >
              {isDeletePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Eliminar ({expenses.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción eliminará <span className="font-medium">{expenses.length}</span>
            {expenses.length === 1 ? " gasto" : " gastos"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onDeleteExpensesHandler} disabled={isDeletePending}>
            {isDeletePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Eliminar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
