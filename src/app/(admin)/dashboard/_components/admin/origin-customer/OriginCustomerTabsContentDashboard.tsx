import { createPortal } from "react-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { TabsContent } from "@/components/ui/tabs";
import { CustomerOriginSummary, MonthlyCustomerOrigin, Top10CountriesProvinces } from "../../../_types/dashboard";
import { CustomerOriginStats } from "./CustomerOriginStats";
import { InternationalCustomersChart } from "./InternationalCustomersChart";
import { NationalCustomersChart } from "./NationalCustomersChart";
import NationalInternationalDistribution from "./NationalInternationalDistribution";

interface OriginCustomerTabsContentDashboardProps {
  year: number;
  setYear: (year: number) => void;
  customerOriginSummary: CustomerOriginSummary | undefined;
  monthlyCustomerOrigin: MonthlyCustomerOrigin[] | undefined;
  top10CountriesCustomers: Top10CountriesProvinces[] | undefined;
  top10ProvincesCustomers: Top10CountriesProvinces[] | undefined;
}

export default function OriginCustomerTabsContentDashboard({
  year,
  setYear,
  customerOriginSummary,
  monthlyCustomerOrigin,
  top10CountriesCustomers,
  top10ProvincesCustomers,
}: OriginCustomerTabsContentDashboardProps) {
  const element = document.getElementById("headerContent");
  return (
    <TabsContent value="procedencia" className="space-y-4 px-6">
      {element &&
        createPortal(
          <div id="headerContent">
            <FilterYear selectedYear={year} onSelectYear={setYear} />
          </div>,
          element
        )}

      {/* Tarjetas de estadísticas */}
      <CustomerOriginStats customerOriginSummary={customerOriginSummary} />

      {/* Distribución Nacional vs Internacional */}
      <NationalInternationalDistribution
        customerOriginSummary={customerOriginSummary}
        monthlyCustomerOrigin={monthlyCustomerOrigin}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Huéspedes Nacionales por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Huéspedes Nacionales por Departamento</CardTitle>
            <CardDescription>Top 10 departamentos de origen</CardDescription>
          </CardHeader>
          <CardContent>
            <NationalCustomersChart top10ProvincesCustomers={top10ProvincesCustomers} />
          </CardContent>
        </Card>

        {/* Huéspedes Internacionales por País */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Huéspedes Internacionales por País</CardTitle>
            <CardDescription>Top 10 países de origen</CardDescription>
          </CardHeader>
          <CardContent>
            <InternationalCustomersChart top10CountriesCustomers={top10CountriesCustomers} />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
