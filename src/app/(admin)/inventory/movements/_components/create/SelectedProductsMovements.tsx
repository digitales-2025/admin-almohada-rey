import { Minus, PackageMinus, PackagePlus, Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateInventoryMovement } from "../../_schemas/createMovementsSchema";
import { CreateMovementDetailDto, MovementsType, ProductAvailable } from "../../_types/movements";

interface SelectedProductsMovementsProps {
  form: UseFormReturn<CreateInventoryMovement>;
  productsAvailible: ProductAvailable[];
  type: MovementsType;
  selectedProducts: CreateMovementDetailDto[];
  handleProductToggle: (productId: string, unitCost: number, stockQuantity?: number) => void;
  updateProductQuantity: (productId: string, quantity: number, stockQuantity?: number) => void;
  updateProductUnitCost: (productId: string, unitCost: number) => void;
}

export default function SelectedProductsMovements({
  form,
  productsAvailible,
  type,
  selectedProducts,
  handleProductToggle,
  updateProductQuantity,
  updateProductUnitCost,
}: SelectedProductsMovementsProps) {
  return (
    <CardContent className="pt-0 px-0">
      <ScrollArea className="h-[450px] w-full px-1">
        <div className="px-6">
          {selectedProducts.length === 0 ? (
            <div className="flex h-32 items-center justify-center p-4 text-center text-slate-500">
              <div className="text-center">
                {type === MovementsType.INPUT ? (
                  <PackagePlus className="mx-auto h-8 w-8 text-slate-300" />
                ) : (
                  <PackageMinus className="mx-auto h-8 w-8 text-slate-300" />
                )}
                <p className="mt-2">No hay productos seleccionados</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {selectedProducts.map((product, index) => {
                const productInfo = Array.isArray(productsAvailible)
                  ? productsAvailible?.find((r) => r.id === product.productId)
                  : undefined;

                return (
                  <div
                    key={product.productId}
                    className={`relative overflow-hidden rounded-xl border shadow-sm transition-all ${
                      type === MovementsType.INPUT ? "border-emerald-100" : "border-red-100"
                    }`}
                  >
                    {/* Barra superior de color */}
                    <div className={`h-1 w-full ${type === MovementsType.INPUT ? "bg-emerald-500" : "bg-red-500"}`} />

                    <div className="p-3">
                      {/* Encabezado con nombre e icono */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              type === MovementsType.INPUT
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {type === MovementsType.INPUT ? (
                              <PackagePlus className="h-4 w-4 shrink-0" />
                            ) : (
                              <PackageMinus className="h-4 w-4 shrink-0" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1 capitalize">
                              {productInfo?.name}
                            </h4>
                          </div>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleProductToggle(product.productId, product.unitCost)}
                          className={`h-7 w-7 rounded-full p-0 ${
                            type === MovementsType.INPUT
                              ? "hover:bg-emerald-50 hover:text-emerald-600"
                              : "hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Quitar producto</span>
                        </Button>
                      </div>

                      {/* Controles de cantidad y costo */}
                      <div className="mt-3 grid grid-cols-1 px-6 gap-3">
                        <div
                          className={`rounded-lg px-4 pt-3 ${
                            type === MovementsType.INPUT
                              ? "bg-emerald-50 dark:bg-emerald-950"
                              : "bg-red-50 dark:bg-red-950"
                          }`}
                        >
                          <Label htmlFor={`quantity-${product.productId}`} className="mb-1 block text-xs font-medium">
                            Cantidad
                          </Label>
                          <div
                            className={`flex h-8 items-center rounded-md border border-input bg-white dark:bg-input/30 mx-auto my-2 overflow-hidden 
                              focus-within:ring-2 focus-within:ring-offset-2 ${
                                type === MovementsType.INPUT
                                  ? "focus-within:ring-emerald-500/50 focus-within:border-emerald-500"
                                  : "focus-within:ring-red-500/50 focus-within:border-red-500"
                              }`}
                          >
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (type === MovementsType.OUTPUT) {
                                  updateProductQuantity(product.productId, product.quantity - 1, productInfo?.quantity);
                                } else {
                                  updateProductQuantity(product.productId, product.quantity - 1);
                                }
                              }}
                              className="h-full rounded-l-md px-2 bg-white dark:bg-input/30 focus:outline-none"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              id={`quantity-${product.productId}`}
                              type="number"
                              step="0.01"
                              value={product.quantity}
                              max={type === MovementsType.OUTPUT ? productInfo?.quantity : undefined}
                              onChange={(e) => {
                                const rawValue = e.target.value;

                                // Permitir valores decimales directamente
                                let numericValue = parseFloat(rawValue);

                                // Si no es un número, usar 0.01
                                if (isNaN(numericValue) || numericValue <= 0) {
                                  numericValue = 0.01;
                                }

                                // Redondear a 2 decimales
                                numericValue = Math.round(numericValue * 100) / 100;

                                // Para salidas, no permitir exceder el stock
                                if (type === MovementsType.OUTPUT) {
                                  numericValue = Math.min(numericValue, productInfo?.quantity || 0);
                                }

                                updateProductQuantity(product.productId, numericValue);
                              }}
                              className="h-full border-0 text-center focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                              min="0.01"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (type === MovementsType.OUTPUT) {
                                  updateProductQuantity(product.productId, product.quantity + 1, productInfo?.quantity);
                                } else {
                                  updateProductQuantity(product.productId, product.quantity + 1);
                                }
                              }}
                              className="h-full rounded-r-md px-2 bg-white dark:bg-input/30 focus:outline-none"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {form.formState.errors.movementDetail?.[index]?.quantity && (
                            <p className="mt-1 text-xs text-red-500">
                              {form.formState.errors.movementDetail[index]?.quantity?.message}
                            </p>
                          )}

                          {type === MovementsType.OUTPUT && productInfo && (
                            <p className="mt-1 text-xs text-slate-500">Stock disponible: {productInfo.quantity}</p>
                          )}
                        </div>

                        <div
                          className={`rounded-lg px-4 pt-3 ${
                            type === MovementsType.INPUT
                              ? "bg-emerald-50 dark:bg-emerald-950"
                              : "bg-red-50 dark:bg-red-950"
                          }`}
                        >
                          <Label htmlFor={`cost-${product.productId}`} className="mb-1 block text-xs font-medium">
                            Costo por unidad
                          </Label>
                          <div
                            className={`bg-white dark:bg-input/30 rounded-md border mx-auto my-2 focus-within:ring-2 focus-within:ring-offset-2 ${
                              type === MovementsType.INPUT
                                ? "focus-within:ring-emerald-500/50 focus-within:border-emerald-500"
                                : "focus-within:ring-red-500/50 focus-within:border-red-500"
                            }`}
                          >
                            <Input
                              id={`cost-${product.productId}`}
                              type="number"
                              value={product.unitCost}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const numericValue = Number.parseFloat(rawValue);

                                if (isNaN(numericValue)) {
                                  return;
                                }

                                const roundedValue = Math.round(numericValue * 100) / 100;
                                // Eliminamos la restricción de mínimo 1
                                const inputValue = roundedValue;

                                updateProductUnitCost(product.productId, inputValue);
                              }}
                              placeholder="Costo unitario"
                              className="h-8 border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                              step="0.01"
                              min="0.01"
                            />
                          </div>
                          {form.formState.errors.movementDetail?.[index]?.unitCost && (
                            <p className="mt-1 text-xs text-red-500">
                              {form.formState.errors.movementDetail[index]?.unitCost?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="items-center text-center">
        {form.formState.errors.movementDetail && (
          <div className="p-4 pt-0">
            <p className="text-sm text-red-500">{form.formState.errors.movementDetail.message}</p>
          </div>
        )}
      </div>
    </CardContent>
  );
}
