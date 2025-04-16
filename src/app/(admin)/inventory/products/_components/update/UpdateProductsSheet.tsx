"use client";

import type React from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProducts } from "../../_hooks/use-products";
import { CreateProductsSchema, productsSchema } from "../../_schema/createProductsSchema";
import { Product } from "../../_types/products";
import UpdateCustomersForm from "./UpdateProductsForm";

const infoSheet = {
  title: "Actualizar Producto",
  description: "Actualiza la información del producto y guarda los cambios",
};

interface UpdateProductSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateProductSheet({ product, open, onOpenChange }: UpdateProductSheetProps) {
  const { onUpdateProduct, isSuccessUpdateProduct, isLoadingUpdateProduct } = useProducts();

  const form = useForm<CreateProductsSchema>({
    resolver: zodResolver(productsSchema),
    defaultValues: {
      name: product.name ?? "",
      type: product.type ?? "",
      unitCost: product.unitCost ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name ?? "",
        type: product.type ?? "",
        unitCost: product.unitCost ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const onSubmit = async (input: CreateProductsSchema) => {
    onUpdateProduct({
      ...input,
      id: product.id,
    });
  };

  useEffect(() => {
    if (isSuccessUpdateProduct) {
      form.reset();
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateProduct, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge
              className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200 hover:bg-emerald-200"
              variant="secondary"
            >
              {product.code}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateCustomersForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="submit" disabled={isLoadingUpdateProduct}>
                  {isLoadingUpdateProduct && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateCustomersForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
