import { AlertTriangle, CheckCircle, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockWarehouse, WarehouseType } from "../../_types/warehouse";
import { getMinStockThreshold, WarehouseTypeLabels } from "../../_utils/warehouses.utils";

interface WarehouseStockContentProps {
  setActiveTab: (value: string) => void;
  sortedItems: StockWarehouse[];
  currentWarehouseType: WarehouseType | undefined;
  animateItems: boolean;
}

export default function WarehouseStockTabsContent({
  setActiveTab,
  sortedItems,
  currentWarehouseType,
  animateItems,
}: WarehouseStockContentProps) {
  return (
    <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl">
        <TabsTrigger value="all" className="rounded-lg data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
          <Package className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate text-ellipsis">Todos los Productos</span>
        </TabsTrigger>
        <TabsTrigger
          value="low"
          className="rounded-lg  data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
        >
          <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate text-ellipsis">Stock Bajo</span>
        </TabsTrigger>
        <TabsTrigger
          value="high"
          className="rounded-lg  data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
        >
          <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate text-ellipsis">Bien Abastecido</span>
        </TabsTrigger>
      </TabsList>

      {/* Visualización de Cards */}
      <TabsContent value="all" className="mt-6">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-300 border rounded-xl bg-gray-50 dark:bg-gray-900">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm text-gray-400 mt-1">Intente con otra búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedItems.map((item, index) => {
              const isLowStock = item.quantity < getMinStockThreshold(currentWarehouseType);

              // Nuevo cálculo de porcentaje para la barra de progreso
              const minStock = getMinStockThreshold(currentWarehouseType);
              const targetStock = minStock * 3; // Definimos el stock "óptimo" como 3 veces el mínimo

              // Calculamos el porcentaje relativo al rango entre mínimo y óptimo
              const stockPercentage = Math.min(
                // Si está por debajo del mínimo, el porcentaje estará entre 0-50%
                // Si está por encima del mínimo, el porcentaje estará entre 50-100%
                item.quantity < minStock
                  ? (item.quantity / minStock) * 50
                  : 50 + ((item.quantity - minStock) / (targetStock - minStock)) * 50,
                100
              );

              const delay = index * 0.05;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  style={{
                    opacity: animateItems ? 1 : 0,
                    transform: animateItems ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${delay}s`,
                  }}
                >
                  <div className={`h-1.5 w-full ${isLowStock ? "bg-amber-500" : "bg-emerald-500"}`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${isLowStock ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}`}
                        >
                          {/* Usamos la propiedad icon para obtener el componente de icono y luego renderizamos ese componente */}
                          {(() => {
                            const IconComponent =
                              WarehouseTypeLabels[currentWarehouseType ?? WarehouseType.COMMERCIAL].icon;
                            return <IconComponent />;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{item.product.code}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          isLowStock
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 h-fit"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 h-fit"
                        }
                      >
                        {isLowStock ? "Stock Bajo" : "Óptimo"}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-300">Nivel de Stock</span>
                        <span className={`font-medium ${isLowStock ? "text-amber-600" : "text-emerald-600"}`}>
                          {item.quantity} unidades
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${isLowStock ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: animateItems ? `${stockPercentage}%` : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Costo Unitario</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.unitCost.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Valor Total</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="low" className="mt-6">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 text-amber-600 border rounded-xl bg-amber-50 dark:bg-gray-900">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-amber-300 dark:text-amber-600" />
            <p className="font-medium">No hay productos con stock bajo</p>
            <p className="text-sm text-amber-500 dark:text-white mt-1">¡Todo está bien abastecido!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            {sortedItems.map((item, index) => {
              // Nueva lógica mejorada para la barra de progreso
              const minStock = getMinStockThreshold(currentWarehouseType);
              const targetStock = minStock * 3;

              const stockPercentage = Math.min(
                item.quantity < minStock
                  ? (item.quantity / minStock) * 50
                  : 50 + ((item.quantity - minStock) / (targetStock - minStock)) * 50,
                100
              );

              const delay = index * 0.05;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-amber-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  style={{
                    opacity: animateItems ? 1 : 0,
                    transform: animateItems ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${delay}s`,
                  }}
                >
                  <div className="h-1.5 w-full bg-amber-500"></div>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                          {/* Usamos la propiedad icon para obtener el componente de icono y luego renderizamos ese componente */}
                          {(() => {
                            const IconComponent =
                              WarehouseTypeLabels[currentWarehouseType ?? WarehouseType.COMMERCIAL].icon;
                            return <IconComponent />;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{item.product.code}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 h-fit"
                      >
                        Reposición Urgente
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-300">Nivel de Stock</span>
                        <span className="font-medium text-amber-600">{item.quantity} unidades</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                          style={{ width: animateItems ? `${stockPercentage}%` : "0%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-amber-600 mt-1 text-right">
                        Nivel mínimo recomendado: {getMinStockThreshold(currentWarehouseType)} unidades
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-gray-900">
                        <p className="text-xs text-amber-700 dark:text-amber-600">Costo Unitario</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.unitCost.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-gray-900">
                        <p className="text-xs text-amber-700 dark:text-amber-600">Valor Total</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="high" className="mt-6">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12 text-emerald-600 border rounded-xl bg-emerald-50 dark:bg-gray-900">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-emerald-300 dark:text-emerald-600" />
            <p className="font-medium">No hay productos bien abastecidos</p>
            <p className="text-sm text-emerald-500 dark:text-white mt-1">Considere reponer su inventario</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedItems.map((item, index) => {
              // Nueva lógica mejorada para la barra de progreso
              const minStock = getMinStockThreshold(currentWarehouseType);
              const targetStock = minStock * 3;

              const stockPercentage = Math.min(
                item.quantity < minStock
                  ? (item.quantity / minStock) * 50
                  : 50 + ((item.quantity - minStock) / (targetStock - minStock)) * 50,
                100
              );

              const delay = index * 0.05;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-emerald-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                  style={{
                    opacity: animateItems ? 1 : 0,
                    transform: animateItems ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${delay}s`,
                  }}
                >
                  <div className="h-1.5 w-full bg-emerald-500"></div>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                          {/* Usamos la propiedad icon para obtener el componente de icono y luego renderizamos ese componente */}
                          {(() => {
                            const IconComponent =
                              WarehouseTypeLabels[currentWarehouseType ?? WarehouseType.COMMERCIAL].icon;
                            return <IconComponent />;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{item.product.code}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 h-fit"
                      >
                        Bien Abastecido
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-300">Nivel de Stock</span>
                        <span className="font-medium text-emerald-600">{item.quantity} unidades</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                          style={{ width: animateItems ? `${stockPercentage}%` : "0%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1 text-right">Nivel óptimo</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-gray-900">
                        <p className="text-xs text-emerald-700">Costo Unitario</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.unitCost.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-gray-900">
                        <p className="text-xs text-emerald-700">Valor Total</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">S/ {item.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
