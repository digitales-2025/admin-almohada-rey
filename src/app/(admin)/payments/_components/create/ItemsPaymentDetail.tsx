import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CreateExtraServiceItem, CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import { CategoryPayment } from "../../_types/payment";
import {
  toggleItemSelection,
  updateServiceQuantity,
  updateServiceUnitPrice,
} from "../../_utils/createPaymentDetails.utils";

interface ItemsPaymentDetailProps {
  form: UseFormReturn<CreatePaymentDetailSchema>;
  fields: CreateExtraServiceItem[];
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  getCategoryById: (categoryId: string) => CategoryPayment;
  selectedItems: number[];
  setSelectedItems: (value: number[]) => void;
  watchExtraServices: CreateExtraServiceItem[];
  update: (index: number, value: CreateExtraServiceItem) => void;
  categories: CategoryPayment[];
  remove: (index: number) => void;
}

export default function ItemsPaymentDetail({
  form,
  fields,
  editMode,
  setEditMode,
  getCategoryById,
  selectedItems,
  setSelectedItems,
  watchExtraServices,
  categories,
  update,
  remove,
}: ItemsPaymentDetailProps) {
  return (
    <div className="border-t border-border">
      <div className="p-3 flex items-center justify-between bg-gradient-to-r from-primary/10 to-background border-b border-border">
        <h3 className="font-medium text-sm flex items-center gap-1.5 text-foreground">
          <div className="relative">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              {fields.length}
            </span>
          </div>
          Servicios Seleccionados
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={editMode ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs transition-all ${
              editMode ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary/10"
            }`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Guardar Cambios" : "Editar Precios"}
          </Button>
          {editMode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => form.setValue("extraServices", [])}
            >
              Limpiar Todo
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4">
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((service, index) => {
                const category = getCategoryById(service.category);
                return (
                  <div
                    key={service.id + index}
                    className={cn(
                      "relative overflow-hidden rounded-lg transition-all",
                      editMode
                        ? "bg-card/90 border-2 border-dashed border-border hover:border-primary/50"
                        : "bg-card hover:bg-card/90 border-2 border-border",
                      editMode && selectedItems.includes(index) && "border-primary bg-primary/5"
                    )}
                    style={{
                      backgroundImage: !editMode
                        ? `linear-gradient(135deg, ${category.color}10, transparent 80%)`
                        : "none",
                    }}
                    onClick={() => editMode && toggleItemSelection(index, selectedItems, setSelectedItems)}
                  >
                    <div className="relative z-10 p-4">
                      <div className="flex flex-col">
                        {/* Header with name and price */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground truncate capitalize">{service.name}</h4>
                              <div className="text-xs text-muted-foreground">
                                S/. {service.unitPrice.toFixed(2)} c/u
                              </div>
                            </div>
                          </div>

                          <div
                            className={cn(
                              "font-medium text-sm px-3 py-1 rounded-full",
                              editMode ? "bg-primary/10 text-primary" : "bg-card text-foreground border border-border"
                            )}
                          >
                            S/. {service.subtotal.toFixed(2)}
                          </div>
                        </div>

                        <Separator className="mb-2" />

                        {/* Controls section */}
                        <div className="flex flex-col items-center justify-between mt-2">
                          {editMode ? (
                            <div className="flex items-center gap-2 w-full">
                              <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                  <span className="text-xs text-muted-foreground">S/.</span>
                                </div>
                                <Input
                                  type="number"
                                  className="h-9 pl-8 pr-2 text-sm font-medium bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-md"
                                  value={service.unitPrice}
                                  min={0.01}
                                  step={0.01}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateServiceUnitPrice(
                                      index,
                                      Number.parseFloat(e.target.value) || 0,
                                      watchExtraServices,
                                      update
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-card rounded-md border border-border">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-md hover:bg-muted border-r border-border"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateServiceQuantity(
                                      index,
                                      service.quantity - 1,
                                      watchExtraServices,
                                      update,
                                      categories
                                    );
                                  }}
                                  disabled={service.quantity <= 1}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium">{service.quantity}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-md hover:bg-muted border-l border-border"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateServiceQuantity(
                                      index,
                                      service.quantity + 1,
                                      watchExtraServices,
                                      update,
                                      categories
                                    );
                                  }}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  remove(index);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium text-lg text-center">No hay servicios seleccionados</p>
              <p className="text-muted-foreground text-sm mt-2 text-center max-w-md">
                Explore las categorías disponibles y seleccione servicios para añadirlos a su reserva
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
