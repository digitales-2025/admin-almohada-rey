"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { CircleCheck, Ellipsis, RefreshCcwDot, Timer, Trash } from "lucide-react";

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
import { User } from "../../_types/user";
import { DeleteUsersDialog } from "../state-management/DeleteUsersDialog";
import { ReactivateUsersDialog } from "../state-management/ReactivateUsersDialog";
import { UpdateUserSheet } from "../update/UpdateUserSheet";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const usersColumns = (isSuperAdmin: boolean): ColumnDef<User>[] => [
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
    id: "nombre",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => <div className="min-w-40 truncate capitalize">{row.getValue("nombre")}</div>,
  },
  {
    id: "correo",
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Correo" />,
    cell: ({ row }) => <div>{row.getValue("correo")}</div>,
  },
  {
    id: "teléfono",
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
    cell: ({ row }) => <div>{row.getValue("teléfono")}</div>,
  },

  {
    id: "acceso",
    accessorKey: "mustChangePassword",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acceso" className="min-w-28" />,
    cell: ({ row }) => (
      <div className="text-xs">
        {row.getValue("acceso") ? (
          <span className="inline-flex items-center gap-2 text-slate-400">
            <Timer className="size-4 flex-shrink-0" aria-hidden="true" />
            Debe cambiar contraseña
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-emerald-500">
            <CircleCheck className="size-4" aria-hidden="true" />
            Habilitado
          </span>
        )}
      </div>
    ),
  },
  {
    id: "estado",
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div>
        {row.getValue("estado") ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-500">
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-500">
            Inactivo
          </Badge>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      // Convertimos el valor del filtro a booleano
      const filterValue = value[0] === "true" ? true : false;
      return rowValue === filterValue;
    },
    enableColumnFilter: true,
  },
  {
    id: "conexión",
    accessorKey: "lastLogin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Última conexión" />,
    cell: ({ row }) => {
      const lastConnection = row?.getValue("conexión");
      if (!lastConnection) return null;
      return <div>{format(parseISO(row?.getValue("conexión")), "yyyy-MM-dd HH:mm:ss")}</div>;
    },
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
              <UpdateUserSheet open={showEditDialog} onOpenChange={setShowEditDialog} user={row?.original} />
            )}
            {showDeleteDialog && (
              <DeleteUsersDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                users={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showReactivateDialog && (
              <ReactivateUsersDialog
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                users={[row?.original]}
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
                <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)} disabled={isActive}>
                  Reactivar
                  <DropdownMenuShortcut>
                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!isActive}
                className="text-red-700"
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4 text-red-700" aria-hidden="true" />
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
