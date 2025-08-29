import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "@/utils/baseQuery";
import { CustomerReservationHistoryResponse } from "../_types/customer-reservation-history";

// DTOs for API operations
interface CreateCustomerReservationHistoryDto {
  customerId: string;
  date: string;
  description?: string;
}

interface UpdateCustomerReservationHistoryDto {
  date?: string;
  description?: string;
}

interface DeleteCustomerReservationHistoryDto {
  ids: string[];
}

export const customerReservationHistoryApi = createApi({
  reducerPath: "customerReservationHistoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CustomerReservationHistory"],
  endpoints: (build) => ({
    // Create a new customer reservation history record
    createCustomerReservationHistory: build.mutation<
      CustomerReservationHistoryResponse,
      CreateCustomerReservationHistoryDto
    >({
      query: (body) => ({
        url: "/customer-reservation-history",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["CustomerReservationHistory"],
    }),

    // Get all customer reservation histories by customer ID
    getCustomerReservationHistoriesByCustomerId: build.query<CustomerReservationHistoryResponse[], string>({
      query: (customerId) => ({
        url: `/customer-reservation-history/customer/${customerId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, customerId) => [
        { type: "CustomerReservationHistory", id: customerId },
        ...(result?.map(({ id }) => ({ type: "CustomerReservationHistory" as const, id })) ?? []),
      ],
    }),

    // Update a customer reservation history record
    updateCustomerReservationHistory: build.mutation<
      CustomerReservationHistoryResponse,
      { id: string; body: UpdateCustomerReservationHistoryDto }
    >({
      query: ({ id, body }) => ({
        url: `/customer-reservation-history/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CustomerReservationHistory", id },
        "CustomerReservationHistory",
      ],
    }),

    // Delete multiple customer reservation history records
    deleteCustomerReservationHistories: build.mutation<
      { statusCode: number; message: string },
      DeleteCustomerReservationHistoryDto
    >({
      query: (body) => ({
        url: "/customer-reservation-history",
        method: "DELETE",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["CustomerReservationHistory"],
    }),
  }),
});

export const {
  useCreateCustomerReservationHistoryMutation,
  useGetCustomerReservationHistoriesByCustomerIdQuery,
  useUpdateCustomerReservationHistoryMutation,
  useDeleteCustomerReservationHistoriesMutation,
} = customerReservationHistoryApi;
