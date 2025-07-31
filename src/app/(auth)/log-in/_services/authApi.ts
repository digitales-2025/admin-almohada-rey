import { createApi } from "@reduxjs/toolkit/query/react";

import { UserLoginInput, UserLoginOutput } from "@/app/(admin)/users/_types/user";
import baseQueryWithReauth from "@/utils/baseQuery";
import { adminApi } from "../../../(admin)/profile/_services/adminApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    login: build.mutation<UserLoginOutput, UserLoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            adminApi.endpoints.profile.initiate(undefined, {
              forceRefetch: true,
            })
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error durante el login:", error.message);
          } else {
            console.error("Error desconocido durante el login:", error);
          }
        }
      },
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation<{ message: string; statusCode: number }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
