"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { CalendarCog, CalendarX2, CreditCard, Ellipsis, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

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
import { formatPeruBookingDate, getCurrentPeruDateTime } from "@/utils/peru-datetime";
import {
  DetailedReservation,
  ReservationGuest,
  ReservationStatusAvailableActions,
} from "../../_schemas/reservation.schemas";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
import { getAvailableActions } from "../../_utils/reservation-status-validation.utils";
import { CreatePaymentDialog } from "../create-payment/CreatePaymentsDialog";
import { ExtensionReservationDialog } from "../extension/ExtensionReservationDialog";
import { DeactivateReservationsDialog } from "../state-management/DeactivateReservationsDialog";
import { DeleteLateCheckoutDialog } from "../state-management/DeleteLateCheckoutDialog";
import { DIALOG_DICTIONARY } from "../state-management/reservation-status-dialog-config";
import { TransitionReservationStatusDialog } from "../state-management/TransitionReservationStatusDialog";
import { UpdateReservationSheet } from "../update/UpdateReservationSheet";
import { ReservationDetailsDialog } from "./details/ReservationDetailsDialog";
import { GuestsDetailsDialog } from "./dialogs/GuestDialog";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const reservationColumns = (
  isSuperAdmin: boolean,
  handleManagementPaymentInterface: (id: string) => void
): ColumnDef<DetailedReservation>[] => [
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
    accessorKey: "customerId",
    meta: {
      title: "Cliente",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <div className="min-w-40 truncate capitalize">
        {row.original.customer ? (
          <>
            <span className="block font-semibold">{row.original.customer.name}</span>
            <span className="text-xs">{row.original.customer.phone || "Sin teléfono"}</span>
          </>
        ) : (
          <span className="text-muted-foreground italic">Cliente no registrado</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "roomId",
    meta: {
      title: "Habitación",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Habitación" />,
    cell: ({ row }) => <div>{row.original.room.number}</div>,
  },
  {
    accessorKey: "checkInDate",
    meta: {
      title: "Fecha CheckIn",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CheckIn" />,
    cell: ({ row }) => {
      const { localeDateString } = formatPeruBookingDate(row.original.checkInDate);
      return <div>{localeDateString}</div>;
    },
  },
  {
    accessorKey: "checkOutDate",
    meta: {
      title: "Fecha CheckOut",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CheckOut" />,
    cell: ({ row }) => {
      const { localeDateString } = formatPeruBookingDate(row.original.checkOutDate);
      return <div>{localeDateString}</div>;
    },
  },
  {
    accessorKey: "reservationDate",
    meta: {
      title: "Fecha de reservación",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reservado en" />,
    cell: ({ row }) => {
      const { localeDateString } = formatPeruBookingDate(row.original.reservationDate);
      return <div>{localeDateString}</div>;
    },
  },
  {
    id: "E. Reserva",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="E. Reserva" />,
    cell: ({ row }) => {
      const config = reservationStatusConfig[row.getValue("E. Reserva") as keyof typeof reservationStatusConfig];
      const Icon = config.icon;
      return (
        <Badge
          className={cn(
            config.backgroundColor,
            config.textColor,
            config.hoverBgColor,
            "flex space-x-1 items-center justify-center text-sm border-none"
          )}
        >
          <Icon className="size-4" />
          <span>{config.name}</span>
        </Badge>
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
    accessorKey: "guests",
    meta: {
      title: "Acompañantes",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acompañantes" />,
    cell: ({ row }) => {
      try {
        if (!row.original?.guests) {
          return "No disponible";
        }
        const parsedGuests = JSON.parse(row.original.guests) as ReservationGuest[];
        if (parsedGuests.length > 0) {
          return (
            <div className="items-center flex justify-center">
              {row.original.guests?.length > 0 ? (
                <GuestsDetailsDialog
                  customer={row.original.customer}
                  guests={parsedGuests}
                  user={row.original.user}
                ></GuestsDetailsDialog>
              ) : (
                <div className="text-muted-foreground text-sm italic">No disponible</div>
              )}
            </div>
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error al traer huéspedes asociados: " + error.message);
        }
        toast.error("Error al traer huéspedes asociados");
        return null;
      }
    },
  },
  {
    accessorKey: "isActive",
    meta: {
      title: "¿Archivado?",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="¿Archivado?" />,
    cell: ({ row }) => (
      <div>
        {row.original.isActive ? (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-500 border-emerald-200 hover:bg-emerald-200"
          >
            Activo
          </Badge>
        ) : row.original.isPendingDeletePayment ? (
          <Badge variant="secondary" className="bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200">
            Pago por anular
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-500 border-red-200 hover:bg-red-200">
            Archivado
          </Badge>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      const hasPaymentToDelete = row.original.isPendingDeletePayment;

      // Si value es un array, comprobamos si contiene el valor de la fila
      if (Array.isArray(value)) {
        // Si el array está vacío, no filtramos
        if (value.length === 0) return true;

        // Convertimos cada elemento del array según sea necesario
        return value.some((v) => {
          // Caso especial para "payment_to_delete"
          if (v === "payment_to_delete") return !rowValue && hasPaymentToDelete;
          // Si es string "true"/"false", convertimos a booleano
          if (typeof v === "string") return v === String(rowValue);
          // Si ya es booleano, comparamos directamente
          return v === rowValue;
        });
      }

      // Para el caso de valor único "payment_to_delete"
      if (value === "payment_to_delete") return !rowValue && hasPaymentToDelete;

      // Si es un valor único, hacemos la comparación directa
      return rowValue === value;
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const [showEditDialog, setShowEditDialog] = useState(false);
      const [showCreatePaymentDialog, setShowCreatePaymentDialog] = useState(false);
      const [showCancelDialog, setShowCancelDialog] = useState(false);
      const [showCheckInDialog, setShowCheckInDialog] = useState(false);
      const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
      const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
      const [showDetailDialog, setShowDetailDialog] = useState(false);
      const [showExtensionDialog, setShowExtensionDialog] = useState(false);
      const [showDeleteLateCheckoutDialog, setShowDeleteLateCheckoutDialog] = useState(false);
      const { status, isPendingDeletePayment, isActive, appliedLateCheckOut } = row.original;

      const confirmConfig = DIALOG_DICTIONARY["CONFIRMED"];
      const cancelConfig = DIALOG_DICTIONARY["CANCELED"];
      const checkInConfig = DIALOG_DICTIONARY["CHECKED_IN"];
      const checkOutConfig = DIALOG_DICTIONARY["CHECKED_OUT"];

      const { canCancel, canCheckIn, canCheckOut, canConfirm, canDeactivate }: ReservationStatusAvailableActions =
        getAvailableActions(status);

      // Usar las utilidades existentes para obtener la fecha actual en Perú
      const todayPeruDate = getCurrentPeruDateTime("date") as string; // "2025-03-31"
      const checkInDate = row.original.checkInDate.split("T")[0]; // Extraer solo la fecha "2025-03-31"

      // Comparación simple de strings de fecha (yyyy-MM-dd)
      const hasCheckInDateArrived = checkInDate <= todayPeruDate;

      const enableCheckInButton = hasCheckInDateArrived && canCheckIn;

      return (
        <div>
          <div>
            {showEditDialog && (
              <UpdateReservationSheet
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                reservation={row?.original}
              />
            )}
            {showCreatePaymentDialog && (
              <CreatePaymentDialog
                open={showCreatePaymentDialog}
                setOpen={setShowCreatePaymentDialog}
                reservation={row.original}
              />
            )}
            {showCancelDialog && (
              <TransitionReservationStatusDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
                reservation={row.original}
                newStatus="CANCELED"
              ></TransitionReservationStatusDialog>
            )}
            {showCheckInDialog && (
              <TransitionReservationStatusDialog
                open={showCheckInDialog}
                onOpenChange={setShowCheckInDialog}
                reservation={row.original}
                newStatus="CHECKED_IN"
              ></TransitionReservationStatusDialog>
            )}
            {showCheckOutDialog && (
              <TransitionReservationStatusDialog
                open={showCheckOutDialog}
                onOpenChange={setShowCheckOutDialog}
                reservation={row.original}
                newStatus="CHECKED_OUT"
              ></TransitionReservationStatusDialog>
            )}

            {showDeactivateDialog && (
              <DeactivateReservationsDialog
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}
                reservations={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}

            {showDetailDialog && (
              <ReservationDetailsDialog open={showDetailDialog} setOpen={setShowDetailDialog} row={row?.original} />
            )}
            {showExtensionDialog && (
              <ExtensionReservationDialog
                open={showExtensionDialog}
                onOpenChange={setShowExtensionDialog}
                reservation={row?.original}
              />
            )}

            {showDeleteLateCheckoutDialog && (
              <DeleteLateCheckoutDialog
                open={showDeleteLateCheckoutDialog}
                onOpenChange={setShowDeleteLateCheckoutDialog}
                id={row?.original.id}
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
              <DropdownMenuItem onSelect={() => setShowDetailDialog(true)}>Ver</DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => setShowEditDialog(true)} disabled={!isActive} className="group">
                Editar
                <DropdownMenuShortcut>
                  <Pencil className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>

              {status === "CHECKED_IN" && (
                <DropdownMenuItem onSelect={() => setShowExtensionDialog(true)} className="group">
                  Extender reserva
                  <DropdownMenuShortcut>
                    <CalendarCog className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {appliedLateCheckOut && (
                <DropdownMenuItem variant="destructive" onSelect={() => setShowDeleteLateCheckoutDialog(true)}>
                  Eliminar Late Checkout
                  <DropdownMenuShortcut>
                    <CalendarX2 className="size-4 text-destructive" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {/* Mostrar Pagos - Solo para estados diferentes de PENDING y CONFIRMED */}
              {status !== "PENDING" && status !== "CONFIRMED" && (
                <DropdownMenuItem onSelect={() => handleManagementPaymentInterface(row.original.id)} className="group">
                  Mostrar Pagos
                  <DropdownMenuShortcut>
                    <CreditCard className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {canConfirm && (
                <DropdownMenuItem
                  onSelect={() => setShowCreatePaymentDialog(true)}
                  disabled={status !== "PENDING"}
                  className="group"
                >
                  {confirmConfig.buttonLabel}
                  <DropdownMenuShortcut>
                    <confirmConfig.icon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {canCheckIn && (
                <DropdownMenuItem
                  disabled={!enableCheckInButton}
                  onSelect={() => setShowCheckInDialog(true)}
                  className="group"
                >
                  {checkInConfig.buttonLabel}
                  <DropdownMenuShortcut>
                    <checkInConfig.icon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {canCheckOut && (
                <DropdownMenuItem onSelect={() => setShowCheckOutDialog(true)} className="group">
                  {checkOutConfig.buttonLabel}
                  <DropdownMenuShortcut>
                    <checkOutConfig.icon className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {canCancel && (
                <DropdownMenuItem onSelect={() => setShowCancelDialog(true)} disabled={!isActive} variant="destructive">
                  {cancelConfig.buttonLabel}
                  <DropdownMenuShortcut>
                    <cancelConfig.icon className="size-4 text-destructive" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}

              {isSuperAdmin && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={() => setShowDeactivateDialog(true)}
                    /* Habilitado si: está activo y se puede desactivar, O si hay un pago pendiente de eliminar */
                    disabled={!(isActive && canDeactivate) && !isPendingDeletePayment}
                    variant="destructive"
                  >
                    Archivar
                    <DropdownMenuShortcut>
                      <Trash className="size-4 text-destructive" aria-hidden="true" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enablePinning: true,
  },
];
