"use client";

import { useCallback, useState } from "react";

import { useCustomers } from "@/app/(admin)/customers/_hooks/use-customers";
import { ApiCustomer } from "@/app/(admin)/customers/_types/customer";
import {
  createCustomerComboboxLabel,
  createCustomerComboboxLabelString,
} from "@/app/(admin)/customers/_utils/customers.filter.utils";
// import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { RTKUseQueryHookResult, SearchCombobox } from "@/components/form/RemoteSearchCombobox";
import { cn } from "@/lib/utils";
import { CreateCustomersReservationsSheet } from "../create-customers/CreateCustomersReservationsSheet";

type SearchOrderComoBoxProps = {
  onValueChange: (value: string, entity?: unknown) => void;
  defaultValue?: string;
  className?: string;
  notFoundAction?: boolean;
};

type ComboboxItem<T> = {
  value: string;
  label: string | React.ReactNode;
  entity: T;
};

export function SearchCustomerCombobox({
  onValueChange,
  defaultValue,
  className,
  notFoundAction,
}: SearchOrderComoBoxProps) {
  const DefaultSearchValue = "None"; //IMPORTANT: This value is used to SEND a request to the backend when the search input is empty
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState<string | React.ReactNode>("Buscar Cliente por Nro. de Documento");
  // const [entity, setEntity] = useState<T | null>(null);
  const [search, setSearch] = useState(DefaultSearchValue);

  const { searchQuery } = useCustomers({ search: search });

  const { data, isLoading, isError, error, refetch } = searchQuery;

  const mapToComboboxItem = useCallback((customer: ApiCustomer): ComboboxItem<ApiCustomer> => {
    return {
      value: customer.documentNumber ?? "None",
      label: createCustomerComboboxLabel(customer),
      entity: customer,
    };
  }, []);

  const mapToComboboxItems = useCallback(
    (customers: ApiCustomer[]) =>
      customers.map((customer) => {
        // if (!customer) return undefined;
        return mapToComboboxItem(customer);
      }),
    [mapToComboboxItem]
  );

  const queryStateData: RTKUseQueryHookResult<ApiCustomer[], Error> = {
    data: data ?? [],
    isLoading,
    isLoadingError: isError,
    isError,
    error: error instanceof Error ? error : new Error("Ocurrio un error desconocido"),
    refetch,
  };

  return (
    <SearchCombobox<ApiCustomer>
      queryState={queryStateData}
      className={cn(className || "max-w-90")}
      items={data ? mapToComboboxItems(data) : []}
      value={value}
      label={label}
      onSelect={(value, label, entity) => {
        setValue(value ?? DefaultSearchValue);
        // Si el entity es un ApiCustomer, generar un string o ReactNode para el botón
        const labelToSet: string | React.ReactNode =
          entity && typeof entity === "object" && "documentNumber" in entity
            ? createCustomerComboboxLabelString(entity as ApiCustomer)
            : typeof label === "string"
              ? label
              : DefaultSearchValue;
        setLabel(labelToSet);
        onValueChange(value, entity);
      }}
      onSearchChange={(val) => setSearch(val === "" ? DefaultSearchValue : val)} // set search to "None" if empty string
      // regexInput={/^[0-9]*$/} // only allow numbers
      searchPlaceholder="Busca por Nro. de Identidad..."
      noResultsMsg="No se encontro resultados"
      selectItemMsg="Selecciona una cliente"
      notFoundAction={notFoundAction ? <CreateCustomersReservationsSheet refetch={refetch} /> : undefined}
    />
  );
}
