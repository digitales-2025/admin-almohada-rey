import { PackageMinus, PackagePlus, Search, Tag } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateMovementDetailDto, MovementsType, ProductAvailable } from "../../_types/movements";

interface AvailableProductsMovementsProps {
  type: MovementsType;
  selectedProducts: CreateMovementDetailDto[];
  handleProductToggle: (productId: string, unitCost: number, stockQuantity?: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: ProductAvailable[];
  update?: boolean;
}

export default function AvailableProductsMovements({
  type,
  selectedProducts,
  handleProductToggle,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  update = false,
}: AvailableProductsMovementsProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="bg-gradient-to-r from-card to-accent p-4 border-b border-border">
        <h3 className={`text-lg font-medium ${update ? "text-center" : ""}`}>Productos Disponibles</h3>
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <CardContent className="p-0">
        <ScrollArea className="h-[450px] w-full">
          <div className="grid grid-cols-1 gap-2 px-4">
            {filteredProducts.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center text-slate-500">
                No se encontraron productos que coincidan con la búsqueda
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedProducts.some((r) => r.productId === product.id);
                return (
                  <div
                    key={product.id}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? type === MovementsType.INPUT
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-red-200 bg-red-50"
                        : "border-slate-200  hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (type === MovementsType.OUTPUT) {
                          // Para salidas, validamos contra el stock disponible
                          handleProductToggle(product.id, product.unitCost, product.quantity);
                        } else {
                          // Para entradas, no necesitamos validar stock
                          handleProductToggle(product.id, product.unitCost);
                        }
                      }}
                      className="flex w-full items-start p-3 text-left cursor-pointer"
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? type === MovementsType.INPUT
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {type === MovementsType.INPUT ? (
                          <PackagePlus className="h-5 w-5" />
                        ) : (
                          <PackageMinus className="h-5 w-5" />
                        )}
                      </div>

                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-medium capitalize ${
                              isSelected
                                ? type === MovementsType.INPUT
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : "text-red-700 dark:text-red-300"
                                : "text-slate-900 dark:text-slate-100"
                            }`}
                          >
                            {product.name}
                          </h4>
                          {isSelected && (
                            <span
                              className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                type === MovementsType.INPUT
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              Seleccionado
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center text-sm text-slate-500">
                          <Tag className="mr-1 h-3 w-3" />
                          <span>Precio: S/ {product.unitCost.toFixed(2)}</span>

                          {type === MovementsType.OUTPUT && (
                            <span className="ml-3 flex items-center">
                              <span className="mr-1 h-2 w-2 rounded-full bg-slate-300"></span>
                              Stock: {product.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
                          isSelected
                            ? type === MovementsType.INPUT
                              ? "bg-emerald-500 w-full"
                              : "bg-red-500 w-full"
                            : "bg-slate-200 w-0 group-hover:w-full"
                        }`}
                      ></div>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
