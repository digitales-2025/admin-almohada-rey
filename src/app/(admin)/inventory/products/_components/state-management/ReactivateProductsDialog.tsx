import { ComponentPropsWithoutRef } from "react";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";

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

interface ReactivateProductsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  products: Row<Product>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const ReactivateProductsDialog = ({
  products,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateProductsDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onReactivateProducts, isLoadingReactivateProducts } = useProducts();

  const onReactivateProductsHandler = () => {
    onReactivateProducts(products);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Reactivar ({products.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará a <span className="font-medium"> {products.length}</span>
              {products.length === 1 ? " producto" : " productos"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Reactivate selected rows"
              onClick={onReactivateProductsHandler}
              disabled={isLoadingReactivateProducts}
            >
              {isLoadingReactivateProducts && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Reactivar
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
            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
            Reactivar ({products.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción reactivará a<span className="font-medium">{products.length}</span>
            {products.length === 1 ? " usuario" : " usuarios"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Reactivate selected rows"
            onClick={onReactivateProductsHandler}
            disabled={isLoadingReactivateProducts}
          >
            {isLoadingReactivateProducts && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Reactivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
