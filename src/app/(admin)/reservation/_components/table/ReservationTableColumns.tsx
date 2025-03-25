"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronRight, Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DetailedReservation, ReservationGuest } from "../../_schemas/reservation.schemas";
import { reservationStatusConfig } from "../../_types/reservation-enum.config";
import { GuestsDetailsDialog } from "./dialogs/GuestDialog";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const reservationColumns = () // isSuperAdmin: boolean
: ColumnDef<DetailedReservation>[] => [
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
        <span>{row.original.customerId}</span>
        <span>{/* Aqui pondremos el telefono y el correo */}</span>
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
  //   {
  //     accessorKey: "reservationDate",
  //     meta: {
  //       title: "Fecha de reservación",
  //     },
  //     header: ({ column }) => <DataTableColumnHeader column={column} title="Reservado en" />,
  //     cell: ({ row }) => {
  //       const phone = row.getValue("teléfono") as string;
  //       if (!phone) return <div>-</div>;

  //       try {
  //         // Obtener el país del número de teléfono
  //         const country = RPNInput.parsePhoneNumber(phone)?.country;

  //         // Formatear el número para mejor legibilidad
  //         const formattedPhone = RPNInput.formatPhoneNumberIntl(phone);

  //         return (
  //           <div className="flex items-center gap-2">
  //             {country && (
  //               <span className="flex h-4 w-6 overflow-hidden rounded-sm">
  //                 {flags[country] && React.createElement(flags[country], { title: country })}
  //               </span>
  //             )}
  //             <span>{formattedPhone || phone}</span>
  //           </div>
  //         );
  //       } catch {
  //         // Si hay algún error al parsear el número, mostramos el número original
  //         return <div>{phone}</div>;
  //       }
  //     },
  //   },
  {
    accessorKey: "checkInDate",
    meta: {
      title: "Fecha CheckIn",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CheckIn" />,
    cell: ({ row }) => {
      return (
        <div>
          {format(row.original.checkInDate, "PP", {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "checkOutDate",
    meta: {
      title: "Fecha CheckOut",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="CheckOut" />,
    cell: ({ row }) => {
      return (
        <div>
          {format(row.original.checkInDate, "PP", {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "reservationDate",
    meta: {
      title: "Fecha de reservación",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reservado en" />,
    cell: ({ row }) => {
      return (
        <div>
          {format(row.original.reservationDate, "PP", {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: {
      title: "Estado de reserva",
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const config = reservationStatusConfig[row.original.status];
      const Icon = config.icon;
      return (
        <Badge
          className={cn(
            config.backgroundColor,
            config.textColor,
            config.hoverBgColor,
            "flex space-x-1 items-center justify-center text-sm"
          )}
        >
          <Icon className="size-4" />
          <span>{config.name}</span>
        </Badge>
      );
    },
  },
  //   {
  //     id: "tipo",
  //     accessorKey: "documentType",
  //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
  //     cell: ({ row }) => {
  //       const documentType = row.getValue("tipo") as CustomerDocumentType;
  //       const documentTypeConfig = CustomerDocumentTypeLabels[documentType];

  //       if (!documentTypeConfig) return <div>Rol no definido</div>;

  //       const Icon = documentTypeConfig.icon;

  //       return (
  //         <div className="text-xs min-w-32">
  //           <Badge variant="default" className={documentTypeConfig.className}>
  //             <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
  //             {documentTypeConfig.label}
  //           </Badge>
  //         </div>
  //       );
  //     },
  //     filterFn: (row, id, value) => {
  //       const rowValue = row.getValue(id);

  //       if (Array.isArray(value)) {
  //         if (value.length === 0) return true;
  //         return value.includes(rowValue);
  //       }

  //       return rowValue === value;
  //     },
  //     enableColumnFilter: true,
  //   },

  //   {
  //     id: "N° Doc.",
  //     accessorKey: "documentNumber",
  //     header: ({ column }) => <DataTableColumnHeader column={column} title="N° Doc." />,
  //     cell: ({ row }) => {
  //       const documentNumber = row.getValue("N° Doc.") as string;

  //       if (!documentNumber) return <div className="text-muted-foreground text-sm italic">No disponible</div>;

  //       return (
  //         <div className="font-mono text-sm py-1 px-2 mx-auto bg-slate-50 rounded-md border border-slate-200 inline-block">
  //           {documentNumber}
  //         </div>
  //       );
  //     },
  //   },
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
            <div>
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
    accessorKey: "guests",
    size: 10,
    meta: {
      title: "Detalles",
    },
    header: () => <div>Detalles</div>,
    cell: ({ row }) => {
      if (!row.original?.guests) {
        return null;
      }
      let guests: ReservationGuest[] | undefined = undefined;
      try {
        if (row.original?.guests) {
          guests = JSON.parse(row.original.guests) as ReservationGuest[];
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error al traer huéspedes asociados: " + error.message);
        }
        toast.error("Error al traer huéspedes asociados");
        return null;
      }
      if (!!guests) {
        return (
          <div>
            <div className="flex flex-wrap gap-3 mt-2">
              {guests.map((guest, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1 py-1 px-2 border-amber-200 text-amber-700"
                >
                  <span>{guest.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        );
      } else {
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
        {row.getValue("estado") ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-500 border-emerald-200">
            Activo
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-500 border-red-200">
            Archivado
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
    id: "expand", // Nueva columna para expansión
    header: () => null, // No mostrar un título en el header
    cell: ({ row }) => (
      <Button
        onClick={() => row.toggleExpanded()} // Alternar la expansión de la fila
        aria-label="Expand row"
        className="flex items-center justify-center p-2"
        variant={"ghost"}
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="size-4" /> // Ícono cuando la fila está expandida
        ) : (
          <ChevronRight className="size-4" /> // Ícono cuando la fila está colapsada
        )}
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },

  {
    id: "actions",
    cell: function Cell() {
      // { row }
      //   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      //   const [showReactivateDialog, setShowReactivateDialog] = useState(false);
      //   const [showEditDialog, setShowEditDialog] = useState(false);

      // const { isActive } = row.original;
      return (
        <div>
          <div>
            {/* {showEditDialog && (
              <UpdateCustomerSheet open={showEditDialog} onOpenChange={setShowEditDialog} customer={row?.original} />
            )}

            {showDeleteDialog && (
              <DeleteCustomersDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                customers={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )}
            {showReactivateDialog && (
              <ReactivateCustomersDialog
                open={showReactivateDialog}
                onOpenChange={setShowReactivateDialog}
                customers={[row?.original]}
                showTrigger={false}
                onSuccess={() => {
                  row.toggleSelected(false);
                }}
              />
            )} */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {/* <DropdownMenuItem onSelect={() => setShowEditDialog(true)} disabled={!isActive}>
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
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enablePinning: true,
  },
];
