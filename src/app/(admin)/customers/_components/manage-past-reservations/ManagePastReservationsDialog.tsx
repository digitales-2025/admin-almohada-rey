"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Archive, Calendar, Clock } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCustomerReservationHistory } from "../../_hooks/use-customer-reservation-history";
import {
  createCustomerReservationHistorySchema,
  CustomerReservationHitoryFormData,
} from "../../_schema/createCustomerReservationHistorySchema";
import { Customer } from "../../_types/customer";
import { CustomerReservationHistoryResponse } from "../../_types/customer-reservation-history";
import { formatDate, getRelativeTime } from "../../_utils/customer-reservation-history.utils";
import { ListPastReservations } from "./ListPastReservations";
import { ManagePastReservationsForm } from "./ManagePastReservationsForm";

type DialogMode = "archive" | "create" | "edit" | "view";

interface ManagePastReservationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
}

export function ManagePastReservationsDialog({ open, onOpenChange, customer }: ManagePastReservationsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [mode, setMode] = useState<DialogMode>("create");
  const [selectedReservation, setSelectedReservation] = useState<CustomerReservationHistoryResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<CustomerReservationHistoryResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "week" | "month" | "year">("all");

  // Use the customer reservation history hook
  const {
    customerReservationHistories: reservations,
    isLoading,
    onCreateCustomerReservationHistory,
    onUpdateCustomerReservationHistory,
    onDeleteCustomerReservationHistories,
  } = useCustomerReservationHistory({ customerId: customer.id });

  const form = useForm<CustomerReservationHitoryFormData>({
    resolver: zodResolver(createCustomerReservationHistorySchema),
    defaultValues: {
      date: "",
    },
  });

  useEffect(() => {
    if (!open) {
      setMode("create");
      setSelectedReservation(null);
      setSearchTerm("");
      form.reset({ date: "" });
    }
  }, [open, form]);

  useEffect(() => {
    if (mode === "edit" && selectedReservation) {
      // Asegurar que el formulario tenga la fecha correcta para editar
      form.setValue("date", selectedReservation.date);
    } else if (mode === "create") {
      form.reset({ date: "" });
    }
  }, [mode, selectedReservation, form]);

  const onSubmit = async (data: CustomerReservationHitoryFormData) => {
    if (mode === "create") {
      await onCreateCustomerReservationHistory({
        customerId: customer.id,
        date: data.date,
      });
      form.reset({ date: "" });
    } else if (mode === "edit" && selectedReservation) {
      await onUpdateCustomerReservationHistory({
        id: selectedReservation.id,
        body: { date: data.date },
      });
      setMode("create");
      setSelectedReservation(null);
      form.reset({ date: "" });
    }
  };

  const handleDelete = (reservation: CustomerReservationHistoryResponse) => {
    setReservationToDelete(reservation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (reservationToDelete) {
      await onDeleteCustomerReservationHistories([reservationToDelete.id]);
    }
    setDeleteDialogOpen(false);
    setReservationToDelete(null);
  };

  const handleEdit = (reservation: CustomerReservationHistoryResponse) => {
    setSelectedReservation(reservation);
    setMode("edit");
  };

  const handleView = (reservation: CustomerReservationHistoryResponse) => {
    setSelectedReservation(reservation);
    setMode("view");
  };

  const handleBackToCreate = () => {
    setMode("create");
    setSelectedReservation(null);
    form.reset({ date: "" });
  };

  const getFilteredReservations = () => {
    let filtered = [...reservations];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.date.includes(searchTerm) ||
          r.id.includes(searchTerm) ||
          formatDate(r.date).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por período
    if (filterPeriod !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filterPeriod) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((r) => new Date(r.date) >= cutoffDate);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const renderContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Columna izquierda: Lista de reservas */}
      <div>
        <ListPastReservations
          reservations={reservations}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          selectedReservation={selectedReservation}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getFilteredReservations={getFilteredReservations}
        />
      </div>

      {/* Columna derecha: Formulario dinámico */}
      <div>
        <ManagePastReservationsForm
          mode={mode}
          selectedReservation={selectedReservation}
          form={form}
          onSubmit={onSubmit}
          onBackToCreate={handleBackToCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[800px] px-0">
            <DialogHeader className="px-4">
              <DialogTitle className="flex items-center gap-2">Gestor de Reservas Históricas</DialogTitle>
              <DialogDescription>Administra tu archivo completo de fechas de reservas pasadas</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full max-h-[80vh] px-0">
              <div className="px-6">{renderContent()}</div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Eliminar del Archivo Histórico
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas eliminar esta fecha del archivo histórico? Esta acción no se puede deshacer.
              </AlertDialogDescription>
              {reservationToDelete && (
                <div className="mt-3 p-3 bg-accent/50 rounded border-l-4 border-l-destructive">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4" />
                    Fecha: {formatDate(reservationToDelete.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {getRelativeTime(reservationToDelete.date)}
                  </div>
                </div>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
                Eliminar del Archivo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Gestor de Reservas Históricas
            </DrawerTitle>
            <DrawerDescription>Administra tu archivo completo de fechas de reservas pasadas</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-0">
              <div className="px-4">{renderContent()}</div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Eliminar del Archivo Histórico
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta fecha del archivo histórico? Esta acción no se puede deshacer.
            </AlertDialogDescription>
            {reservationToDelete && (
              <div className="mt-3 p-3 bg-accent/50 rounded border-l-4 border-l-destructive">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  Fecha: {formatDate(reservationToDelete.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {getRelativeTime(reservationToDelete.date)}
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Eliminar del Archivo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
