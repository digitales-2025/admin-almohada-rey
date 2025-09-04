"use client";

import React from "react";
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Eye,
  Filter,
  History,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerReservationHistoryResponse } from "../../_types/customer-reservation-history";
import { formatDate, getRelativeTime } from "../../_utils/customer-reservation-history.utils";

interface ListPastReservationsProps {
  reservations: CustomerReservationHistoryResponse[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  filterPeriod: "all" | "week" | "month" | "year";
  setFilterPeriod: (period: "all" | "week" | "month" | "year") => void;
  selectedReservation: CustomerReservationHistoryResponse | null;
  onView: (reservation: CustomerReservationHistoryResponse) => void;
  onEdit: (reservation: CustomerReservationHistoryResponse) => void;
  onDelete: (reservation: CustomerReservationHistoryResponse) => void;
  getFilteredReservations: () => CustomerReservationHistoryResponse[];
}

export function ListPastReservations({
  reservations,
  isLoading,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  filterPeriod,
  setFilterPeriod,
  selectedReservation,
  onView,
  onEdit,
  onDelete,
  getFilteredReservations,
}: ListPastReservationsProps) {
  const filteredReservations = getFilteredReservations();

  return (
    <div className="space-y-4">
      {/* Header de la lista */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-primary" />
          <span className="font-semibold text-base">Archivo Histórico</span>
          <Badge variant="secondary">{reservations.length}</Badge>
        </div>
      </div>

      {/* Controles de búsqueda y filtros compactos */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar fechas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="gap-1 text-xs flex-1"
          >
            {sortOrder === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            {sortOrder === "desc" ? "Reciente" : "Antigua"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const periods = ["all", "week", "month", "year"] as const;
              const currentIndex = periods.indexOf(filterPeriod);
              const nextIndex = (currentIndex + 1) % periods.length;
              setFilterPeriod(periods[nextIndex]);
            }}
            className="gap-1 text-xs flex-1"
          >
            <Filter className="h-3 w-3" />
            {filterPeriod === "all" && "Todas"}
            {filterPeriod === "week" && "Semana"}
            {filterPeriod === "month" && "Mes"}
            {filterPeriod === "year" && "Año"}
          </Button>
        </div>
      </div>

      {/* Lista de reservas compacta */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">Cargando historial...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-3">
              {searchTerm || filterPeriod !== "all" ? "No se encontraron registros" : "No hay fechas registradas"}
            </p>
            {(searchTerm || filterPeriod !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterPeriod("all");
                }}
                className="gap-1 text-xs"
              >
                <RotateCcw className="h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>
        ) : (
          filteredReservations.map((reservation) => {
            const isRecent = new Date().getTime() - new Date(reservation.date).getTime() < 7 * 24 * 60 * 60 * 1000;
            const isSelected = selectedReservation?.id === reservation.id;

            return (
              <div
                key={reservation.id}
                className={`
                  group p-3 border rounded-lg transition-all duration-200 cursor-pointer
                  ${isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent/30"}
                  ${isRecent ? "border-primary/30" : ""}
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {isRecent && (
                      <Badge variant="default" size="sm" className="text-xs">
                        Reciente
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm leading-tight">{formatDate(reservation.date)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {getRelativeTime(reservation.date)}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onView(reservation)} className="h-7 w-7 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(reservation)} className="h-7 w-7 p-0">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(reservation)} className="h-7 w-7 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
