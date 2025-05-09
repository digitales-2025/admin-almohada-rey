"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO as parse } from "date-fns";
import { es } from "date-fns/locale";
import { Ellipsis, Hash, PackageMinus, PackagePlus, Pencil } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { MovementsType, SummaryMovements } from "../../_types/movements";
import { ProductType } from "../../../products/_types/products";
import { ProductTypeLabels } from "../../../products/_utils/products.utils";
import { UpdateMovementsSheet } from "../update/UpdateMovementsSheet";

export const movementsColumns = (isSuperAdmin: boolean): ColumnDef<SummaryMovements>[] => {
  const columns: ColumnDef<SummaryMovements>[] = [
    {
      id: "select",
      size: 10,
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
      id: "Código",
      accessorKey: "codeUnique",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => {
        const code = row.getValue("Código") as string;
        return (
          <div className="flex min-w-40 items-center">
            <Badge className={cn("px-2 py-1 text-xs font-medium")} variant="outline">
              <Hash size={14} className="mr-2 text-indigo-500 dark:text-indigo-300" />
              <span className="truncate text-sm font-medium">{code}</span>
            </Badge>
          </div>
        );
      },
    },

    {
      id: "descripción",
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row }) => {
        const description = row.getValue("descripción") as string;
        return (
          <div>
            {description ? (
              <div className="flex font-normal">
                <span className="text-sm">{description}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-300">Sin descripción</span>
            )}
          </div>
        );
      },
    },

    {
      id: "tipo de producto",
      accessorKey: "typeProduct",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de Producto" />,
      cell: ({ row }) => {
        const productType = row.getValue("tipo de producto") as ProductType;
        const productTypeConfig = ProductTypeLabels[productType];

        if (!productTypeConfig) return <div>No definido</div>;

        const Icon = productTypeConfig.icon;

        return (
          <div className="text-xs min-w-32">
            <Badge variant="outline" className={productTypeConfig.className}>
              <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
              {productTypeConfig.label}
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
      id: "Fecha de Movimiento",
      accessorKey: "dateMovement",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de Movimiento" />,
      cell: ({ row }) => {
        const dateValue = row?.getValue("Fecha de Movimiento");
        if (!dateValue) {
          return <div>Fecha no disponible</div>;
        }
        // Analiza la fecha en formato "yyyy-MM-dd"
        const date = parse(dateValue as string);
        return (
          <span className="text-sm italic text-slate-500">{format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
        );
      },
    },

    {
      id: "Tipo",
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
      cell: ({ row }) => {
        const type = row.getValue("Tipo");
        const isInput = type === MovementsType.INPUT;

        return (
          <div className="flex">
            <div
              className={cn(
                "flex h-7 w-20 items-center justify-center rounded-full transition-all duration-300",
                isInput ? "bg-emerald-100 hover:bg-emerald-200" : "bg-red-100 hover:bg-red-200"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
                  isInput ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                )}
              >
                {isInput ? <PackagePlus className="h-4 w-4" /> : <PackageMinus className="h-4 w-4" />}
              </div>
              <span className={cn("ml-2 mr-2 text-xs font-normal", isInput ? "text-emerald-700" : "text-red-700")}>
                {isInput ? "Ingreso" : "Salida"}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      id: "actions",
      size: 5,
      cell: function Cell({ row }) {
        console.log("isSuperAdmin", isSuperAdmin);
        const [showEditDialog, setShowEditDialog] = useState(false);

        /*
             const [showDeleteDialog, setShowDeleteDialog] = useState(false);
        const [showViewMovementDialog, setShowViewMovementDialog] = useState(false); */

        const { type, hasPaymentAssigned } = row.original;

        return (
          <div>
            <div>
              {/*               {showViewMovementDialog && (
                <MovementsDetailsDialog
                  open={showViewMovementDialog}
                  onOpenChange={setShowViewMovementDialog}
                  movements={row?.original}
                  id={id}
                />
              )}
                */}

              {showEditDialog && (
                <UpdateMovementsSheet
                  open={showEditDialog}
                  onOpenChange={setShowEditDialog}
                  movements={row?.original}
                  type={type}
                />
              )}
              {/* 

              <DeleteMovementsDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                movements={row?.original}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              /> */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {/* 
                <DropdownMenuItem onSelect={() => setShowViewMovementDialog(true)}>Ver</DropdownMenuItem>
                */}

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => setShowEditDialog(true)} disabled={hasPaymentAssigned}>
                  Editar
                  <DropdownMenuShortcut>
                    <Pencil className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                {/* 

                {isSuperAdmin && (
                  <DropdownMenuItem className="text-red-700" onSelect={() => setShowDeleteDialog(true)}>
                    Eliminar
                    <DropdownMenuShortcut>
                      <Trash className="size-4" aria-hidden="true" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enablePinning: true,
    },
  ];

  return columns;
};
