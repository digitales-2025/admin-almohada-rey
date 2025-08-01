"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Ellipsis, Pencil, Trash } from "lucide-react";

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
import {
  ExpenseCategoryEnum,
  ExpenseDocumentTypeEnum,
  ExpensePaymentMethodEnum,
  HotelExpense,
} from "../../_types/expenses";
import {
  ExpenseCategoryLabels,
  ExpenseDocumentTypeLabels,
  ExpensePaymentMethodLabels,
} from "../../_utils/expenses.utils";
import { DeleteExpensesDialog } from "../state-management/DeleteExpensesDialog";
import { UpdateExpensesSheet } from "../update/UpdateExpensesSheet";
import { ViewExpenses } from "../view/ViewExpenses";

// Columnas para la tabla de gastos
export const expensesColumns = (): ColumnDef<HotelExpense>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todos"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "descripción",
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción de Gasto" />,
    cell: ({ row }) => (
      <div className="min-w-40 truncate flex items-center">{row.original.description || "Sin dato"}</div>
    ),
  },
  {
    id: "categoría",
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categoría" />,
    cell: ({ row }) => {
      const value = row.original.category as unknown as ExpenseCategoryEnum;
      const config = ExpenseCategoryLabels[value];
      if (!config) return "Sin dato";
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="size-4 mr-1" />
          {config.label}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "Método de pago",
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método de pago" />,
    cell: ({ row }) => {
      const value = row.original.paymentMethod as unknown as ExpensePaymentMethodEnum;
      const config = ExpensePaymentMethodLabels[value];
      if (!config) return "Sin dato";
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="size-4 mr-1" />
          {config.label}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "monto",
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto" />,
    cell: ({ row }) => (row.original.amount != null ? `S/ ${row.original.amount}` : "Sin dato"),
  },
  {
    id: "fecha",
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => {
      const value = row.original.date;
      if (!value) return "Sin dato";
      try {
        return format(parseISO(value), "yyyy-MM-dd");
      } catch {
        return value;
      }
    },
  },
  {
    id: "Tipo de documento",
    accessorKey: "documentType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de documento" />,
    cell: ({ row }) => {
      const value = row.original.documentType as unknown as ExpenseDocumentTypeEnum | null;
      if (!value) return "Sin dato";
      const config = ExpenseDocumentTypeLabels[value];
      if (!config) return "Sin dato";
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="size-4 mr-1" />
          {config.label}
        </Badge>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "N° Documento",
    accessorKey: "documentNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="N° Documento" />,
    cell: ({ row }) => row.original.documentNumber || "Sin dato",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showEditDialog, setShowEditDialog] = useState(false);
      const [showViewDialog, setShowViewDialog] = useState(false);

      return (
        <div>
          {showViewDialog && (
            <ViewExpenses open={showViewDialog} onOpenChange={setShowViewDialog} expense={row.original} />
          )}
          {showEditDialog && (
            <UpdateExpensesSheet open={showEditDialog} onOpenChange={setShowEditDialog} expense={row.original} />
          )}
          {showDeleteDialog && (
            <DeleteExpensesDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              expenses={[row.original]}
              showTrigger={false}
              onSuccess={() => {
                row.toggleSelected(false);
              }}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Abrir menú" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setShowViewDialog(true)}>Ver detalles</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setShowEditDialog(true)} className="group">
                Editar
                <DropdownMenuShortcut>
                  <Pencil className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} variant="destructive">
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
