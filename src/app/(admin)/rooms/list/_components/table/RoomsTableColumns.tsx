"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, Ellipsis, Lamp, Monitor, RefreshCcwDot, Ruler, Settings, Trash } from "lucide-react";

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
import { FloorType, Room, RoomStatus } from "../../_types/room";
import { FloorTypeLabels, getRoomTypeKey, RoomStatusLabels, RoomTypeLabels } from "../../_utils/rooms.utils";
import { UpdateAmenitiesRoomsDialog } from "../amenities-management/UpdateAmenitiesRoomsDialog";
import { UpdateAvailabilityRoomsDialog } from "../availability-management/UpdateAvailabilityRoomsDialog";
import { DeleteRoomsDialog } from "../state-management/DeleteRoomsDialog";
import { ReactivateRoomsDialog } from "../state-management/ReactivateRoomsDialog";
import { UpdateRoomSheet } from "../update/UpdateRoomsSheet";
import { RoomNumberCell } from "./RoomNumberCell";
import { RoomImageCell } from "./view-image/RoomImageViewer";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const roomsColumns = (
  isSuperAdmin: boolean,
  handleRoomCleaningLog: (id: string) => void,
  refetchPaginatedRooms: () => void
): ColumnDef<Room>[] => [
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
    id: "imagen",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Imagen" />,
    cell: ({ row }) => <RoomImageCell row={row} />,
  },
  {
    id: "número",
    accessorKey: "number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Número" />,
    cell: ({ row }) => <RoomNumberCell value={row.getValue("número")} />,
  },

  {
    id: "tipo",
    accessorKey: "RoomTypes.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => {
      const roomType = row.getValue("tipo") as string;
      const typeKey = getRoomTypeKey(roomType);
      const config = RoomTypeLabels[typeKey];
      const Icon = config.icon;

      return (
        <div className="min-w-24 truncate">
          <div className="flex items-center gap-1.5 font-light text-sm">
            <Icon className={`size-4 ${config.className}`} strokeWidth={1.5} />
            <span className="text-sm font-normal">{roomType ? config.label : "No definido"}</span>
          </div>
        </div>
      );
    },
  },

  {
    id: "disponibilidad",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Disponibilidad" />,
    cell: ({ row }) => {
      const roomStatus = row.getValue("disponibilidad") as RoomStatus;
      const roomStatusConfig = RoomStatusLabels[roomStatus];

      if (!roomStatusConfig) return <div>No definido</div>;

      const Icon = roomStatusConfig.icon;

      return (
        <div className="text-xs min-w-28">
          <Badge variant="outline" className={roomStatusConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {roomStatusConfig.label}
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
    id: "Televisor",
    accessorKey: "tv",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Televisor" />,
    cell: ({ row }) => (
      <div className="flex flex-row w-fit items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="truncate capitalize">{row.getValue("Televisor")}</span>
      </div>
    ),
  },

  {
    id: "piso",
    accessorKey: "floorType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Piso" />,
    cell: ({ row }) => {
      const floorType = row.getValue("piso") as FloorType;
      const floorTypeConfig = FloorTypeLabels[floorType];

      if (!floorTypeConfig) return <div>No definido</div>;

      const Icon = floorTypeConfig.icon;

      return (
        <div className="text-xs min-w-28">
          <Badge variant="outline" className={floorTypeConfig.className}>
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
  },

  {
    id: "área",
    accessorKey: "area",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Área" />,
    cell: ({ row }) => (
      <div className="w-fit flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <Ruler className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="truncate capitalize">{row.getValue("área")}</span>
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
      const [showUpdateAvailabilityDialog, setShowUpdateAvailabilityDialog] = useState(false);
      const [showEditAmenitiesDialog, setShowEditAmenitiesDialog] = useState(false);

      const { isActive, status } = row.original;
      return (
        <div>
          <div>
            {showEditDialog && (
              <UpdateRoomSheet open={showEditDialog} onOpenChange={setShowEditDialog} room={row?.original} />
            )}

            {showDeleteDialog && (
              <DeleteRoomsDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                rooms={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showReactivateDialog && (
              <ReactivateRoomsDialog
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                rooms={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showUpdateAvailabilityDialog && (
              <UpdateAvailabilityRoomsDialog
                open={showUpdateAvailabilityDialog}
                setOpen={setShowUpdateAvailabilityDialog}
                room={row?.original}
                refetchPaginatedRooms={refetchPaginatedRooms}
              />
            )}

            {showEditAmenitiesDialog && (
              <UpdateAmenitiesRoomsDialog
                open={showEditAmenitiesDialog}
                setOpen={setShowEditAmenitiesDialog}
                room={row?.original}
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
              <DropdownMenuItem
                onSelect={() => setShowUpdateAvailabilityDialog(true)}
                disabled={!isActive}
                className="group"
              >
                Disponibilidad
                <DropdownMenuShortcut>
                  <Settings className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleRoomCleaningLog(row.original.id)}
                disabled={!isActive}
                className="group"
              >
                Registro de limpieza
                <DropdownMenuShortcut>
                  <ClipboardCheck className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              {status !== RoomStatus.CLEANING && status !== RoomStatus.OCCUPIED && (
                <DropdownMenuItem
                  onSelect={() => setShowEditAmenitiesDialog(true)}
                  disabled={!isActive}
                  className="group"
                >
                  Gestionar amenidades
                  <DropdownMenuShortcut>
                    <Lamp className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
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
