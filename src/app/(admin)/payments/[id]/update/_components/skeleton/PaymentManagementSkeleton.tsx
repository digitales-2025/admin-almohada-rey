"use client";

import { BarChart3, CreditCard, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaymentManagementSkeleton() {
  return (
    <div>
      <Card className="overflow-hidden border-primary/20 bg-card dark:border-primary/10">
        <Tabs defaultValue="general" className="w-full">
          <div className="px-6">
            <TabsList className="w-full justify-start gap-2 rounded-none bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="flex h-12 items-center gap-2 rounded-none border-b-2 border-primary bg-transparent px-4 text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <FileText className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>

              <TabsTrigger
                value="details"
                className="flex h-12 items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <CreditCard className="h-4 w-4" />
                <span>Detalles de Pago</span>
              </TabsTrigger>

              <TabsTrigger
                value="summary"
                className="flex h-12 items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Resumen</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="general" className="m-0 border-none p-0">
              {/* General tab content skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-12 mt-2">
                {/* Left sidebar skeleton */}
                <div className="relative lg:border-border px-6 py-3 lg:col-span-4 lg:border-r">
                  <div className="sticky space-y-8">
                    {/* Payment info section skeleton */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Información del Pago
                      </h3>

                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
                          <div className="border-b border-border/50 bg-muted/50 px-4 py-2 dark:bg-muted/20">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                          </div>
                          <div className="px-4 py-3">
                            <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
                          <div className="border-b border-border/50 bg-muted/50 px-4 py-2 dark:bg-muted/20">
                            <div className="h-4 w-36 animate-pulse rounded bg-muted"></div>
                          </div>
                          <div className="px-4 py-3">
                            <div className="h-5 w-40 animate-pulse rounded bg-muted"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reservation info section skeleton */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="h-4 w-4 animate-pulse rounded bg-primary"></div>
                        Información de Reserva
                      </h3>

                      <div className="rounded-lg border border-primary/20 bg-card p-4 dark:border-primary/10 space-y-4">
                        <div className="space-y-4">
                          {/* Cliente skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/30"></div>
                            </div>
                            <div>
                              <div className="h-3 w-16 animate-pulse rounded bg-muted mb-1"></div>
                              <div className="h-4 w-28 animate-pulse rounded bg-muted"></div>
                            </div>
                          </div>

                          <Separator className="bg-border/50" />

                          {/* Check-in skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/30"></div>
                            </div>
                            <div>
                              <div className="h-3 w-16 animate-pulse rounded bg-muted mb-1"></div>
                              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                            </div>
                          </div>

                          <Separator className="bg-border/50" />

                          {/* Check-out skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/30"></div>
                            </div>
                            <div>
                              <div className="h-3 w-16 animate-pulse rounded bg-muted mb-1"></div>
                              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right content area skeleton */}
                <div className="lg:col-span-8">
                  <div className="h-full flex-col p-6">
                    <div className="mb-6">
                      <div className="h-7 w-40 animate-pulse rounded bg-muted mb-2"></div>
                      <div className="h-4 w-64 animate-pulse rounded bg-muted"></div>
                    </div>

                    <div className="relative flex-1">
                      <div className="h-[250px] w-full animate-pulse rounded-md bg-muted/50 border border-border/50"></div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <div className="h-10 w-40 animate-pulse rounded bg-primary/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="m-0 border-none p-6">
              {/* Details tab content skeleton */}
              <div className="space-y-4">
                <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg border border-border/50 p-4 space-y-3">
                      <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
                      <Separator className="bg-border/50" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="m-0 border-none p-6">
              {/* Summary tab content skeleton */}
              <div className="space-y-6">
                <div className="h-6 w-36 animate-pulse rounded bg-muted"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border border-border/50 p-4 space-y-4">
                    <div className="h-5 w-28 animate-pulse rounded bg-muted"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                          <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                        </div>
                      ))}
                    </div>
                    <Separator className="bg-border/50" />
                    <div className="flex justify-between">
                      <div className="h-5 w-20 animate-pulse rounded bg-muted"></div>
                      <div className="h-5 w-20 animate-pulse rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 h-48 flex items-center justify-center">
                    <div className="h-32 w-32 animate-pulse rounded-full bg-muted"></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
