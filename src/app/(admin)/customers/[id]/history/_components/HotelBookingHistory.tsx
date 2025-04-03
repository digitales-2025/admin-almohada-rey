"use client";

import { useMemo, useState } from "react";
import { CreditCard, Key, Moon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateStats, groupBookingsByYear } from "../_utils/customerHistory.utils";
import type { CustomerReservation, HistoryCustomer } from "../../../_types/customer";
import CardsViewHotelBookingHistory from "./CardsViewHotelBookingHistory";
import FiltersHotelBookingHistory from "./FiltersHotelBookingHistory";
import CustomerReservationDescriptionDialog from "./show-detail/CustomerReservationDescriptionDialog";
import TimelineHotelBookingHistory from "./TimelineHotelBookingHistory";

interface HotelBookingHistoryProps {
  historyCustomerById: HistoryCustomer | undefined;
  yearFilter: string | null;
  roomTypeFilter: string | null;
  setYearFilter: (year: string | null) => void;
  setRoomTypeFilter: (roomType: string | null) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function HotelBookingHistory({
  historyCustomerById,
  yearFilter,
  roomTypeFilter,
  setRoomTypeFilter,
  setYearFilter,
  selectedStatus,
  setSelectedStatus,
}: HotelBookingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedDetailBooking, setSelectedDetailBooking] = useState<CustomerReservation | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({ key: "checkInDate", direction: "descending" });

  const groupedBookings = groupBookingsByYear(historyCustomerById);
  const stats = calculateStats(historyCustomerById);

  // Get years for filter
  const years = useMemo(() => {
    return Object.keys(groupedBookings).sort((a, b) => b.localeCompare(a));
  }, [groupedBookings]);

  // Get unique room types
  const roomTypes = useMemo(() => {
    if (!historyCustomerById?.reservations) return [];

    const types = new Set<string>();
    historyCustomerById.reservations.forEach((reservation) => {
      if (reservation.room?.RoomTypes?.name) {
        types.add(reservation.room.RoomTypes.name);
      }
    });

    return Array.from(types);
  }, [historyCustomerById]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setYearFilter(null);
    setRoomTypeFilter(null);
    setSortConfig({ key: "checkInDate", direction: "descending" });
  };

  // Sort function
  const requestSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  // Filtered bookings with search functionality
  const filteredBookings = useMemo(() => {
    if (!historyCustomerById?.reservations) return [];

    let filtered = historyCustomerById.reservations;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === selectedStatus);
    }

    // Filter by year
    if (yearFilter) {
      filtered = filtered.filter((booking) => {
        const checkInYear = new Date(booking.checkInDate).getFullYear().toString();
        return checkInYear === yearFilter;
      });
    }

    // Filter by room type
    if (roomTypeFilter) {
      filtered = filtered.filter((booking) => booking.room?.RoomTypes?.name === roomTypeFilter);
    }

    // Search term filtering
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((booking) => {
        // Convertir el precio a string para buscar
        const priceString = booking.payment?.amountPaid?.toString() || booking.payment?.amount?.toString() || "";

        return (
          // Buscar por número de habitación
          booking.room?.number.toString().includes(search) ||
          // Buscar por tipo de habitación
          booking.room?.RoomTypes?.name.toLowerCase().includes(search) ||
          // Buscar por observaciones
          (booking.observations && booking.observations.toLowerCase().includes(search)) ||
          // Buscar por motivo de estancia
          (booking.reason && booking.reason.toLowerCase().includes(search)) ||
          // Buscar por precio
          priceString.includes(search)
        );
      });
    }

    // Sort the filtered bookings
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === "checkInDate") {
        const dateA = new Date(a.checkInDate).getTime();
        const dateB = new Date(b.checkInDate).getTime();
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA;
      }

      if (sortConfig.key === "roomNumber") {
        const roomA = a.room?.number || 0;
        const roomB = b.room?.number || 0;
        return sortConfig.direction === "ascending" ? roomA - roomB : roomB - roomA;
      }

      if (sortConfig.key === "price") {
        const priceA = a.payment?.amount || 0;
        const priceB = b.payment?.amount || 0;
        return sortConfig.direction === "ascending" ? priceA - priceB : priceB - priceA;
      }

      if (sortConfig.key === "nights") {
        const nightsA = Math.ceil(
          (new Date(a.checkOutDate).getTime() - new Date(a.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const nightsB = Math.ceil(
          (new Date(b.checkOutDate).getTime() - new Date(b.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return sortConfig.direction === "ascending" ? nightsA - nightsB : nightsB - nightsA;
      }

      return 0;
    });
  }, [historyCustomerById, searchTerm, sortConfig]);

  return (
    <div className="space-y-6">
      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0" />
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-full bg-emerald-50 mr-3">
                <Key className="h-5 w-5 text-emerald-500" />
              </div>
              Total Estancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStays}</div>
            <p className="text-sm text-muted-foreground mt-2">Reservas realizadas</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0" />
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-full bg-violet-50 mr-3">
                <Moon className="h-5 w-5 text-violet-500" />
              </div>
              Total Noches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalNights}</div>

            <p className="text-sm text-muted-foreground mt-2">Noches de estancia</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0" />
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <div className="p-2 rounded-full bg-amber-50 mr-3">
                <CreditCard className="h-5 w-5 text-amber-500" />
              </div>
              Total Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">S/. {stats.totalSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-2">Valor del cliente</p>
          </CardContent>
        </Card>
      </div>

      <FiltersHotelBookingHistory
        filteredBookings={filteredBookings}
        requestSort={requestSort}
        resetFilters={resetFilters}
        roomTypeFilter={roomTypeFilter}
        roomTypes={roomTypes}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchTerm={setSearchTerm}
        setSelectedStatus={setSelectedStatus}
        setShowFilters={setShowFilters}
        setViewMode={setViewMode}
        setYearFilter={setYearFilter}
        showFilters={showFilters}
        sortConfig={sortConfig}
        viewMode={viewMode}
        yearFilter={yearFilter}
        years={years}
      />

      {/* View Content */}
      <div className="mt-6">
        {/* Cards View */}
        {viewMode === "cards" && (
          <CardsViewHotelBookingHistory
            filteredBookings={filteredBookings}
            setSelectedDetailBooking={setSelectedDetailBooking}
            resetFilters={resetFilters}
          />
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <TimelineHotelBookingHistory
            setSelectedDetailBooking={setSelectedDetailBooking}
            filteredBookings={filteredBookings}
            resetFilters={resetFilters}
          />
        )}
      </div>

      {/* Booking Detail Dialog */}
      <CustomerReservationDescriptionDialog
        open={!!selectedDetailBooking}
        onOpenChange={(open) => !open && setSelectedDetailBooking(null)}
        selectedDetailBooking={selectedDetailBooking}
        setSelectedDetailBooking={setSelectedDetailBooking}
      />
    </div>
  );
}
