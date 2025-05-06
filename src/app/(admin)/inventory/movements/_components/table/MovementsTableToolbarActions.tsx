"use client";

import { type Table } from "@tanstack/react-table";

import { MovementsType, SummaryMovements } from "../../_types/movements";
import { CreateMovementsDialog } from "../create/CreateMovementsDialog";

export interface MovementsTableToolbarActionsProps {
  table?: Table<SummaryMovements>;
  exportFile?: boolean;
  type: MovementsType;
}

export function MovementsTableToolbarActions({ table, type }: MovementsTableToolbarActionsProps) {
  /*   const [showWarehouseStockDialog, setShowWarehouseStockDialog] = useState(false); */

  return (
    <div className="flex w-fit flex-wrap items-center gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
      {/*       <Button variant="outline" size="sm" onClick={() => setShowWarehouseStockDialog(true)}>
        <Warehouse className="mr-2 size-4" aria-hidden="true" />
        Ver Almacén
      </Button> */}
      {/*       {showWarehouseStockDialog && (
        <WarehouseStockDialog
          projectName={projectName}
          id={id}
          open={showWarehouseStockDialog}
          setOpen={setShowWarehouseStockDialog}
        />
      )} */}
      <CreateMovementsDialog type={type} />
    </div>
  );
}
