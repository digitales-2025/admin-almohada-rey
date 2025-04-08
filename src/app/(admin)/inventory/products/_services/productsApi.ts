import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Product, ProductType } from "../_types/products";

interface GetProductsByTypeProps {
  type: ProductType;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product"],
  endpoints: (build) => ({
    //Crear productos
    createProduct: build.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Actualizar productos
    updateProduct: build.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Obtener producto por id
    getProductById: build.query<Product, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    //Obtener todos los productos
    getAllProducts: build.query<Product[], void>({
      query: () => ({
        url: "/product",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),
    //Obtener productos por tipo
    getProductsByType: build.query<Product[], GetProductsByTypeProps>({
      query: ({ type }) => ({
        url: `/product/all/type/${type}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),

    //Eliminar productos
    deleteProducts: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/product/remove/all`,
        method: "DELETE",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
    //Activar productos
    reactivateProducts: build.mutation<void, { ids: string[] }>({
      query: (ids) => ({
        url: `/product/reactivate/all`,
        method: "PATCH",
        body: ids,
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetProductsByTypeQuery,
  useDeleteProductsMutation,
  useReactivateProductsMutation,
} = productsApi;
