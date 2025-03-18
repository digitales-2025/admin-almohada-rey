"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

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
import { User, UserRolType } from "../../_types/user";
import { UserRolTypeLabels } from "../../_utils/users.utils";
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
    cell: ({ row }) => {
      const phone = row.getValue("teléfono") as string;
      if (!phone) return <div>-</div>;

      try {
        // Obtener el país del número de teléfono
        const country = RPNInput.parsePhoneNumber(phone)?.country;

        // Formatear el número para mejor legibilidad
        const formattedPhone = RPNInput.formatPhoneNumberIntl(phone);

        return (
          <div className="flex items-center gap-2">
            {country && (
              <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                {flags[country] && React.createElement(flags[country], { title: country })}
              </span>
            )}
            <span>{formattedPhone || phone}</span>
          </div>
        );
      } catch {
        // Si hay algún error al parsear el número, mostramos el número original
        return <div>{phone}</div>;
      }
    },
  },

  {
    id: "rol",
    accessorKey: "userRol",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
    cell: ({ row }) => {
      const role = row.getValue("rol") as UserRolType;
      const roleConfig = UserRolTypeLabels[role];

      if (!roleConfig) return <div>Rol no definido</div>;

      const Icon = roleConfig.icon;

      return (
        <div className="text-xs min-w-32">
          <Badge variant="default" className={roleConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {roleConfig.label}
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
    id: "estado",
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div>
        {row.getValue("estado") ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-500 border-emerald-200">
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-500 border-red-200">
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
