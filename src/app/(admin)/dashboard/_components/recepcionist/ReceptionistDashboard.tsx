"use client";

import { useState } from "react";
import { BedDouble, Calendar, CalendarDays, CalendarRange, ClipboardList, Clock, Hotel } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import { RoomStatusByType } from "../admin/occupancy/RoomStatusByType";
import PendingAmenitiesTabsContentDashboard from "./pending-amenities/PendingAmenitiesTabsContentDashboard";
import { AvailableRooms } from "./rooms/AvailableRooms";
import TodayTabsContentDashboard from "./today/TodayTabsContentDashboard";

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("hoy");
  const {
    todayRecepcionistStatistics,
    top5TodayCheckIn,
    top5TodayCheckOut,
    top5PriorityPendingAmenities,
    roomOccupancy,
    amenitiesByPriority,
  } = useDashboard({ activeTab });

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="hoy" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative grid grid-cols-4 w-full h-fit border-0 z-10">
          <TabsTrigger
            value="hoy"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Hoy</span>
          </TabsTrigger>
          <TabsTrigger
            value="habitaciones"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Hotel className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Habitaciones</span>
          </TabsTrigger>
          <TabsTrigger
            value="reservas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Reservas</span>
          </TabsTrigger>
          <TabsTrigger
            value="amenidades"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Amenidades</span>
          </TabsTrigger>
        </TabsList>

        <TodayTabsContentDashboard
          todayRecepcionistStatistics={todayRecepcionistStatistics}
          top5PriorityPendingAmenities={top5PriorityPendingAmenities}
          top5TodayCheckIn={top5TodayCheckIn}
          top5TodayCheckOut={top5TodayCheckOut}
        />

        <TabsContent value="habitaciones" className="space-y-4">
          <RoomStatusByType roomOccupancy={roomOccupancy} />

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Habitaciones Disponibles</CardTitle>
                  <CardDescription>Habitaciones listas para check-in</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AvailableRooms />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservas" className="space-y-4">
          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hoy</p>
                    <div className="text-2xl font-bold">8</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CalendarRange className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mañana</p>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CalendarRange className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                    <div className="text-2xl font-bold">47</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <CalendarRange className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de reservas mejorada */}
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    Próximas Reservas
                  </CardTitle>
                  <CardDescription>Reservas para los próximos 7 días</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500">12 Confirmadas</Badge>
                  <Badge variant="outline">3 Pendientes</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {/* Reserva 1 */}
                <div className="flex items-center justify-between p-6 border-b hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">JP</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold">Juan Pérez</p>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Estándar
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Habitación 101
                        </span>
                        <span>20/05/2023 - 23/05/2023</span>
                        <span>3 noches</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Check-in: 14:00</span>
                        <span className="text-muted-foreground">2 huéspedes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">S/ 1,450</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Check-in
                    </Button>
                  </div>
                </div>

                {/* Reserva 2 */}
                <div className="flex items-center justify-between p-6 border-b hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">MG</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold">María García</p>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Deluxe
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Habitación 205
                        </span>
                        <span>21/05/2023 - 25/05/2023</span>
                        <span>4 noches</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Check-in: 15:30</span>
                        <span className="text-muted-foreground">1 huésped</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">S/ 2,680</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Check-in
                    </Button>
                  </div>
                </div>

                {/* Reserva 3 */}
                <div className="flex items-center justify-between p-6 border-b hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-amber-100 text-amber-600 font-semibold">RJ</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold">Roberto Jiménez</p>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Suite
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Habitación 302
                        </span>
                        <span>22/05/2023 - 24/05/2023</span>
                        <span>2 noches</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          Pendiente confirmación
                        </span>
                        <span className="text-muted-foreground">2 huéspedes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">S/ 1,320</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <Badge variant="secondary">Pendiente</Badge>
                    <Button variant="outline" size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>

                {/* Reserva 4 */}
                <div className="flex items-center justify-between p-6 border-b hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green-100 text-green-600 font-semibold">AM</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold">Ana Martínez</p>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Estándar
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Habitación 110
                        </span>
                        <span>23/05/2023 - 27/05/2023</span>
                        <span>4 noches</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Check-in: 16:00</span>
                        <span className="text-muted-foreground">3 huéspedes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">S/ 2,550</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Check-in
                    </Button>
                  </div>
                </div>

                {/* Reserva 5 */}
                <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">CL</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold">Carlos López</p>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Deluxe
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          Habitación 215
                        </span>
                        <span>24/05/2023 - 26/05/2023</span>
                        <span>2 noches</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          Pendiente confirmación
                        </span>
                        <span className="text-muted-foreground">2 huéspedes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">S/ 1,890</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <Badge variant="secondary">Pendiente</Badge>
                    <Button variant="outline" size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón para ver más */}
          <div className="flex justify-center">
            <Button variant="outline" className="w-full md:w-auto">
              Ver todas las reservas
            </Button>
          </div>
        </TabsContent>

        <PendingAmenitiesTabsContentDashboard amenitiesByPriority={amenitiesByPriority} />
      </Tabs>
    </div>
  );
}
