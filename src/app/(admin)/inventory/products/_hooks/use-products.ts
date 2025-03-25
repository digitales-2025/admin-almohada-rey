import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateProductMutation,
  useDeleteProductsMutation,
  useGetAllProductsQuery,
  useReactivateProductsMutation,
  useUpdateProductMutation,
} from "../_services/productsApi";
import { Product } from "../_types/products";

export const useProducts = () => {
  const { data: dataProductsAll, error, isLoading, isSuccess, refetch } = useGetAllProductsQuery();

  const [createProduct, { isSuccess: isSuccessCreateProduct }] = useCreateProductMutation();

  const [updateProduct, { isSuccess: isSuccessUpdateProduct, isLoading: isLoadingUpdateProduct }] =
    useUpdateProductMutation();

  const [deleteProducts, { isSuccess: isSuccessDeleteProducts }] = useDeleteProductsMutation();

  const [reactivateProducts, { isSuccess: isSuccessReactivateProducts, isLoading: isLoadingReactivateProducts }] =
    useReactivateProductsMutation();

  async function onCreateProduct(input: Partial<Product>) {
    const promise = runAndHandleError(() => createProduct(input).unwrap());
    toast.promise(promise, {
      loading: "Creando producto...",
      success: "Producto creado con éxito",
      error: (err) => err.message,
    });
    return await promise;
  }

  async function onUpdateProduct(input: Partial<Product> & { id: string }) {
    const promise = runAndHandleError(() => updateProduct(input).unwrap());
    toast.promise(promise, {
      loading: "Actualizando producto...",
      success: "Producto actualizado exitosamente",
      error: (error) => {
        return error.message;
      },
    });
    return await promise;
  }

  const onDeleteProducts = async (ids: Product[]) => {
    const onlyIds = ids.map((product) => product.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => deleteProducts(idsString).unwrap());

    toast.promise(promise, {
      loading: "Eliminando...",
      success: "Productos eliminados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  const onReactivateProducts = async (ids: Product[]) => {
    const onlyIds = ids.map((product) => product.id);
    const idsString = {
      ids: onlyIds,
    };
    const promise = runAndHandleError(() => reactivateProducts(idsString).unwrap());

    toast.promise(promise, {
      loading: "Reactivando...",
      success: "Productos reactivados con éxito",
      error: (err) => err.message,
    });
    return await promise;
  };

  return {
    dataProductsAll,
    error,
    isLoading,
    isSuccess,
    refetch,
    onCreateProduct,
    isSuccessCreateProduct,
    onUpdateProduct,
    isSuccessUpdateProduct,
    isLoadingUpdateProduct,
    onDeleteProducts,
    isSuccessDeleteProducts,
    onReactivateProducts,
    isSuccessReactivateProducts,
    isLoadingReactivateProducts,
  };
};
