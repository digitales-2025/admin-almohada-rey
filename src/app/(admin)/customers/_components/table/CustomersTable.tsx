"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { Customer } from "../../_types/customer";
import { facetedFilters } from "../../_utils/customers.filter.utils";
import { customersColumns } from "./CustomersTableColumns";
import { CustomersTableToolbarActions } from "./CustomersTableToolbarActions";

export function CustomersTable({ data }: { data: Customer[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => customersColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Customer>) => <CustomersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes..."
      facetedFilters={facetedFilters}
    />
  );
}
