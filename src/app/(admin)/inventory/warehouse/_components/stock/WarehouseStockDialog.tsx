"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Hotel } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useWarehouse } from "../../_hooks/use-warehouse";
import { WarehouseType } from "../../_types/warehouse";
import { getMinStockThreshold } from "../../_utils/warehouses.utils";
import FiltersWarehouseStock from "./FiltersWarehouseStock";
import StatisticsWarehouseStock from "./StatisticsWarehouseStock";
import WarehouseStockTabsContent from "./WarehouseStockTabsContent";

interface WarehouseStockDialogProps extends Omit<React.ComponentPropsWithRef<typeof Dialog>, "open" | "onOpenChange"> {
  id: string;
  open: boolean;
  currentWarehouseType: WarehouseType;
  setOpen: (open: boolean) => void;
}

export function WarehouseStockDialog({ id, open, setOpen, currentWarehouseType }: WarehouseStockDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [animateItems, setAnimateItems] = useState(false);

  const { warehouseById } = useWarehouse({ id });

  // Efecto para animar elementos al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => setAnimateItems(true), 100);
    } else {
      setAnimateItems(false);
    }
  }, [open]);

  // Filtrar items basados en búsqueda y pestaña activa
  const filteredItems = warehouseById?.stock.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.product.code ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const threshold = getMinStockThreshold(currentWarehouseType);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low") return matchesSearch && item.quantity < threshold;
    if (activeTab === "high") return matchesSearch && item.quantity >= threshold;

    return matchesSearch;
  });

  // Ordenar items
  const sortedItems = [...(filteredItems ?? [])].sort((a, b) => {
    if (sortBy === "name") return a.product.name.localeCompare(b.product.name);
    if (sortBy === "quantity-asc") return a.quantity - b.quantity;
    if (sortBy === "quantity-desc") return b.quantity - a.quantity;
    if (sortBy === "value-asc") return a.totalCost - b.totalCost;
    if (sortBy === "value-desc") return b.totalCost - a.totalCost;
    return 0;
  });

  const totalItems = warehouseById?.stock.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalValue = warehouseById?.stock.reduce((sum, item) => sum + item.totalCost, 0) || 0;
  const lowStockItems =
    warehouseById?.stock.filter((item) => item.quantity < getMinStockThreshold(currentWarehouseType)).length ?? 0;

  // Contenido común para ambos componentes
  const renderContent = () => (
    <>
      {/* Panel de Estadísticas */}
      <StatisticsWarehouseStock
        animateItems={animateItems}
        lowStockItems={lowStockItems}
        totalItems={totalItems}
        totalValue={totalValue}
      />

      {/* Búsqueda y Filtros */}
      <FiltersWarehouseStock searchTerm={searchTerm} setSearchTerm={setSearchTerm} setSortBy={setSortBy} />

      {/* Pestañas */}
      <WarehouseStockTabsContent
        animateItems={animateItems}
        currentWarehouseType={currentWarehouseType}
        setActiveTab={setActiveTab}
        sortedItems={sortedItems}
      />
    </>
  );

  // Header común para ambos componentes
  const renderHeader = () => (
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
        <Hotel className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xl font-semibold">Inventario del Hotel</div>
        <div className="text-sm text-muted-foreground">
          {currentWarehouseType === WarehouseType.COMMERCIAL
            ? "Productos comerciales para venta a huéspedes"
            : currentWarehouseType === WarehouseType.DEPOSIT
              ? "Productos de depósito controlados por administradores"
              : "Productos de uso interno para operaciones del hotel"}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] px-0">
          <DialogHeader className="flex flex-row items-center justify-between px-4">
            <DialogTitle className="text-xl">{renderHeader()}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80vh] max-h-[82vh] px-0">
            <div className="px-6">{renderContent()}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{renderHeader()}</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="px-4 pb-4 h-[55vh]">{renderContent()}</ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
