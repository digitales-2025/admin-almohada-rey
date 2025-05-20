import { Globe, MapPin, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function CustomerOriginStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Huéspedes</p>
              <div className="text-2xl font-bold">1,248</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Huéspedes Nacionales</p>
              <div className="text-2xl font-bold">812</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 font-medium">65%</span>
                <span className="text-xs text-muted-foreground ml-1">del total</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Huéspedes Internacionales</p>
              <div className="text-2xl font-bold">436</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-500 font-medium">35%</span>
                <span className="text-xs text-muted-foreground ml-1">del total</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Globe className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Países Representados</p>
              <div className="text-2xl font-bold">28</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
