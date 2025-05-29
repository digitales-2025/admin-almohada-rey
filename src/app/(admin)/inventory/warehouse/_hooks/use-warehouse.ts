import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  PaginatedWarehouseParams,
  useGetAllWarehousesQuery,
  useGetPaginatedWarehousesQuery,
  useGetProductsStockByTypeQuery,
  useGetWarehouseByIdQuery,
  useGetWarehousesByTypeQuery,
  useLazyDownloadWarehouseStockExcelQuery,
} from "../_services/warehouseApi";
import { WarehouseType } from "../_types/warehouse";
import { ProductType } from "../../products/_types/products";

interface UseProductProps {
  type?: WarehouseType;
  typeStockProduct?: ProductType;
  id?: string;
  movementId?: string;
  paymentDetailId?: string;
}

export const useWarehouse = (options: UseProductProps = {}) => {
  const { type, id, typeStockProduct, movementId, paymentDetailId } = options;
  const { data: dataProductsAll, error, isLoading, isSuccess, refetch } = useGetAllWarehousesQuery();

  const { data: warehouseByType, refetch: refetchWarehouseByType } = useGetWarehousesByTypeQuery(
    {
      type: type as WarehouseType,
    },
    {
      skip: !type,
    }
  );

  const { data: productsStockByType, refetch: refetchProductsStockByType } = useGetProductsStockByTypeQuery(
    {
      type: typeStockProduct as ProductType,
      ...(paymentDetailId && { paymentDetailId }),
    },
    {
      skip: !typeStockProduct,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: warehouseById, refetch: refetchWarehouseById } = useGetWarehouseByIdQuery(
    {
      id: id as string,
      ...(movementId && { movementId }),
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  // Añadimos la función para descargar Excel
  const [downloadExcel, { isLoading: isDownloading }] = useLazyDownloadWarehouseStockExcelQuery();

  /**
   * Descarga el informe Excel del inventario del almacén y muestra feedback con toast
   * @param warehouseId - ID del almacén del cual se descargará el informe
   * @param warehouseCode - Código del almacén para el nombre del archivo (opcional)
   */
  async function downloadWarehouseExcel(warehouseId: string, warehouseCode?: string) {
    const promise = runAndHandleError(async () => {
      const response = await downloadExcel(warehouseId).unwrap();

      // Crear URL para descargar el blob
      const url = window.URL.createObjectURL(response);

      // Crear elemento <a> para descargar
      const link = document.createElement("a");
      const today = new Date().toISOString().split("T")[0];
      const fileName = `${warehouseCode || warehouseId}-${today}.xlsx`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Limpiar
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return fileName;
    });

    toast.promise(promise, {
      loading: "Descargando informe de inventario...",
      success: (fileName) => `Informe descargado: ${fileName}`,
      error: (err) => err.message,
    });

    return await promise;
  }

  return {
    dataProductsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    warehouseByType,
    refetchWarehouseByType,
    productsStockByType,
    refetchProductsStockByType,
    warehouseById,
    refetchWarehouseById,
    // Exportamos las funcionalidades de Excel
    downloadWarehouseExcel,
    isDownloading,
  };
};

interface UsePaginatedWarehouseProps {
  page?: number;
  pageSize?: number;
}

export const usePaginatedWarehouse = (options: UsePaginatedWarehouseProps = {}) => {
  const { page = 1, pageSize = 10 } = options;

  const paginationParams: PaginatedWarehouseParams = {
    pagination: { page, pageSize },
  };

  const {
    data: paginatedWarehouse,
    isLoading: isLoadingPaginatedWarehouse,
    refetch: refetchPaginatedWarehouse,
  } = useGetPaginatedWarehousesQuery(paginationParams, {
    refetchOnMountOrArgChange: true,
  });

  return {
    paginatedWarehouse,
    isLoadingPaginatedWarehouse,
    refetchPaginatedWarehouse,
  };
};
