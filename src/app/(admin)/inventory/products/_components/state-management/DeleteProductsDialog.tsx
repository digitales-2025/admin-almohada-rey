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
import { useProducts } from "../../_hooks/use-products";
import { Product } from "../../_types/products";

interface DeleteProductsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  products: Row<Product>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteProductsDialog({ products, showTrigger = true, onSuccess, ...props }: DeleteProductsDialogProps) {
  const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onDeleteProducts } = useProducts();

  const onDeleteProductsHandler = () => {
    onDeleteProducts(products);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Eliminar ({products.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará a<span className="font-medium"> {products.length}</span>
              {products.length === 1 ? " producto" : " productos"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected rows"
              onClick={onDeleteProductsHandler}
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
            Eliminar ({products.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción eliminará a<span className="font-medium">{products.length}</span>
            {products.length === 1 ? " cliente" : " clientes"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onDeleteProductsHandler} disabled={isDeletePending}>
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
