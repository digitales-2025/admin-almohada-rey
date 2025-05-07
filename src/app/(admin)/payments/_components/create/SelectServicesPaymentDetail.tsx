"use client";

import { useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { CreateExtraServiceItem, CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import type { CategoryPayment } from "../../_types/payment";
import { addService } from "../../_utils/createPaymentDetails.utils";
import ItemsPaymentDetail from "./ItemsPaymentDetail";
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
    <div className="rounded-lg">
      <TabsContent value="services" className="flex flex-col h-[calc(90vh-190px)]">
        <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] h-full rounded-lg overflow-hidden">
          {/* Left sidebar - Categories and search */}
          <div className="border-r p-4 flex flex-col bg-card">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                className="pl-9 pr-9 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  size={"icon"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              )}
            </div>

            <h3 className="font-medium text-sm mb-2 text-foreground flex items-center justify-center">Categorias</h3>
            <div className="space-y-1 mb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all",
                    activeCategory === category.id
                      ? "bg-primary/10 border-l-4 border-l-primary text-primary font-medium"
                      : "border-l-4 border-l-transparent text-foreground hover:bg-muted hover:border-l-primary/30"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-md transition-all",
                      activeCategory === category.id ? "" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {category.icon}
                  </div>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Selected items summary */}
            {fields.length > 0 && (
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm flex items-center">
                    <span className="inline-block w-1 h-4 bg-primary rounded-full mr-2"></span>
                    Items seleccionados
                  </h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {fields.length}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Monto Total</div>
                <div className="text-sm font-bold text-foreground bg-muted p-2 rounded-md border border-border">
                  S/. {form.getValues("totalAmount").toFixed(2)}
                </div>
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
          <div className="flex flex-col bg-background">
            <div>
              {searchTerm ? (
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-card p-2 rounded-md">
                      <Search className="h-3.5 w-3.5" />
                      <span>Resultados de búsqueda para "{searchTerm}"</span>
                    </div>

                    {filteredItems.length > 0 ? (
                      <div className="space-y-6">
                        {filteredItems.map((category) => (
                          <div key={category.id}>
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="h-8 w-8 rounded-md flex items-center justify-center text-primary-foreground"
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
                      <div className="flex flex-col items-center justify-center h-[300px] bg-card rounded-lg p-8">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No services found</p>
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
                        <div className="p-4 border-b bg-card">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-10 w-10 rounded-md flex items-center justify-center text-primary-foreground"
                                style={{ backgroundColor: category.color }}
                              >
                                {category.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-foreground">{category.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {category.items.length} servicios disponibles
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <ItemsPaymentDetail
                categories={categories}
                editMode={editMode}
                setEditMode={setEditMode}
                fields={fields}
                form={form}
                remove={remove}
                update={update}
                watchExtraServices={watchExtraServices}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                getCategoryById={getCategoryById}
              />
            )}
          </div>
        </div>
      </TabsContent>
    </div>
  );
}
