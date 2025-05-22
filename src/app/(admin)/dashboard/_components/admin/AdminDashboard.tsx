"use client";

import { useState } from "react";
import { BarChart3, Calendar, Globe, Home, PieChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import { CustomerOriginStats } from "./CustomerOriginStats";
import { CustomerOriginTrends } from "./CustomerOriginTrends";
import { InternationalCustomersChart } from "./InternationalCustomersChart";
import { NationalCustomersChart } from "./NationalCustomersChart";
import OccupancyTabsContentDashboard from "./occupancy/OccupancyTabsContentDashboard";
import ReservationTabsContentDashboard from "./reservation/ReservationTabsContentDashboard";
import { ReservationsByOriginChart } from "./ReservationsByOriginChart";
import SummaryTabsContentDashoard from "./summary/SummaryTabsContentDashboard";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [year, setYear] = useState(new Date().getFullYear() as number);
  const [yearReservation, setYearReservation] = useState(new Date().getFullYear() as number);
  const [originTimeframe, setOriginTimeframe] = useState("este-mes");

  const { annualStatistics, monthlyEarningsExpenses, occupancyStatisticsPercentage } = useDashboard({
    year,
  });

  const { monthlyBookingTrend } = useDashboard({
    yearReservation,
  });

  const { nextPendingPayments, recentReservations, roomOccupancy } = useDashboard();

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative grid grid-cols-3 md:grid-cols-5 w-full h-fit border-0 z-10">
          <TabsTrigger
            value="resumen"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80
            data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Resumen</span>
          </TabsTrigger>

          <TabsTrigger
            value="ocupacion"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg 
             data-[state=active]:text-primary/80
            data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <BarChart3 className="h-4 w-4" />

            <span className="hidden sm:inline font-medium">Ocupación</span>
          </TabsTrigger>

          <TabsTrigger
            value="reservas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg 
             data-[state=active]:text-primary/80
            data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Calendar className="h-4 w-4" />

            <span className="hidden sm:inline font-medium">Reservas</span>
          </TabsTrigger>

          <TabsTrigger
            value="finanzas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg 
             data-[state=active]:text-primary/80
            data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <PieChart className="h-4 w-4" />

            <span className="hidden sm:inline font-medium">Finanzas</span>
          </TabsTrigger>

          <TabsTrigger
            value="procedencia"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg 
             data-[state=active]:text-primary/80
            data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Globe className="h-4 w-4" />

            <span className="hidden sm:inline font-medium">Procedencia</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Resumen */}
        <SummaryTabsContentDashoard
          annualStatistics={annualStatistics}
          monthlyEarningsExpenses={monthlyEarningsExpenses}
          nextPendingPayments={nextPendingPayments}
          recentReservations={recentReservations}
          roomOccupancy={roomOccupancy}
          setYear={setYear}
          year={year}
        />

        {/* Pestaña de Ocupación */}
        <OccupancyTabsContentDashboard
          roomOccupancy={roomOccupancy}
          occupancyStatisticsPercentage={occupancyStatisticsPercentage}
          setYear={setYear}
          year={year}
        />

        {/* Pestaña de Reservas */}
        <ReservationTabsContentDashboard
          year={yearReservation}
          setYear={setYearReservation}
          monthlyBookingTrend={monthlyBookingTrend}
        />

        {/* Pestaña de Finanzas */}
        <TabsContent value="finanzas" className="space-y-4 px-6">
          {/* Contenido existente de la pestaña Finanzas */}
          <Card>
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
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Gastos Totales</h3>
                    <div className="text-3xl font-bold text-red-600">S/ 87,320.00</div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Beneficio Neto</h3>
                    <div className="text-3xl font-bold text-blue-600">S/ 65,130.00</div>
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

        {/* Pestaña de Procedencia */}
        <TabsContent value="procedencia" className="space-y-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div></div>
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
          <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Huéspedes Nacionales por Departamento</CardTitle>
                <CardDescription>Top 10 departamentos de origen</CardDescription>
              </CardHeader>
              <CardContent>
                <NationalCustomersChart />
              </CardContent>
            </Card>

            {/* Huéspedes Internacionales por País */}
            <Card>
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
          <Card>
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
