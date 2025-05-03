import { createApi } from "@reduxjs/toolkit/query/react";

import { PaginatedResponse } from "@/types/api/paginated-response";
import { BaseApiResponse } from "@/types/api/types";
import { PaginatedQueryParams } from "@/types/query-filters/generic-paginated-query-params";
import baseQueryWithReauth from "@/utils/baseQuery";
import { CreateHotelExpenseDto, DeleteHotelExpenseDto, HotelExpense, UpdateHotelExpenseDto } from "../_types/expenses";

// Tipos de respuesta base
type ExpenseResponse = BaseApiResponse<HotelExpense>;
type ExpensesResponse = BaseApiResponse<HotelExpense[]>;
export type PaginatedExpenseParams = PaginatedQueryParams<HotelExpense>;

export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Expense"],
  endpoints: (build) => ({
    // Obtener todos los gastos
    getAllExpenses: build.query<HotelExpense[], void>({
      query: () => ({
        url: "/expenses",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Expense" as const, id })), { type: "Expense", id: "LIST" }]
          : [{ type: "Expense", id: "LIST" }],
    }),

    // Obtener gasto por ID
    getExpenseById: build.query<HotelExpense, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Expense", id }],
    }),

    // Obtener gastos por fecha
    getExpensesByDate: build.query<PaginatedResponse<HotelExpense>, PaginatedExpenseParams>({
      query: ({ pagination: { page = 1, pageSize = 10 }, fieldFilters }) => ({
        url: "/expenses/filter/date",
        method: "GET",
        params: { page, pageSize, ...fieldFilters },
        credentials: "include",
      }),
      providesTags: (result) => [
        { type: "Expense", id: result?.meta?.page },
        ...(result?.data?.map(({ id }) => ({ type: "Expense" as const, id })) ?? []),
      ],
    }),

    // Crear gasto
    createExpense: build.mutation<ExpenseResponse, CreateHotelExpenseDto>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),

    // Actualizar gasto
    updateExpense: build.mutation<ExpenseResponse, { id: string; body: UpdateHotelExpenseDto }>({
      query: ({ id, body }) => ({
        url: `/expenses/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Expense", id },
        { type: "Expense", id: "LIST" },
      ],
    }),

    // Eliminar múltiples gastos
    deleteExpenses: build.mutation<ExpensesResponse, DeleteHotelExpenseDto>({
      query: (body) => ({
        url: `/expenses/remove/all`,
        method: "DELETE",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllExpensesQuery,
  useGetExpenseByIdQuery,
  useGetExpensesByDateQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpensesMutation,
} = expensesApi;
