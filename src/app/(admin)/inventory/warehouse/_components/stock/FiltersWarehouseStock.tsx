import { ArrowUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface FiltersWarehouseStockProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setSortBy: (sortBy: string) => void;
}

export default function FiltersWarehouseStock({ searchTerm, setSearchTerm, setSortBy }: FiltersWarehouseStockProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-6">
      <div className="relative flex-1 w-full items-center">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar productos..."
          className="pl-10 py-5 rounded-xl border-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="flex gap-2 whitespace-nowrap rounded-xl">
            <ArrowUpDown className="h-4 w-4" />
            Ordenar por
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy("name")}>Nombre</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("quantity-asc")}>Cantidad (Menor a Mayor)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("quantity-desc")}>Cantidad (Mayor a Menor)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("value-asc")}>Valor (Menor a Mayor)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("value-desc")}>Valor (Mayor a Menor)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
