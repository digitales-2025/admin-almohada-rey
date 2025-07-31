"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Box, Ellipsis, RefreshCcwDot, ShoppingBag, Trash } from "lucide-react";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product, ProductType } from "../../_types/products";
import { ProductTypeLabels } from "../../_utils/products.utils";
import { DeleteProductsDialog } from "../state-management/DeleteProductsDialog";
import { ReactivateProductsDialog } from "../state-management/ReactivateProductsDialog";
import { UpdateProductSheet } from "../update/UpdateProductsSheet";

/**
 * Generar las columnas de la tabla de productos
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de productos
 */
export const productsColumns = (isSuperAdmin: boolean): ColumnDef<Product>[] => [
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
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <Badge variant={"outline"} className="font-mono text-xs">
            {row.getValue("código")}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "nombre",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => {
      const CategoryIcon = Box;

      return (
        <div className="flex items-center gap-2 capitalize">
          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
          {row.getValue("nombre")}
        </div>
      );
    },
  },

  {
    id: "precio",
    accessorKey: "unitCost",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Precio" />,
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("precio"));

      return (
        <div className="flex items-center">
          <div
            className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 
                            border-l-4 border-emerald-500 shadow-sm rounded-md overflow-hidden group"
          >
            <div className="flex items-center px-3 py-1.5 relative">
              {/* Línea animada */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 group-hover:w-full transition-all duration-300 ease-in-out"></div>

              {/* Símbolo de moneda */}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold mr-1.5">S/</span>

              {/* Valor del precio */}
              <span className="font-medium text-gray-800 dark:text-gray-200 tabular-nums tracking-tight">
                {price.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: "tipo",
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      const documentType = row.getValue("tipo") as ProductType;
      const documentTypeConfig = ProductTypeLabels[documentType];

      if (!documentTypeConfig) return <div>No definido</div>;

      const Icon = documentTypeConfig.icon;

      return (
        <div className="text-xs min-w-32">
          <Badge variant="outline" className={documentTypeConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {documentTypeConfig.label}
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
    id: "estado",
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div>
        {row.getValue("estado") ? (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-500 border-emerald-200 hover:bg-emerald-200"
          >
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-500 border-red-200 hover:bg-red-200">
            Inactivo
          </Badge>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      // Si value es un array, comprobamos si contiene el valor de la fila
      if (Array.isArray(value)) {
        // Si el array está vacío, no filtramos
        if (value.length === 0) return true;

        // Convertimos cada elemento del array según sea necesario
        return value.some((v) => {
          // Si es string "true"/"false", convertimos a booleano
          if (typeof v === "string") return v === String(rowValue);
          // Si ya es booleano, comparamos directamente
          return v === rowValue;
        });
      }

      // Si es un valor único, hacemos la comparación directa
      return rowValue === value;
    },
    enableColumnFilter: true,
  },

  {
    id: "actions",
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      const [showEditDialog, setShowEditDialog] = useState(false);

      const { isActive } = row.original;
      return (
        <div>
          <div>
            {showEditDialog && (
              <UpdateProductSheet open={showEditDialog} onOpenChange={setShowEditDialog} product={row?.original} />
            )}

            {showDeleteDialog && (
              <DeleteProductsDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                products={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showReactivateDialog && (
              <ReactivateProductsDialog
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                products={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setShowEditDialog(true)} disabled={!isActive}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)} disabled={isActive} className="group">
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} disabled={!isActive} variant="destructive">
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4 text-destructive" aria-hidden="true" />
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
