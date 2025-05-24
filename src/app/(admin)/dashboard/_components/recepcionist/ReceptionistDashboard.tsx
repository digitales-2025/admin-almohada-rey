"use client";

import { useState } from "react";
import {
  BedDouble,
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  ClipboardList,
  Clock,
  Filter,
  Hotel,
  Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import { RoomStatusByType } from "../admin/occupancy/RoomStatusByType";
import { AvailableRooms } from "./rooms/AvailableRooms";
import { PendingTasks } from "./today/PendingTasks";
import { TodayCheckIns } from "./today/TodayCheckIns";
import { TodayCheckOuts } from "./today/TodayCheckOuts";

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("hoy");
  const { roomOccupancy } = useDashboard();

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
            value="tareas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Tareas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hoy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-ins Hoy</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <CalendarRange className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-blue-600 font-medium">3 ya registrados</span>
                  <span className="text-xs text-muted-foreground ml-1">• 5 pendientes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-outs Hoy</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckSquare className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-green-600 font-medium">2 ya finalizados</span>
                  <span className="text-xs text-muted-foreground ml-1">• 3 pendientes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Habitaciones Disponibles</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <BedDouble className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-purple-600 font-medium">de 30 habitaciones</span>
                  <span className="text-xs text-muted-foreground ml-1">• 40% disponible</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-amber-600 font-medium">requieren atención</span>
                  <span className="text-xs text-muted-foreground ml-1">• 1 urgente</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7 md:col-span-4 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Check-ins de Hoy</CardTitle>
                    <CardDescription>Huéspedes que llegarán hoy</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TodayCheckIns />
              </CardContent>
            </Card>

            <Card className="col-span-7 md:col-span-3 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Check-outs de Hoy</CardTitle>
                    <CardDescription>Huéspedes que se irán hoy</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TodayCheckOuts />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Tareas Pendientes</CardTitle>
                  <CardDescription>Tareas que requieren tu atención</CardDescription>
                </div>
                <Badge className="bg-amber-500">4 Pendientes</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <PendingTasks />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habitaciones" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Mapa de Habitaciones</CardTitle>
              <CardDescription>Vista por tipo de habitación</CardDescription>
            </CardHeader>
            <CardContent>
              <RoomStatusByType roomOccupancy={roomOccupancy} />
            </CardContent>
          </Card>

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar reserva o cliente..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Próximas Reservas</CardTitle>
                  <CardDescription>Reservas para los próximos 7 días</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500">12 Confirmadas</Badge>
                  <Badge variant="outline">3 Pendientes</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Juan Pérez</p>
                      <p className="text-xs text-muted-foreground">Hab. 101 (Estándar) • 20/05/2023 a 23/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm">Check-in</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">María García</p>
                      <p className="text-xs text-muted-foreground">Hab. 205 (Deluxe) • 21/05/2023 a 25/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm">Check-in</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Roberto Jiménez</p>
                      <p className="text-xs text-muted-foreground">Hab. 302 (Suite) • 22/05/2023 a 24/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Pendiente</Badge>
                    <Button variant="outline" size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Ana Martínez</p>
                      <p className="text-xs text-muted-foreground">Hab. 110 (Estándar) • 23/05/2023 a 27/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500">Confirmada</Badge>
                    <Button size="sm">Check-in</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Carlos López</p>
                      <p className="text-xs text-muted-foreground">Hab. 215 (Deluxe) • 24/05/2023 a 26/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Pendiente</Badge>
                    <Button variant="outline" size="sm">
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tareas" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar tarea..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por prioridad
              </Button>
              <Button>Nueva Tarea</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-md">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Pendientes</CardTitle>
                  <Badge>4</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      Alta Prioridad
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 30 min</span>
                  </div>
                  <h3 className="font-medium mb-1">Limpieza de habitación 203</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    El huésped ha solicitado limpieza urgente de la habitación.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Juan Pérez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Completar
                    </Button>
                  </div>
                </div>

                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                      Media Prioridad
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 1h</span>
                  </div>
                  <h3 className="font-medium mb-1">Toallas extra para habitación 105</h3>
                  <p className="text-sm text-muted-foreground mb-2">El huésped ha solicitado toallas adicionales.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">MS</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">María García</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Completar
                    </Button>
                  </div>
                </div>

                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                      Media Prioridad
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 2h</span>
                  </div>
                  <h3 className="font-medium mb-1">Solicitud de late check-out</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    El huésped solicita extender su estancia hasta las 14:00.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">RJ</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Roberto Jiménez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Completar
                    </Button>
                  </div>
                </div>

                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      Baja Prioridad
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 3h</span>
                  </div>
                  <h3 className="font-medium mb-1">Servicio a la habitación 302</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    El huésped ha solicitado servicio a la habitación.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">AL</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Ana López</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Completar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">En Progreso</CardTitle>
                  <Badge>2</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      En Progreso
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 45 min</span>
                  </div>
                  <h3 className="font-medium mb-1">Reparación de aire acondicionado</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Mantenimiento está trabajando en la habitación 210.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">MT</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Miguel Torres</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Finalizar
                    </Button>
                  </div>
                </div>

                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      En Progreso
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 1h 20min</span>
                  </div>
                  <h3 className="font-medium mb-1">Preparación de sala de conferencias</h3>
                  <p className="text-sm text-muted-foreground mb-2">Preparando la sala para el evento de mañana.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">LR</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Luis Ramírez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Finalizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Completadas</CardTitle>
                  <Badge>3</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Completada
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hoy, 10:30</span>
                  </div>
                  <h3 className="font-medium mb-1 line-through text-muted-foreground">
                    Cambio de sábanas habitación 104
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Se cambiaron las sábanas según lo solicitado.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">CP</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Carmen Pérez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reabrir
                    </Button>
                  </div>
                </div>

                <div className="p-4 border-b hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Completada
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hoy, 09:15</span>
                  </div>
                  <h3 className="font-medium mb-1 line-through text-muted-foreground">
                    Reposición de minibar habitación 301
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Se repuso el minibar con todos los productos.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">JM</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">José Martínez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reabrir
                    </Button>
                  </div>
                </div>

                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Completada
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hoy, 08:45</span>
                  </div>
                  <h3 className="font-medium mb-1 line-through text-muted-foreground">
                    Solicitud de taxi para huésped
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Se coordinó el servicio de taxi para el huésped.</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">SG</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">Sandra Gómez</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Reabrir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
