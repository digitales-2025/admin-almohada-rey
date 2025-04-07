"use client";

import { useCallback, useState } from "react";

import { useCustomers } from "@/app/(admin)/customers/_hooks/use-customers";
import { ApiCustomer } from "@/app/(admin)/customers/_types/customer";
// import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { RTKUseQueryHookResult, SearchCombobox } from "@/components/form/RemoteSearchCombobox";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";

type SearchOrderComoBoxProps = {
  onValueChange: (value: string, entity?: unknown) => void;
  defaultValue?: string;
};

type ComboboxItem<T> = {
  value: string;
  label: string;
  entity: T;
};

export function SearchCustomerCombobox({ onValueChange, defaultValue }: SearchOrderComoBoxProps) {
  const DefaultSearchValue = "None"; //IMPORTANT: This value is used to SEND a request to the backend when the search input is empty
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("Buscar Cliente por Nro. de Documento");
  // const [entity, setEntity] = useState<T | null>(null);
  const [search, setSearch] = useState(DefaultSearchValue);

  const { searchQuery } = useCustomers({ search: search });

  const { data, isLoading, isError, error, refetch } = searchQuery;

  const mapToComboboxItem = useCallback((customer: ApiCustomer): ComboboxItem<ApiCustomer> => {
    const documenTypeTranlation = customer?.documentType
      ? documentTypeStatusConfig[customer.documentType].name
      : "Sin tipo";
    const documentString = `${documenTypeTranlation ?? "Sin tipo"}: ${customer?.documentNumber ?? "Sin documento"}`;
    const label = `${customer?.name ?? "Sin nombre"} - ${documentString}`;
    return {
      value: customer.documentNumber ?? "None",
      label: label,
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
      className="max-w-90"
      items={data ? mapToComboboxItems(data) : []}
      value={value}
      label={label}
      onSelect={(value, label, entity) => {
        setValue(value ?? DefaultSearchValue); //antes estaba ''
        setLabel(label ?? DefaultSearchValue); //antes estaba ''
        onValueChange(value, entity);
      }}
      onSearchChange={(val) => setSearch(val === "" ? DefaultSearchValue : val)} // set search to "None" if empty string
      // regexInput={/^[0-9]*$/} // only allow numbers
      searchPlaceholder="Busca por Nro. de Identidad..."
      noResultsMsg="No se encontro resultados"
      selectItemMsg="Selecciona una cliente"
    />
  );
}
