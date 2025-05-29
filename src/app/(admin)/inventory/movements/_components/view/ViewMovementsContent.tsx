import React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Banknote,
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  Hash,
  Hotel,
  Package,
  Receipt,
  Search,
  WarehouseIcon,
} from "lucide-react";

import { ExpenseDocumentTypeLabels } from "@/app/(admin)/expenses/_utils/expenses.utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ExpenseDocumentType, Movements, MovementsDetail, MovementsType } from "../../_types/movements";
import { movementsTypeConfig } from "../../_utils/movements.utils";
import { WarehouseType } from "../../../warehouse/_types/warehouse";
import { WarehouseTypeLabels } from "../../../warehouse/_utils/warehouses.utils";

interface ViewMovementsContentProps {
  isDesktop: boolean;
  movementsById: Movements | undefined;
  totalAmount: number | undefined;
  totalItems: number | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: MovementsDetail[] | undefined;
}

export default function ViewMovementsContent({
  isDesktop,
  movementsById,
  totalAmount,
  totalItems,
  searchTerm,
  setSearchTerm,
  filteredProducts,
}: ViewMovementsContentProps) {
  return (
    <div className="relative">
      {/* Main content with clean split */}
      <div className="relative min-h-[600px] md:min-h-[500px]">
        {/* Content layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Movement info */}
          <div className={`w-full md:w-2/6 p-8 ${isDesktop ? "bg-primary/15" : ""}`}>
            <div className="mb-6">
              {movementsById?.type && (
                <Badge
                  className={cn(
                    movementsTypeConfig[movementsById.type as MovementsType]?.backgroundColor,
                    movementsTypeConfig[movementsById.type as MovementsType]?.textColor,
                    movementsTypeConfig[movementsById.type as MovementsType]?.hoverBgColor,
                    movementsTypeConfig[movementsById.type as MovementsType]?.borderColor,
                    "mb-2"
                  )}
                >
                  <div className="flex items-center gap-1">
                    {React.createElement(movementsTypeConfig[movementsById.type as MovementsType]?.icon, {
                      className: "h-4 w-4 mr-1 shrink-0",
                    })}
                    {movementsTypeConfig[movementsById.type as MovementsType]?.name}
                  </div>
                </Badge>
              )}
              <h2 className="text-3xl font-bold mb-2">{movementsById?.description}</h2>
              <p className="mb-6">
                {movementsById?.dateMovement
                  ? format(parseISO(movementsById.dateMovement), "d 'de' MMMM 'de' yyyy", { locale: es })
                  : ""}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Código</p>
                    <p className="font-semibold">{movementsById?.codeUnique}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <WarehouseIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Almacén</p>
                    <p className="font-semibold">
                      {movementsById?.warehouse.type &&
                      WarehouseTypeLabels[movementsById.warehouse.type as WarehouseType]
                        ? WarehouseTypeLabels[movementsById.warehouse.type as WarehouseType].label
                        : movementsById?.warehouse.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Documento</p>
                    <p className="font-semibold font-mono">{movementsById?.documentNumber || "No registrado"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    {movementsById?.typePurchaseOrder &&
                    ExpenseDocumentTypeLabels[movementsById.typePurchaseOrder as ExpenseDocumentType] ? (
                      React.createElement(
                        ExpenseDocumentTypeLabels[movementsById.typePurchaseOrder as ExpenseDocumentType].icon,
                        {
                          className: "h-5 w-5",
                        }
                      )
                    ) : (
                      <Receipt className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">Tipo</p>
                    <p className="font-semibold">
                      {movementsById?.typePurchaseOrder &&
                      ExpenseDocumentTypeLabels[movementsById.typePurchaseOrder as ExpenseDocumentType]
                        ? ExpenseDocumentTypeLabels[movementsById.typePurchaseOrder as ExpenseDocumentType].label
                        : movementsById?.typePurchaseOrder || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Hotel className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm">Total del Movimiento</p>
                  <p className="text-2xl font-bold">S/ {(totalAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Products */}

          <div className="px-0 py-6 md:w-4/6 w-full  ">
            <div className="mb-4 px-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                Productos ({movementsById?.movementsDetail.length})
              </h3>
              <p className="text-slate-500 mb-4">Total: {totalItems} unidades</p>

              {/* Buscador de productos */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="h-full max-h-[400px] md:max-h-[400px] px-0">
              <div className="px-6">
                <div className="space-y-4">
                  {(filteredProducts ?? []).length > 0 ? (
                    filteredProducts?.map((detail) => {
                      const percentOfTotal = ((detail.subtotal ?? 0) / (totalAmount ?? 0)) * 100;

                      // Utilizar movementsTypeConfig en lugar del array colors
                      const type = movementsById?.type as MovementsType;
                      const config = movementsTypeConfig[type];

                      const colorConfig = {
                        bg: config.backgroundColor,
                        border: config.borderColor,
                        hover: config.hoverBgColor,
                        text: config.textColor,
                        icon: config.textColor,
                        background: config.backgroundColorImportant,
                        opacity: config.opacity,
                      };

                      return (
                        <Card
                          key={detail.id}
                          className={`overflow-hidden pt-2 pb-4 ${colorConfig.bg} ${colorConfig.border}`}
                        >
                          <div className="px-4 py-1">
                            {/* Encabezado del producto */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg  ${colorConfig.opacity}`}>
                                  <Package className={`h-5 w-5 ${colorConfig.icon}`} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                                    {detail.product?.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">{detail.product?.code}</p>
                                </div>
                              </div>
                              <Badge
                                className={`${colorConfig.hover} ${colorConfig.border} ${colorConfig.text} ${colorConfig.bg}`}
                              >
                                <span>{Math.round(percentOfTotal)}%</span>
                              </Badge>
                            </div>

                            {/* Visualización de métricas */}
                            <div className="grid grid-cols-3 gap-2">
                              {/* Cantidad */}
                              <div className="relative">
                                <div
                                  className={`absolute inset-0 ${colorConfig.background} opacity-5 rounded-lg`}
                                ></div>
                                <div className="relative p-3 flex flex-col items-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <Hash className={`h-4 w-4 ${colorConfig.icon}`} />
                                  </div>
                                  <span className="text-xs text-slate-500 mb-1">Cantidad</span>
                                  <span className={`text-lg font-bold ${colorConfig.text}`}>{detail.quantity}</span>
                                </div>
                              </div>

                              {/* Costo unitario */}
                              <div className="relative">
                                <div
                                  className={`absolute inset-0 ${colorConfig.background} opacity-5 rounded-lg`}
                                ></div>
                                <div className="relative p-3 flex flex-col items-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <Banknote className={`h-4 w-4 ${colorConfig.icon}`} />
                                  </div>
                                  <span className="text-xs text-slate-500 mb-1">Costo Unit.</span>
                                  <span className={`text-lg font-bold ${colorConfig.text}`}>
                                    S/ {detail.unitCost.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Subtotal */}
                              <div className="relative">
                                <div
                                  className={`absolute inset-0 ${colorConfig.background} opacity-5 rounded-lg`}
                                ></div>
                                <div className="relative p-3 flex flex-col items-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <CreditCard className={`h-4 w-4 ${colorConfig.icon}`} />
                                  </div>
                                  <span className="text-xs text-slate-500 mb-1">Subtotal</span>
                                  <span className={`text-lg font-bold ${colorConfig.text}`}>
                                    S/ {(detail.subtotal ?? 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Gráfico de porcentaje */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                  <BarChart3 className={`h-3.5 w-3.5 ${colorConfig.icon}`} />
                                  <span className="text-xs text-slate-800 dark:text-slate-200">
                                    Porcentaje del total
                                  </span>
                                </div>
                                <span className={`text-xs font-medium ${colorConfig.text}`}>
                                  {percentOfTotal.toFixed(1)}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full ${colorConfig.background}`}
                                  style={{ width: `${percentOfTotal}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Intenta con otro término de búsqueda</p>
                    </div>
                  )}
                </div>

                {/* Summary card */}
                <div className="mt-8">
                  <Card className="border-0 bg-primary/15 p-4 ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Package className="h-5 w-5 " />
                        </div>
                        <div>
                          <p className="text-sm">Total Unidades</p>
                          <p className="text-xl font-bold">{totalItems}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <CreditCard className="h-5 w-5 " />
                        </div>
                        <div>
                          <p className="text-sm">Monto Total</p>
                          <p className="text-xl font-bold">S/ {(totalAmount ?? 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
