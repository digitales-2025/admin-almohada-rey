"use client";

import {
  ArrowDown,
  ArrowUp,
  Building,
  Clock,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { NumberCounter } from "@/components/ui/number-counter";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { SummaryFinance } from "../../../_types/dashboard";

interface FinanceTabsContentDashboardProps {
  year: number;
  setYear: (year: number) => void;
  annualSummaryFinance: SummaryFinance | undefined;
}

export default function FinanceTabsContentDashboard({
  year,
  setYear,
  annualSummaryFinance,
}: FinanceTabsContentDashboardProps) {
  const element = document.getElementById("headerContent");

  // Si no hay datos, mostrar valores en cero
  const financeSummary = annualSummaryFinance || {
    totalIncome: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalRoomReservations: 0,
    totalServices: 0,
    totalProducts: 0,
    totalLateCheckout: 0,
    totalExpensesFixed: 0,
    totalExpensesVariable: 0,
    totalExpensesOther: 0,
    totalExpensesProducts: 0,
  };

  // Calcular porcentajes para el desglose de ingresos
  const totalIncome = financeSummary.totalIncome || 0;
  const roomsPercentage = totalIncome ? Math.round((financeSummary.totalRoomReservations / totalIncome) * 100) : 0;
  const servicesPercentage = totalIncome ? Math.round((financeSummary.totalServices / totalIncome) * 100) : 0;
  const productsPercentage = totalIncome ? Math.round((financeSummary.totalProducts / totalIncome) * 100) : 0;
  const lateCheckoutPercentage = totalIncome ? Math.round((financeSummary.totalLateCheckout / totalIncome) * 100) : 0;

  // Calcular porcentajes para el desglose de gastos
  const totalExpenses = financeSummary.totalExpenses || 0;
  const fixedExpensesPercentage = totalExpenses
    ? Math.round((financeSummary.totalExpensesFixed / totalExpenses) * 100)
    : 0;
  const variableExpensesPercentage = totalExpenses
    ? Math.round((financeSummary.totalExpensesVariable / totalExpenses) * 100)
    : 0;
  const productsExpensesPercentage = totalExpenses
    ? Math.round((financeSummary.totalExpensesProducts / totalExpenses) * 100)
    : 0;
  const otherExpensesPercentage = totalExpenses
    ? Math.round((financeSummary.totalExpensesOther / totalExpenses) * 100)
    : 0;

  // Calcular margen de beneficio
  const profitMargin = totalIncome ? Math.round((financeSummary.totalProfit / totalIncome) * 100) : 0;

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Datos para el gráfico de ingresos (filtrar valores en cero)
  const incomeData = [
    { name: "Habitaciones", value: financeSummary.totalRoomReservations, color: "#4f46e5" },
    { name: "Servicios", value: financeSummary.totalServices, color: "#0ea5e9" },
    { name: "Productos", value: financeSummary.totalProducts, color: "#10b981" },
    { name: "Late Checkout", value: financeSummary.totalLateCheckout, color: "#f59e0b" },
  ].filter((item) => item.value > 0); // Filtrar elementos con valor cero

  // Datos para el gráfico de gastos (filtrar valores en cero)
  const expensesData = [
    { name: "Fijos", value: financeSummary.totalExpensesFixed, color: "#ef4444" },
    { name: "Variables", value: financeSummary.totalExpensesVariable, color: "#f97316" },
    { name: "Productos", value: financeSummary.totalExpensesProducts, color: "#8b5cf6" },
    { name: "Otros", value: financeSummary.totalExpensesOther, color: "#ec4899" },
  ].filter((item) => item.value > 0); // Filtrar elementos con valor cero

  return (
    <TabsContent value="finanzas" className="space-y-6 px-6">
      {element &&
        createPortal(
          <div id="headerContent">
            <FilterYear selectedYear={year} onSelectYear={setYear} />
          </div>,
          element
        )}

      {/* Tarjetas de resumen principal */}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Ingresos Totales</span>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardTitle>
            <CardDescription>Año fiscal {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <NumberCounter
              value={financeSummary.totalIncome}
              formatter={(val) => formatCurrency(val)}
              className="text-3xl font-bold text-green-600"
            />
            <div className="mt-2 flex items-center text-sm">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+{roomsPercentage}%</span>
              <span className="text-muted-foreground ml-1">desde habitaciones</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Gastos Totales</span>
              <CreditCard className="h-5 w-5 text-red-500" />
            </CardTitle>
            <CardDescription>Año fiscal {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <NumberCounter
              value={financeSummary.totalExpenses}
              formatter={(val) => formatCurrency(val)}
              className="text-3xl font-bold text-red-600"
            />
            <div className="mt-2 flex items-center text-sm">
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">+{fixedExpensesPercentage}%</span>
              <span className="text-muted-foreground ml-1">en gastos fijos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Beneficio Neto</span>
              <Building className="h-5 w-5 text-blue-500" />
            </CardTitle>
            <CardDescription>Año fiscal {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <NumberCounter
              value={financeSummary.totalProfit}
              formatter={(val) => formatCurrency(val)}
              className="text-3xl font-bold text-blue-600"
            />
            <div className="mt-2 flex items-center text-sm">
              <span className="font-medium">Margen de beneficio:</span>
              <span className="text-blue-500 font-medium ml-1">{profitMargin}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desglose de ingresos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Desglose de Ingresos</CardTitle>
          <CardDescription>Análisis detallado de fuentes de ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Habitaciones</div>
                    <div className="text-sm text-muted-foreground">{roomsPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalRoomReservations)}</div>
              </div>
              <Progress value={roomsPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-indigo-600" />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-sky-600" />
                  <div>
                    <div className="font-medium">Servicios</div>
                    <div className="text-sm text-muted-foreground">{servicesPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalServices)}</div>
              </div>
              <Progress value={servicesPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-sky-600" />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="font-medium">Productos</div>
                    <div className="text-sm text-muted-foreground">{productsPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalProducts)}</div>
              </div>
              <Progress value={productsPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-emerald-600" />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-600" />
                  <div>
                    <div className="font-medium">Late Checkout</div>
                    <div className="text-sm text-muted-foreground">{lateCheckoutPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalLateCheckout)}</div>
              </div>
              <Progress value={lateCheckoutPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-amber-600" />
            </div>

            <div className="h-80">
              {incomeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-center">No hay datos de ingresos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose de gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Desglose de Gastos</CardTitle>
          <CardDescription>Análisis detallado de categorías de gastos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="mr-2 h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium">Gastos Fijos</div>
                    <div className="text-sm text-muted-foreground">{fixedExpensesPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalExpensesFixed)}</div>
              </div>
              <Progress value={fixedExpensesPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-red-600" />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Gastos Variables</div>
                    <div className="text-sm text-muted-foreground">{variableExpensesPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalExpensesVariable)}</div>
              </div>
              <Progress
                value={variableExpensesPercentage}
                className="h-2 bg-slate-200"
                indicatorClassName="bg-orange-600"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Compra de Productos</div>
                    <div className="text-sm text-muted-foreground">{productsExpensesPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalExpensesProducts)}</div>
              </div>
              <Progress
                value={productsExpensesPercentage}
                className="h-2 bg-slate-200"
                indicatorClassName="bg-purple-600"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-pink-600" />
                  <div>
                    <div className="font-medium">Otros Gastos</div>
                    <div className="text-sm text-muted-foreground">{otherExpensesPercentage}% del total</div>
                  </div>
                </div>
                <div className="text-right font-medium">{formatCurrency(financeSummary.totalExpensesOther)}</div>
              </div>
              <Progress value={otherExpensesPercentage} className="h-2 bg-slate-200" indicatorClassName="bg-pink-600" />
            </div>

            <div className="h-80">
              {expensesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-center">No hay datos de gastos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores clave */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Indicadores Clave de Rendimiento</CardTitle>
          <CardDescription>Métricas importantes para la gestión financiera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Margen de Beneficio</div>
                <div
                  className={`text-sm font-medium ${profitMargin > 20 ? "text-green-500" : profitMargin > 10 ? "text-amber-500" : "text-red-500"}`}
                >
                  {profitMargin}%
                </div>
              </div>
              <div className="mt-3">
                <Progress
                  value={profitMargin}
                  max={50}
                  className="h-2 bg-slate-200"
                  indicatorClassName={
                    profitMargin > 20 ? "bg-green-500" : profitMargin > 10 ? "bg-amber-500" : "bg-red-500"
                  }
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {profitMargin > 20 ? "Excelente" : profitMargin > 10 ? "Aceptable" : "Necesita mejorar"}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Ratio Ingresos/Gastos</div>
                <div
                  className={`text-sm font-medium ${totalIncome / totalExpenses > 1.5 ? "text-green-500" : totalIncome / totalExpenses > 1.2 ? "text-amber-500" : "text-red-500"}`}
                >
                  {totalIncome && totalExpenses ? (totalIncome / totalExpenses).toFixed(2) : "0.00"}
                </div>
              </div>
              <div className="mt-3">
                <Progress
                  value={totalIncome && totalExpenses ? (totalIncome / totalExpenses) * 33.33 : 0}
                  max={100}
                  className="h-2 bg-slate-200"
                  indicatorClassName={
                    totalIncome / totalExpenses > 1.5
                      ? "bg-green-500"
                      : totalIncome / totalExpenses > 1.2
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {totalIncome / totalExpenses > 1.5
                  ? "Excelente"
                  : totalIncome / totalExpenses > 1.2
                    ? "Aceptable"
                    : "Necesita mejorar"}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Contribución de Habitaciones</div>
                <div
                  className={`text-sm font-medium ${roomsPercentage > 60 ? "text-green-500" : roomsPercentage > 40 ? "text-amber-500" : "text-red-500"}`}
                >
                  {roomsPercentage}%
                </div>
              </div>
              <div className="mt-3">
                <Progress
                  value={roomsPercentage}
                  max={100}
                  className="h-2 bg-slate-200"
                  indicatorClassName={
                    roomsPercentage > 60 ? "bg-green-500" : roomsPercentage > 40 ? "bg-amber-500" : "bg-red-500"
                  }
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {roomsPercentage > 60 ? "Excelente" : roomsPercentage > 40 ? "Aceptable" : "Diversificar ingresos"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
