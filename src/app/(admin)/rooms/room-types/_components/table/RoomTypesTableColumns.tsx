"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BanknoteIcon,
  Bed,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  RefreshCcwDot,
  Ruler,
  Trash,
  User2,
  Users,
} from "lucide-react";

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
import { /* FloorTypeAccepted, */ RoomType } from "../../_types/roomTypes";
/* import { FloorTypeLabels } from "../../_utils/roomTypes.utils"; */
import { DeleteRoomTypesDialog } from "../state-management/DeleteRoomTypesDialog";
import { ReactivateRoomTypesDialog } from "../state-management/ReactivateRoomTypesDialog";
import { UpdateRoomTypeSheet } from "../update/UpdateRoomTypesSheet";

/**
 * Generar las columnas de la tabla de tipos de habitación
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de tipos de habitación
 */
export const roomTypesColumns = (isSuperAdmin: boolean): ColumnDef<RoomType>[] => [
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
    cell: ({ row }) => (
      <div className="min-w-40 truncate font-medium flex items-center gap-2">
        <Bed className="h-4 w-4 text-primary" />
        <span>{row.getValue("nombre")}</span>
      </div>
    ),
  },
  /*   {
    id: "tipo de piso",
    accessorKey: "floorType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de Piso" />,
    cell: ({ row }) => {
      const floorType = row.getValue("tipo de piso") as FloorTypeAccepted;
      const floorTypeConfig = FloorTypeLabels[floorType];

      if (!floorTypeConfig) return <div>No definido</div>;

      const Icon = floorTypeConfig.icon;

      return (
        <div className="text-xs min-w-32">
          <Badge variant="default" className={floorTypeConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {floorTypeConfig.label}
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
  }, */
  {
    id: "area",
    accessorKey: "area",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Área (m²)" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Ruler className="h-3.5 w-3.5" />
        <span className="font-medium">{row.getValue("area")} m²</span>
      </div>
    ),
  },
  {
    id: "huespedes",
    accessorKey: "guests",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Huéspedes" />,
    cell: ({ row }) => {
      const guests = row.getValue("huespedes") as number;
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1.5">
            {guests > 1 ? <Users className="h-3.5 w-3.5" /> : <User2 className="h-3.5 w-3.5" />}
            <span className="font-medium">
              {guests} {guests === 1 ? "persona" : "personas"}
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    id: "precio",
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Precio" />,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("precio"));
      // Formatear el precio como moneda
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(price);

      return (
        <div className="flex items-center gap-2">
          <BanknoteIcon className="h-4 w-4" strokeWidth={1.5} />
          <span className="font-sans text-sm">{formatted}</span>
        </div>
      );
    },
  },
  {
    id: "estado",
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <div>
        {row.getValue("estado") ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-600 border-emerald-200 px-3 py-1">
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-600 border-red-200 px-3 py-1">
            Inactivo
          </Badge>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      if (Array.isArray(value)) {
        if (value.length === 0) return true;
        return value.some((v) => {
          if (typeof v === "string") return v === String(rowValue);
          return v === rowValue;
        });
      }

      return rowValue === value;
    },
    enableColumnFilter: true,
  },
  {
    id: "expand",
    header: () => null,
    cell: ({ row }) => (
      <Button
        onClick={() => row.toggleExpanded()}
        aria-label="Expand row"
        className="flex items-center justify-center p-2"
        variant={"ghost"}
      >
        {row.getIsExpanded() ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
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
              <UpdateRoomTypeSheet open={showEditDialog} onOpenChange={setShowEditDialog} roomType={row?.original} />
            )}

            {showDeleteDialog && (
              <DeleteRoomTypesDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                roomTypes={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showReactivateDialog && (
              <ReactivateRoomTypesDialog
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                roomTypes={[row?.original]}
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
