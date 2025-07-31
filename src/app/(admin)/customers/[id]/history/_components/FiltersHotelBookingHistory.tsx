import { ArrowDownWideNarrow, ArrowUpWideNarrow, CalendarDays, Filter, LayoutGrid, Search, X } from "lucide-react";

import { reservationStatusConfig } from "@/app/(admin)/reservation/_types/reservation-enum.config";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerReservation } from "../../../_types/customer";

interface FiltersHotelBookingHistoryProps {
  filteredBookings: CustomerReservation[];
  resetFilters: () => void;
  setYearFilter: (year: string | null) => void;
  setRoomTypeFilter: (roomType: string | null) => void;
  yearFilter: string | null;
  roomTypeFilter: string | null;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  years: string[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  roomTypes: string[];
  sortConfig: {
    key: string;
    direction: "ascending" | "descending";
  };
  viewMode: string;
  setViewMode: (view: string) => void;
  requestSort: (key: string) => void;
}

export default function FiltersHotelBookingHistory({
  filteredBookings,
  resetFilters,
  setYearFilter,
  setRoomTypeFilter,
  yearFilter,
  roomTypeFilter,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  years,
  showFilters,
  setShowFilters,
  roomTypes,
  sortConfig,
  viewMode,
  setViewMode,
  requestSort,
}: FiltersHotelBookingHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <div className="relative">
        <Card className="border">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Buscar por número de habitación, tipo o solicitudes especiales..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`relative ${showFilters ? "bg-slate-100 border-slate-300" : ""}`}
                    >
                      <Filter className="h-4 w-4" />
                      {(yearFilter || roomTypeFilter || selectedStatus !== "all") && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Filtros Avanzados</h4>
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                          Limpiar
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="year-filter">Año</Label>
                        <Select
                          value={yearFilter || "all"}
                          onValueChange={(val) => setYearFilter(val === "all" ? null : val)}
                        >
                          <SelectTrigger id="year-filter" className="w-full">
                            <SelectValue placeholder="Todos los años" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los años</SelectItem>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="room-type-filter">Tipo de Habitación</Label>
                        <Select
                          value={roomTypeFilter || "all"}
                          onValueChange={(val) => setRoomTypeFilter(val === "all" ? null : val)}
                        >
                          <SelectTrigger id="room-type-filter" className="w-full capitalize">
                            <SelectValue placeholder="Todos los tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            {roomTypes.map((type) => {
                              const typeKey = getRoomTypeKey(type);
                              const roomTypeConfig = RoomTypeLabels[typeKey];
                              const Icon = roomTypeConfig.icon;

                              return (
                                <SelectItem className="capitalize" key={type} value={type}>
                                  <div className="flex items-center">
                                    <Icon className={`h-4 w-4 mr-2 ${roomTypeConfig.className}`} />
                                    <span>{type}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status-filter">Estado</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger id="status-filter" className="w-full">
                            <SelectValue placeholder="Filtrar por estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las Reservas</SelectItem>
                            <SelectItem value="PENDING">
                              <div className="flex items-center">
                                {reservationStatusConfig.PENDING.icon && (
                                  <reservationStatusConfig.PENDING.icon
                                    className={`h-4 w-4 mr-2 ${reservationStatusConfig.PENDING.textColor}`}
                                  />
                                )}
                                <span>{reservationStatusConfig.PENDING.name}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CONFIRMED">
                              <div className="flex items-center">
                                {reservationStatusConfig.CONFIRMED.icon && (
                                  <reservationStatusConfig.CONFIRMED.icon
                                    className={`h-4 w-4 mr-2 ${reservationStatusConfig.CONFIRMED.textColor}`}
                                  />
                                )}
                                <span>{reservationStatusConfig.CONFIRMED.name}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CHECKED_IN">
                              <div className="flex items-center">
                                {reservationStatusConfig.CHECKED_IN.icon && (
                                  <reservationStatusConfig.CHECKED_IN.icon
                                    className={`h-4 w-4 mr-2 ${reservationStatusConfig.CHECKED_IN.textColor}`}
                                  />
                                )}
                                <span>{reservationStatusConfig.CHECKED_IN.name}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CHECKED_OUT">
                              <div className="flex items-center">
                                {reservationStatusConfig.CHECKED_OUT.icon && (
                                  <reservationStatusConfig.CHECKED_OUT.icon
                                    className={`h-4 w-4 mr-2 ${reservationStatusConfig.CHECKED_OUT.textColor}`}
                                  />
                                )}
                                <span>{reservationStatusConfig.CHECKED_OUT.name}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CANCELED">
                              <div className="flex items-center">
                                {reservationStatusConfig.CANCELED.icon && (
                                  <reservationStatusConfig.CANCELED.icon
                                    className={`h-4 w-4 mr-2 ${reservationStatusConfig.CANCELED.textColor}`}
                                  />
                                )}
                                <span>{reservationStatusConfig.CANCELED.name}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <Button className="w-full" onClick={() => setShowFilters(false)}>
                        Aplicar Filtros
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground p-2">
            {filteredBookings.length} {filteredBookings.length === 1 ? "reserva" : "reservas"}
          </span>
          {(yearFilter || roomTypeFilter || selectedStatus !== "all" || searchTerm) && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Filtros activos</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={resetFilters}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <Select value={sortConfig.key} onValueChange={(value) => requestSort(value)}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkInDate">Fecha de entrada</SelectItem>
                <SelectItem value="roomNumber">Número de habitación</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="nights">Noches</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => requestSort(sortConfig.key)}>
              {sortConfig.direction === "ascending" ? (
                <ArrowUpWideNarrow className="h-4 w-4" />
              ) : (
                <ArrowDownWideNarrow className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="border-l pl-4">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
              <TabsList className="h-9 p-1">
                <TabsTrigger value="cards" className="px-3 py-1">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only">Tarjetas</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="px-3 py-1">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only">Cronología</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
