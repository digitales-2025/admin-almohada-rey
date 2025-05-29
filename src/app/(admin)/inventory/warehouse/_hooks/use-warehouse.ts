import {
  PaginatedWarehouseParams,
  useGetAllWarehousesQuery,
  useGetPaginatedWarehousesQuery,
  useGetProductsStockByTypeQuery,
  useGetWarehouseByIdQuery,
  useGetWarehousesByTypeQuery,
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
