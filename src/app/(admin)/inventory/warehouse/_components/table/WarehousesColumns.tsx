"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Download, Ellipsis, PackageCheck, Warehouse } from "lucide-react";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWarehouse } from "../../_hooks/use-warehouse";
import { SummaryWarehouse, WarehouseType } from "../../_types/warehouse";
import { WarehouseTypeLabels } from "../../_utils/warehouses.utils";
import { WarehouseStockDialog } from "../stock/WarehouseStockDialog";

/**
 * Generar las columnas de la tabla de almacenes
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de productos
 */
export const warehousesColumns = (): ColumnDef<SummaryWarehouse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },

  {
    id: "código",
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <Badge variant={"outline"} className="font-mono text-xs">
            {row.getValue("código")}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "tipo",
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      const warehouseType = row.getValue("tipo") as WarehouseType;
      const warehouseTypeConfig = WarehouseTypeLabels[warehouseType];

      if (!warehouseTypeConfig) return <div>No definido</div>;

      const Icon = warehouseTypeConfig.icon;

      return (
        <div className="text-xs min-w-32">
          <Badge variant="outline" className={warehouseTypeConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {warehouseTypeConfig.label}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        return value.includes(rowValue);
      }

      return rowValue === value;
    },
    enableColumnFilter: true,
  },

  {
    id: "cantidad de productos",
    accessorKey: "quantityProducts",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cantidad de productos" />,
    cell: ({ row }) => {
      // Asegúrate de que quantity sea un tipo conocido
      const quantity = row.getValue("cantidad de productos") as number | undefined;

      // Formatea el número con seguridad de tipos
      const formattedQuantity =
        typeof quantity === "number" ? new Intl.NumberFormat("es-ES").format(quantity) : String(quantity || "");

      // Determinar si usar singular o plural basado en la cantidad
      const label = typeof quantity === "number" && quantity === 1 ? "producto" : "productos";

      return (
        <div className="flex items-center">
          <span className="font-medium text-right tabular-nums">{formattedQuantity}</span>
          {(quantity === 0 || quantity) && (
            <span
              className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                typeof quantity === "number" && quantity === 0
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              }`}
            >
              {label}
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "costo total",
    accessorKey: "totalCost",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Costo total" />,
    cell: ({ row }) => {
      const cost = row.getValue("costo total");
      return (
        <div className="flex items-center">
          <span className="font-medium text-right tabular-nums text-emerald-700 dark:text-emerald-500">
            {typeof cost === "number"
              ? new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "PEN",
                  minimumFractionDigits: 2,
                }).format(cost)
              : String(cost)}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: function Cell({ row }) {
      const [showStockDialog, setShowStockDialog] = useState(false);
      const { downloadWarehouseExcel, isDownloading } = useWarehouse();

      const { id, code, type } = row.original;

      const handleDownloadExcel = async () => {
        await downloadWarehouseExcel(id, code);
      };

      return (
        <div>
          <div>
            {showStockDialog && (
              <WarehouseStockDialog
                id={row.original.id}
                open={showStockDialog}
                setOpen={setShowStockDialog}
                currentWarehouseType={type}
              />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => setShowStockDialog(true)}>
                Stock
                <DropdownMenuShortcut>
                  <PackageCheck className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDownloadExcel} disabled={isDownloading}>
                Descargar
                <DropdownMenuShortcut>
                  <Download className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enablePinning: true,
  },
];
