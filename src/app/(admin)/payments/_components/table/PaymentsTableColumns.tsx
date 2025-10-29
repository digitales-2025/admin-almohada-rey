"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Banknote, BedDouble, CalendarDays, Ellipsis, Utensils } from "lucide-react";

import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentStatus, SummaryPayment } from "../../_types/payment";
import { PaymentStatusLabels } from "../../_utils/payments.utils";
import { CreatePaymentDetailRoomDialog } from "../create-payment-room/CreatePaymentDetailRoomDialog";
import { CreatePaymentDetailDialog } from "../create/CreatePaymentDetailDialog";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const paymentsColumns = (
  handleManagementPaymentInterface: (id: string) => void
): ColumnDef<SummaryPayment>[] => [
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
    id: "Código",
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => <div className="min-w-40 truncate capitalize">{row.getValue("Código")}</div>,
  },

  {
    id: "cliente",
    accessorKey: "reservation.customer.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => <div className="min-w-40 truncate capitalize">{row.getValue("cliente")}</div>,
  },

  {
    id: "habitacion",
    accessorKey: "reservation.room",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Habitación" />,
    cell: ({ row }) => {
      const room = row.original.reservation.room;

      if (!room) {
        return <div className="text-muted-foreground text-sm">Sin habitación</div>;
      }

      const roomTypeKey = getRoomTypeKey(room.RoomTypes.name);
      const roomTypeConfig = RoomTypeLabels[roomTypeKey];
      const Icon = roomTypeConfig.icon;

      return (
        <div className="flex items-center space-x-2">
          <div
            className={`p-1 rounded-full ${roomTypeConfig.className
              .replace("text-", "bg-")
              .replace("-700", "-100")} dark:${roomTypeConfig.className
              .replace("text-", "bg-")
              .replace("-700", "-900")}`}
          >
            <Icon className={`h-3 w-3 ${roomTypeConfig.className}`} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">#{room.number}</span>
            <span className="text-xs text-muted-foreground capitalize">{room.RoomTypes.name}</span>
          </div>
        </div>
      );
    },
  },

  {
    id: "fecha",
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          <span>{format(parseISO(row.getValue("fecha")), "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
        </div>
      );
    },
  },

  {
    id: "monto",
    accessorKey: "amount",
    size: 20,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Banknote className="h-4 w-4 flex-shrink-0 text-green-500" strokeWidth={1.5} />
        <span>S/ {parseFloat(row.getValue("monto") as string).toFixed(2)}</span>
      </div>
    ),
  },

  {
    id: "Monto Pagado",
    accessorKey: "amountPaid",
    size: 20,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto Pagado" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Banknote className="h-4 w-4 flex-shrink-0 text-orange-400" strokeWidth={1.5} />
        <span>S/ {parseFloat(row.getValue("Monto Pagado") as string).toFixed(2)}</span>
      </div>
    ),
  },

  {
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const paymentStatus = row.getValue("estado") as PaymentStatus;
      const paymentStatusConfig = PaymentStatusLabels[paymentStatus];

      if (!paymentStatusConfig) return <div>No registrado</div>;

      const Icon = paymentStatusConfig.icon;

      return (
        <div className="text-xs min-w-32">
          <Badge variant="outline" className={paymentStatusConfig.className}>
            <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
            {paymentStatusConfig.label}
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
    id: "actions",
    cell: function Cell({ row }) {
      const [createDialog, setCreateDialog] = useState(false);
      const [createPaymentDetailRoom, setCreatePaymentDetailRoom] = useState(false);

      return (
        <div>
          <div>
            {createDialog && (
              <CreatePaymentDetailDialog open={createDialog} onOpenChange={setCreateDialog} payment={row.original} />
            )}
            {createPaymentDetailRoom && (
              <CreatePaymentDetailRoomDialog
                open={createPaymentDetailRoom}
                setOpen={setCreatePaymentDetailRoom}
                payment={row.original}
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
              <DropdownMenuItem onSelect={() => handleManagementPaymentInterface(row.original.id)}>
                Gestionar Pagos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Agregar Pago</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <>
                    <DropdownMenuItem onSelect={() => setCreatePaymentDetailRoom(true)} className="group">
                      Habitación
                      <DropdownMenuShortcut>
                        <BedDouble className="size-4" aria-hidden="true" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setCreateDialog(true)} className="group">
                      Extras
                      <DropdownMenuShortcut>
                        <Utensils className="size-4" aria-hidden="true" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enablePinning: true,
  },
];
