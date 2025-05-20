"use client";

import { useState } from "react";
import { BedDouble, CreditCard, TrendingUp, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerOriginStats } from "./CustomerOriginStats";
import { CustomerOriginTrends } from "./CustomerOriginTrends";
import { InternationalCustomersChart } from "./InternationalCustomersChart";
import { NationalCustomersChart } from "./NationalCustomersChart";
import { OccupancyChart } from "./OccupancyChart";
import { RecentPayments } from "./RecentPayments";
import { RecentReservations } from "./RecentReservations";
import { ReservationsByOriginChart } from "./ReservationsByOriginChart";
import { ReservationTrends } from "./ReservationTrends";
import { RevenueChart } from "./RevenueChart";
import { RoomStatusByType } from "./RoomStatusByType";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [originTimeframe, setOriginTimeframe] = useState("este-mes");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel Administrativo</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, administrador</p>
        </div>
      </div>

      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="resumen" className="py-2">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="ocupacion" className="py-2">
            Ocupación
          </TabsTrigger>
          <TabsTrigger value="reservas" className="py-2">
            Reservas
          </TabsTrigger>
          <TabsTrigger value="finanzas" className="py-2">
            Finanzas
          </TabsTrigger>
          <TabsTrigger value="procedencia" className="py-2">
            Procedencia
          </TabsTrigger>
        </TabsList>

        {/* Contenido de las otras pestañas (resumen, ocupación, etc.) se mantiene igual */}

        {/* Pestaña de Resumen */}
        <TabsContent value="resumen" className="space-y-4">
          {/* Contenido existente de la pestaña Resumen */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 152,450.00</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <BedDouble className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+124</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 22,540.00</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-7 md:col-span-4 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Resumen de Ingresos</CardTitle>
                <CardDescription>Análisis de ingresos y gastos mensuales</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart />
              </CardContent>
            </Card>

            <Card className="col-span-7 md:col-span-3 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Estado de Habitaciones</CardTitle>
                <CardDescription>Distribución actual de habitaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <OccupancyChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-3 md:col-span-2 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Reservas Recientes</CardTitle>
                    <CardDescription>Tienes 12 nuevas reservas este mes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentReservations />
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-1 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Pagos Recientes</CardTitle>
                    <CardDescription>8 pagos recibidos este mes</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentPayments />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Ocupación */}
        <TabsContent value="ocupacion" className="space-y-4">
          {/* Contenido existente de la pestaña Ocupación */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-3 md:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Mapa de Ocupación</CardTitle>
                <CardDescription>Vista general de todas las habitaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <RoomStatusByType />
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-1 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Estadísticas de Ocupación</CardTitle>
                <CardDescription>Análisis por tipo de habitación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Habitaciones Estándar</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-blue-500 w-[75%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Habitaciones Deluxe</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Suites</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-purple-500 w-[60%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Suites Ejecutivas</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-amber-500 w-[90%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña de Reservas */}
        <TabsContent value="reservas" className="space-y-4">
          {/* Contenido existente de la pestaña Reservas */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Tendencias de Reservas</CardTitle>
              <CardDescription>Análisis de patrones de reserva por canal</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ReservationTrends />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Finanzas */}
        <TabsContent value="finanzas" className="space-y-4">
          {/* Contenido existente de la pestaña Finanzas */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Resumen Financiero</CardTitle>
              <CardDescription>Análisis detallado de ingresos y gastos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Ingresos Totales</h3>
                    <div className="text-3xl font-bold text-green-600">S/ 152,450.00</div>
                    <p className="text-sm text-muted-foreground">+15% vs. mismo periodo año anterior</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Gastos Totales</h3>
                    <div className="text-3xl font-bold text-red-600">S/ 87,320.00</div>
                    <p className="text-sm text-muted-foreground">+8% vs. mismo periodo año anterior</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Beneficio Neto</h3>
                    <div className="text-3xl font-bold text-blue-600">S/ 65,130.00</div>
                    <p className="text-sm text-muted-foreground">+22% vs. mismo periodo año anterior</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Desglose de Ingresos</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Habitaciones</div>
                      <div className="text-xl font-bold mt-1">S/ 98,750.00</div>
                      <div className="text-xs text-green-500">65% del total</div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Restaurante</div>
                      <div className="text-xl font-bold mt-1">S/ 32,450.00</div>
                      <div className="text-xs text-green-500">21% del total</div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Servicios</div>
                      <div className="text-xl font-bold mt-1">S/ 15,320.00</div>
                      <div className="text-xs text-green-500">10% del total</div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">Otros</div>
                      <div className="text-xl font-bold mt-1">S/ 5,930.00</div>
                      <div className="text-xs text-green-500">4% del total</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PESTAÑA DE PROCEDENCIA REDISEÑADA - VERSIÓN SIMPLIFICADA Y PRÁCTICA */}
        <TabsContent value="procedencia" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">Análisis de Procedencia</h2>
              <p className="text-muted-foreground">Distribución de huéspedes por origen</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={originTimeframe} onValueChange={setOriginTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="este-mes">Este mes</SelectItem>
                  <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                  <SelectItem value="este-año">Este año</SelectItem>
                  <SelectItem value="todo">Todo el tiempo</SelectItem>
                </SelectContent>
              </Select>
              <Button>Exportar</Button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <CustomerOriginStats />

          {/* Distribución Nacional vs Internacional */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Distribución Nacional vs Internacional</CardTitle>
              <CardDescription>Proporción de huéspedes nacionales e internacionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">Distribución de Huéspedes</h3>
                    <p className="text-sm text-muted-foreground">Total: 1,248 huéspedes</p>
                  </div>
                  <div className="w-full max-w-xs">
                    <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-l-full"
                        style={{ width: "65%" }}
                      ></div>
                      <div
                        className="absolute top-0 right-0 h-full bg-blue-500 rounded-r-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Nacionales (65%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Internacionales (35%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="text-sm text-muted-foreground">Huéspedes Nacionales</div>
                      <div className="text-2xl font-bold text-green-600">812</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="text-sm text-muted-foreground">Huéspedes Internacionales</div>
                      <div className="text-2xl font-bold text-blue-600">436</div>
                    </div>
                  </div>
                </div>
                <div>
                  <CustomerOriginTrends />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Huéspedes Nacionales por Departamento */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Huéspedes Nacionales por Departamento</CardTitle>
                <CardDescription>Top 10 departamentos de origen</CardDescription>
              </CardHeader>
              <CardContent>
                <NationalCustomersChart />
              </CardContent>
            </Card>

            {/* Huéspedes Internacionales por País */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Huéspedes Internacionales por País</CardTitle>
                <CardDescription>Top 10 países de origen</CardDescription>
              </CardHeader>
              <CardContent>
                <InternationalCustomersChart />
              </CardContent>
            </Card>
          </div>

          {/* Análisis de Reservas por Origen */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Análisis de Reservas por Origen</CardTitle>
              <CardDescription>
                Comparativa de duración de estancia, gasto promedio y tipo de habitación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationsByOriginChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
