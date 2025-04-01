"use client";

import { useState } from "react";
import {
  Calendar,
  CalendarIcon,
  CreditCard,
  Download,
  FileText,
  Filter,
  Key,
  Loader,
  MapPin,
  Moon,
  Printer,
  Search,
  Star,
  User,
  Utensils,
  Wifi,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for demonstration
const bookings = [
  {
    id: "1",
    roomNumber: "301",
    roomType: "Deluxe Suite",
    floor: 3,
    checkIn: "2023-12-15",
    checkOut: "2023-12-18",
    nights: 3,
    status: "checked-out",
    totalAmount: "S/. 450",
    paymentMethod: "Credit Card",
    guestCount: 2,
    specialRequests: "Late check-out requested",
    amenities: ["breakfast", "spa", "roomService"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 5,
    review: "Excellent stay, will definitely come back!",
    color: "#8B5CF6",
  },
  {
    id: "2",
    roomNumber: "205",
    roomType: "Standard Double",
    floor: 2,
    checkIn: "2023-09-05",
    checkOut: "2023-09-07",
    nights: 2,
    status: "checked-out",
    totalAmount: "S/. 220",
    paymentMethod: "PayPal",
    guestCount: 2,
    specialRequests: "",
    amenities: ["breakfast"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 4,
    review: "Clean room and friendly staff",
    color: "#3B82F6",
  },
  {
    id: "3",
    roomNumber: "512",
    roomType: "Executive Suite",
    floor: 5,
    checkIn: "2023-07-20",
    checkOut: "2023-07-25",
    nights: 5,
    status: "checked-out",
    totalAmount: "S/. 1200",
    paymentMethod: "Credit Card",
    guestCount: 3,
    specialRequests: "Extra pillows, champagne on arrival",
    amenities: ["breakfast", "spa", "roomService", "airport"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 5,
    review: "Luxurious experience, exceptional service",
    color: "#EC4899",
  },
  {
    id: "4",
    roomNumber: "118",
    roomType: "Ocean View",
    floor: 1,
    checkIn: "2023-04-10",
    checkOut: "2023-04-12",
    nights: 2,
    status: "checked-out",
    totalAmount: "S/. 380",
    paymentMethod: "Credit Card",
    guestCount: 2,
    specialRequests: "",
    amenities: ["breakfast", "roomService"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 3,
    review: "Great view but room was a bit small",
    color: "#10B981",
  },
  {
    id: "5",
    roomNumber: "405",
    roomType: "Family Suite",
    floor: 4,
    checkIn: "2022-12-23",
    checkOut: "2022-12-27",
    nights: 4,
    status: "checked-out",
    totalAmount: "S/. 780",
    paymentMethod: "Credit Card",
    guestCount: 4,
    specialRequests: "Connecting rooms, crib for baby",
    amenities: ["breakfast", "pool", "roomService"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 5,
    review: "Perfect for our family holiday",
    color: "#F59E0B",
  },
  {
    id: "6",
    roomNumber: "701",
    roomType: "Presidential Suite",
    floor: 7,
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    nights: 3,
    status: "upcoming",
    totalAmount: "S/. 1500",
    paymentMethod: "Credit Card",
    guestCount: 2,
    specialRequests: "Anniversary celebration, romantic setup",
    amenities: ["breakfast", "spa", "roomService", "airport", "champagne"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: null,
    review: "",
    color: "#6366F1",
  },
  {
    id: "7",
    roomNumber: "302",
    roomType: "Deluxe Suite",
    floor: 3,
    checkIn: "2022-08-10",
    checkOut: "2022-08-15",
    nights: 5,
    status: "checked-out",
    totalAmount: "S/. 750",
    paymentMethod: "Credit Card",
    guestCount: 2,
    specialRequests: "",
    amenities: ["breakfast", "spa"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 4,
    review: "Very comfortable stay",
    color: "#8B5CF6",
  },
  {
    id: "8",
    roomNumber: "604",
    roomType: "Penthouse",
    floor: 6,
    checkIn: "2022-05-20",
    checkOut: "2022-05-23",
    nights: 3,
    status: "checked-out",
    totalAmount: "S/. 1800",
    paymentMethod: "Credit Card",
    guestCount: 4,
    specialRequests: "Birthday celebration",
    amenities: ["breakfast", "spa", "roomService", "airport", "champagne", "pool"],
    roomImage: "/placeholder.svg?height=100&width=150",
    rating: 5,
    review: "Absolutely stunning views and service",
    color: "#EF4444",
  },
];

// Get amenity icon
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "breakfast":
      return <Utensils className="h-4 w-4" />;
    case "spa":
      return <User className="h-4 w-4" />;
    case "roomService":
      return <Utensils className="h-4 w-4" />;
    case "airport":
      return <MapPin className="h-4 w-4" />;
    case "pool":
      return <Wifi className="h-4 w-4" />;
    case "champagne":
      return <Wifi className="h-4 w-4" />;
    default:
      return <Wifi className="h-4 w-4" />;
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Group bookings by year
const groupBookingsByYear = (bookings: any[]) => {
  const grouped: Record<string, any[]> = {};

  bookings.forEach((booking) => {
    const date = new Date(booking.checkIn);
    const year = date.getFullYear().toString();

    if (!grouped[year]) {
      grouped[year] = [];
    }

    grouped[year].push(booking);
  });

  return grouped;
};

// Calculate total stats
const calculateStats = (bookings: any[]) => {
  const totalStays = bookings.length;
  const totalNights = bookings.reduce((sum, booking) => sum + booking.nights, 0);
  const totalSpent = bookings.reduce((sum, booking) => {
    const amount = Number.parseFloat(booking.totalAmount.replace("S/. ", ""));
    return sum + amount;
  }, 0);

  return { totalStays, totalNights, totalSpent };
};

// Get status badge variant
const getStatusBadge = (status: string) => {
  switch (status) {
    case "checked-in":
      return "default";
    case "checked-out":
      return "secondary";
    case "upcoming":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function HotelBookingHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  console.log("selectedBooking", setSelectedBooking);
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>({ key: "checkIn", direction: "descending" });
  console.log("selectedBooking", setSortConfig);
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<any | null>(null);

  // Filter bookings based on search term, status and year
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.specialRequests.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    const matchesYear = !yearFilter || new Date(booking.checkIn).getFullYear().toString() === yearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue, bValue;

    switch (sortConfig.key) {
      case "checkIn":
        aValue = new Date(a.checkIn).getTime();
        bValue = new Date(b.checkIn).getTime();
        break;
      case "checkOut":
        aValue = new Date(a.checkOut).getTime();
        bValue = new Date(b.checkOut).getTime();
        break;
      case "nights":
        aValue = a.nights;
        bValue = b.nights;
        break;
      case "roomNumber":
        aValue = a.roomNumber;
        bValue = b.roomNumber;
        break;
      case "roomType":
        aValue = a.roomType;
        bValue = b.roomType;
        break;
      case "totalAmount":
        aValue = Number.parseFloat(a.totalAmount.replace("S/. ", ""));
        bValue = Number.parseFloat(b.totalAmount.replace("S/. ", ""));
        break;
      default:
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const groupedBookings = groupBookingsByYear(filteredBookings);
  const stats = calculateStats(filteredBookings);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Key className="mr-2 h-4 w-4 text-primary" />
              Total Estancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStays}</div>
            <p className="text-sm text-muted-foreground">Reservas realizadas</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Moon className="mr-2 h-4 w-4 text-primary" />
              Total Noches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalNights}</div>
            <p className="text-sm text-muted-foreground">Noches de estancia</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-primary" />
              Total Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">S/. {stats.totalSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Valor del cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de habitación, tipo o solicitudes especiales..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mt-2 absolute z-10 w-full shadow-lg animate-in fade-in-50 slide-in-from-top-5 duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Año</label>
                  <Select
                    value={yearFilter || "all"}
                    onValueChange={(val) => setYearFilter(val === "all" ? null : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los años" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los años</SelectItem>
                      {Object.keys(groupBookingsByYear(bookings))
                        .sort((a, b) => b.localeCompare(a))
                        .map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo de Habitación</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las Reservas</SelectItem>
                      <SelectItem value="checked-in">Registrado</SelectItem>
                      <SelectItem value="checked-out">Finalizado</SelectItem>
                      <SelectItem value="upcoming">Próximo</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setYearFilter(null);
                    setSelectedStatus("all");
                    setSearchTerm("");
                  }}
                >
                  Limpiar Filtros
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)}>
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Selector */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="table" className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>Vista Tarjetas</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Vista Cronológica</span>
          </TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBookings.length > 0 ? (
              sortedBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4"
                  style={{ borderLeftColor: booking.color }}
                  onClick={() => setSelectedDetailBooking(booking)}
                >
                  {/* Encabezado de la tarjeta */}
                  <div className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                          {booking.roomNumber}
                        </div>
                        <div>
                          <h3 className="font-semibold">{booking.roomType}</h3>
                          <p className="text-xs text-muted-foreground">Piso {booking.floor}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadge(booking.status)} className="capitalize">
                        {booking.status.replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-muted-foreground">
                        {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
                      </div>
                      <div className="font-bold">{booking.totalAmount}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Fechas */}
                  <div className="p-4 pt-3 pb-3">
                    <div className="bg-muted/40 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Check-in</p>
                          <p className="font-medium">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Check-out</p>
                          <p className="font-medium">{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="px-4 pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.guestCount} huéspedes</span>
                      </div>

                      <div className="flex gap-1">
                        {booking.amenities.slice(0, 3).map((amenity, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="p-1 bg-muted rounded-full">{getAmenityIcon(amenity)}</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="capitalize">{amenity.replace(/([A-Z])/g, " $1").trim()}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {booking.amenities.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="p-1 bg-muted rounded-full text-xs flex items-center justify-center w-6 h-6">
                                  +{booking.amenities.length - 3}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  {booking.amenities.slice(3).map((amenity) => (
                                    <p key={amenity} className="capitalize">
                                      {amenity.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-3 text-xs text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded-md">
                        <span className="font-medium">Solicitudes:</span> {booking.specialRequests}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Pie de tarjeta */}
                  <div className="p-3 flex justify-end items-center">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Ver detalles
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">No se encontraron reservas que coincidan con tus criterios</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline" className="space-y-8">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-4">
                {Object.keys(groupedBookings).length > 0 ? (
                  <div className="space-y-10">
                    {Object.keys(groupedBookings)
                      .sort((a, b) => b.localeCompare(a))
                      .map((year) => (
                        <div key={year} className="relative">
                          <div className="sticky top-0 z-10 bg-background py-2 mb-6">
                            <h2 className="text-2xl font-bold">{year}</h2>
                            <Separator className="mt-2" />
                          </div>

                          <div className="space-y-6">
                            {groupedBookings[year]
                              .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
                              .map((booking) => (
                                <div key={booking.id} className="relative">
                                  <div className="relative border-l-2 border-muted pl-6 ml-2">
                                    <div
                                      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full"
                                      style={{ backgroundColor: booking.color }}
                                      aria-hidden="true"
                                    />

                                    <Card
                                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                                        selectedBooking === booking.id ? "ring-2 ring-primary" : ""
                                      }`}
                                      onClick={() => setSelectedDetailBooking(booking)}
                                    >
                                      <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <CardTitle className="flex items-center gap-2">
                                              <span>Habitación {booking.roomNumber}</span>
                                              <span className="text-sm font-normal text-muted-foreground">
                                                ({booking.roomType})
                                              </span>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                              <Calendar className="h-3.5 w-3.5" />
                                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                              <span className="mx-1">•</span>
                                              <Moon className="h-3.5 w-3.5" />
                                              {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
                                            </CardDescription>
                                          </div>
                                          <Badge variant={getStatusBadge(booking.status)} className="capitalize">
                                            {booking.status.replace("-", " ")}
                                          </Badge>
                                        </div>
                                      </CardHeader>

                                      <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-muted-foreground">Huéspedes</p>
                                            <p className="font-medium">{booking.guestCount}</p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">Método de pago</p>
                                            <p className="font-medium">{booking.paymentMethod}</p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">Piso</p>
                                            <p className="font-medium">{booking.floor}</p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">Total</p>
                                            <p className="font-medium">{booking.totalAmount}</p>
                                          </div>
                                        </div>

                                        {booking.specialRequests && (
                                          <div className="mt-4 pt-4 border-t">
                                            <p className="text-muted-foreground text-sm">Solicitudes especiales</p>
                                            <p className="text-sm">{booking.specialRequests}</p>
                                          </div>
                                        )}
                                      </CardContent>

                                      <CardFooter className="flex justify-between">
                                        {booking.rating ? (
                                          <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < booking.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                              />
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="text-xs text-muted-foreground">Sin valoración</div>
                                        )}

                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDetailBooking(booking);
                                          }}
                                        >
                                          Ver detalles
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No se encontraron reservas que coincidan con tus criterios</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedDetailBooking} onOpenChange={(open) => !open && setSelectedDetailBooking(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
            <DialogDescription>Información completa de la estancia del cliente</DialogDescription>
          </DialogHeader>

          {selectedDetailBooking && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Habitación {selectedDetailBooking.roomNumber}</h3>
                    <p className="text-muted-foreground">
                      {selectedDetailBooking.roomType} - Piso {selectedDetailBooking.floor}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(selectedDetailBooking.status)} className="capitalize">
                    {selectedDetailBooking.status.replace("-", " ")}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{formatDate(selectedDetailBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{formatDate(selectedDetailBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duración</p>
                    <p className="font-medium">
                      {selectedDetailBooking.nights} {selectedDetailBooking.nights === 1 ? "noche" : "noches"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Huéspedes</p>
                    <p className="font-medium">{selectedDetailBooking.guestCount}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities incluidos</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetailBooking.amenities.map((amenity: string) => (
                      <TooltipProvider key={amenity}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-2 bg-muted rounded-md">{getAmenityIcon(amenity)}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{amenity.replace(/([A-Z])/g, " $1").trim()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                {selectedDetailBooking.specialRequests && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Solicitudes especiales</p>
                      <p>{selectedDetailBooking.specialRequests}</p>
                    </div>
                  </>
                )}

                {selectedDetailBooking.rating && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Valoración del cliente</p>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < selectedDetailBooking.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      {selectedDetailBooking.review && (
                        <div className="bg-muted p-3 rounded-md italic">"{selectedDetailBooking.review}"</div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resumen de pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{selectedDetailBooking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span>Incluidos</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{selectedDetailBooking.totalAmount}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedDetailBooking.paymentMethod}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir factura
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar detalles
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDetailBooking(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Mostrando {filteredBookings.length} de {bookings.length} reservas totales
        </p>
      </div>
    </div>
  );
}
