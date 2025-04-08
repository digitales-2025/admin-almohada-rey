import { useState } from "react";
import { Check, ChevronRight, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreateExtraServiceItem, CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import { CategoryPayment } from "../../_types/payment";
import {
  addService,
  removeSelectedItems,
  toggleItemSelection,
  updateServiceQuantity,
} from "../../_utils/createPaymentDetails.utils";
import PaymentServiceCard from "./PaymentServiceCard";

interface SelectServicesPaymentDetailProps {
  form: UseFormReturn<CreatePaymentDetailSchema>;
  categories: CategoryPayment[];
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedItems: number[];
  setSelectedItems: (value: number[]) => void;
  getCategoryById: (categoryId: string) => CategoryPayment;
  filteredItems: CategoryPayment[];
  fields: CreateExtraServiceItem[];
  append: (value: CreateExtraServiceItem) => void;
  remove: (index: number) => void;
  update: (index: number, value: CreateExtraServiceItem) => void;
}

export default function SelectServicesPaymentDetail({
  form,
  categories,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  selectedItems,
  setSelectedItems,
  getCategoryById,
  filteredItems,
  fields,
  append,
  remove,
  update,
}: SelectServicesPaymentDetailProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [editMode, setEditMode] = useState(false);
  const watchExtraServices = form.watch("extraServices");

  return (
    <div>
      <TabsContent value="services" className="flex flex-col">
        <div className="grid grid-cols-[280px_1fr] h-full">
          {/* Left sidebar - Categories and search */}
          <div className="border-r p-4 flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                className="pl-9 pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  size={"icon"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>

            <h3 className="font-medium text-sm mb-2">Categorias</h3>
            <div className="space-y-1 mb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={"outline"}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left",
                    activeCategory === category.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Selected items summary */}
            {fields.length > 0 && (
              <div className="mt-auto pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">Items seleccionados</h3>
                  <Badge variant="outline">{fields.length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Monto Total</div>
                <div className="text-xl font-bold">S/. {form.getValues("totalAmount").toFixed(2)}</div>
                <Button
                  type="button"
                  className="w-full mt-3"
                  onClick={() => setActiveTab("payment")}
                  disabled={fields.length === 0}
                >
                  Continuar al Pago
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Main content - Service items */}
          <div className="flex flex-col">
            {/* Selected items toolbar */}
            {editMode && selectedItems.length > 0 && (
              <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {selectedItems.length} selected
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8" type="button" onClick={() => setSelectedItems([])}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Limpiar
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={() => removeSelectedItems(remove, selectedItems, setSelectedItems)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}

            <div>
              {searchTerm ? (
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Search className="h-3.5 w-3.5" />
                      <span>Resultados de búsqueda para "{searchTerm}"</span>
                    </div>

                    {filteredItems.length > 0 ? (
                      <div className="space-y-6">
                        {filteredItems.map((category) => (
                          <div key={category.id}>
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="h-8 w-8 rounded-md flex items-center justify-center text-white"
                                style={{ backgroundColor: category.color }}
                              >
                                {category.icon}
                              </div>
                              <h3 className="font-medium">{category.name}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {category.items.map((item) => (
                                <PaymentServiceCard
                                  key={item.id}
                                  service={item}
                                  category={category}
                                  onSelect={() => addService(item, category, watchExtraServices, append, update)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium">No services found</p>
                        <p className="text-muted-foreground mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                // Category view
                <div className="flex flex-col h-full">
                  {categories
                    .filter((c) => c.id === activeCategory)
                    .map((category) => (
                      <div key={category.id} className="flex-1 flex flex-col">
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-10 w-10 rounded-md flex items-center justify-center text-white"
                                style={{ backgroundColor: category.color }}
                              >
                                {category.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{category.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {category.items.length} servicios disponibles
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                              {category.items.map((item) => (
                                <PaymentServiceCard
                                  key={item.id}
                                  service={item}
                                  category={category}
                                  onSelect={() => addService(item, category, watchExtraServices, append, update)}
                                />
                              ))}
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Selected items */}
            {fields.length > 0 && (
              <div className="border-t">
                <div className="p-3 flex items-center justify-between bg-muted/30">
                  <h3 className="font-medium text-sm flex items-center gap-1.5">
                    <ShoppingBag className="h-4 w-4" />
                    Servicios Seleccionados
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? "Listo" : "Editar"}
                    </Button>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => form.setValue("extraServices", [])}
                      >
                        Limpiar Todo
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="max-h-[150px]">
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((service, index) => {
                        const category = getCategoryById(service.category);
                        return (
                          <div
                            key={service.id + index}
                            className={cn(
                              "relative overflow-hidden rounded-md border p-2 bg-card",
                              editMode && "cursor-pointer hover:bg-muted/50",
                              editMode && selectedItems.includes(index) && "ring-2 ring-primary bg-primary/5"
                            )}
                            onClick={() => editMode && toggleItemSelection(index, selectedItems, setSelectedItems)}
                          >
                            <div className="flex items-center">
                              {editMode && (
                                <div className="mr-2">
                                  <div
                                    className={cn(
                                      "h-4 w-4 rounded-sm border flex items-center justify-center",
                                      selectedItems.includes(index) && "bg-primary border-primary"
                                    )}
                                  >
                                    {selectedItems.includes(index) && (
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                </div>
                              )}
                              <div
                                className="h-8 w-8 rounded-md flex items-center justify-center text-white mr-2 flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                              >
                                {category.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate">{service.name}</div>
                                  <div className="font-bold ml-2">S/. {service.subtotal.toFixed(2)}</div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="text-xs text-muted-foreground">
                                    S/. {service.unitPrice.toFixed(2)} c/u
                                  </div>
                                  {!editMode && (
                                    <div className="flex items-center">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-5 w-5 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateServiceQuantity(
                                            index,
                                            service.quantity - 1,
                                            watchExtraServices,
                                            update
                                          );
                                        }}
                                        disabled={service.quantity <= 1}
                                      >
                                        <Minus className="h-2.5 w-2.5" />
                                      </Button>
                                      <span className="w-6 text-center text-xs">{service.quantity}</span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-5 w-5 rounded-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateServiceQuantity(
                                            index,
                                            service.quantity + 1,
                                            watchExtraServices,
                                            update
                                          );
                                        }}
                                      >
                                        <Plus className="h-2.5 w-2.5" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive ml-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          remove(index);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
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
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </div>
  );
}
