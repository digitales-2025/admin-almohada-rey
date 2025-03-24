import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { Product } from "../_types/products";

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
    getCProductById: build.query<Product, string>({
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
  useGetCProductByIdQuery,
  useGetAllProductsQuery,
  useDeleteProductsMutation,
  useReactivateProductsMutation,
} = productsApi;
