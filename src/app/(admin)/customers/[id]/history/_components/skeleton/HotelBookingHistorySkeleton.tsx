import { CalendarDays, CreditCard, Filter, Key, LayoutGrid, Moon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HotelBookingHistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Stays Skeleton */}
        <Card className="relative overflow-hidden">
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
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-1.5 w-full mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>

        {/* Total Nights Skeleton */}
        <Card className="relative overflow-hidden">
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
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-1.5 w-full mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>

        {/* Total Spent Skeleton */}
        <Card className="relative overflow-hidden">
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
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-1.5 w-full mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="relative">
        <Card className="border">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  disabled
                  placeholder="Buscar por número de habitación, tipo o solicitudes especiales..."
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" disabled>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-[180px]" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="border-l pl-4">
            <Tabs defaultValue="cards" className="w-full">
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

      {/* Cards View Skeleton */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generate 6 skeleton cards */}
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden border p-0">
                {/* Status indicator */}
                <div className="h-1 w-full bg-slate-200" />

                {/* Card Header */}
                <div className="p-5 pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="rounded-full w-12 h-12" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>

                <Separator />

                {/* Fechas */}
                <div className="p-5 pt-3 pb-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="px-5 pb-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex gap-1">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pie de tarjeta */}
                <div className="p-3 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Timeline View Skeleton (Hidden by default) */}
      <div className="hidden">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-10">
              {/* Year header */}
              <div className="relative">
                <div className="sticky top-0 z-10 bg-white py-2 mb-6">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-16 mr-3" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Separator className="mt-2" />
                </div>

                <div className="space-y-6">
                  {/* Timeline items */}
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="relative">
                        <div className="relative border-l-2 border-slate-200 pl-6 ml-2">
                          <div
                            className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300"
                            aria-hidden="true"
                          />

                          <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Skeleton className="h-6 w-48 mb-1" />
                                  <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                              </div>
                            </CardHeader>

                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Skeleton className="h-4 w-20 mb-1" />
                                  <Skeleton className="h-5 w-8" />
                                </div>
                                <div>
                                  <Skeleton className="h-4 w-28 mb-1" />
                                  <Skeleton className="h-5 w-32" />
                                </div>
                                <div>
                                  <Skeleton className="h-4 w-12 mb-1" />
                                  <Skeleton className="h-5 w-20" />
                                </div>
                                <div>
                                  <Skeleton className="h-4 w-16 mb-1" />
                                  <Skeleton className="h-5 w-36" />
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t">
                                <Skeleton className="h-4 w-28 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4 mt-1" />
                              </div>
                            </CardContent>

                            <div className="p-4 flex justify-end bg-gradient-to-r from-white to-slate-50">
                              <Skeleton className="h-9 w-28 rounded-md" />
                            </div>
                          </Card>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Skeleton (Alternative) */}
      <div className="hidden mt-6">
        <div className="col-span-full flex items-center justify-center h-64">
          <div className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-5 w-64 mx-auto mb-4" />
            <Skeleton className="h-9 w-32 rounded-md mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
