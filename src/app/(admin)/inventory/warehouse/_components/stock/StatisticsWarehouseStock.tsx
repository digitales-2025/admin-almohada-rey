import { AlertTriangle, Package, ShoppingBag } from "lucide-react";

interface StatisticsWarehouseStockProps {
  animateItems: boolean;
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
}

export default function StatisticsWarehouseStock({
  animateItems,
  totalItems,
  totalValue,
  lowStockItems,
}: StatisticsWarehouseStockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="bg-card rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total de Artículos</h3>
            <Package className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{animateItems ? totalItems : 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Unidades en inventario</p>
          </div>
        </div>
        <div className="h-1 w-full bg-teal-500"></div>
      </div>

      <div className="bg-card rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Valor del Inventario</h3>
            <ShoppingBag className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              S/ {animateItems ? totalValue.toFixed(2) : "0.00"}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Valor total en stock</p>
          </div>
        </div>
        <div className="h-1 w-full bg-emerald-500"></div>
      </div>

      <div className="bg-card rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Productos en Alerta</h3>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {animateItems ? lowStockItems : 0}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Requieren reposición</p>
          </div>
        </div>
        <div className="h-1 w-full bg-amber-500"></div>
      </div>
    </div>
  );
}
