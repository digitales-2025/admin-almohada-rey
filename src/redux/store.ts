import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { customersApi } from "@/app/(admin)/customers/_services/customersApi";
import { dashboardApi } from "@/app/(admin)/dashboard/_services/dashboardApi";
import { expensesApi } from "@/app/(admin)/expenses/_services/expensesApi";
import { movementsApi } from "@/app/(admin)/inventory/movements/_services/movementsApi";
import { productsApi } from "@/app/(admin)/inventory/products/_services/productsApi";
import { warehouseApi } from "@/app/(admin)/inventory/warehouse/_services/warehouseApi";
import { paymentsApi } from "@/app/(admin)/payments/_services/paymentsApi";
import { adminApi } from "@/app/(admin)/profile/_services/adminApi";
import { reportsApi } from "@/app/(admin)/reports/_services/reportsApi";
import { reservationApi } from "@/app/(admin)/reservation/_services/reservationApi";
import { roomsApi } from "@/app/(admin)/rooms/list/_services/roomsApi";
import { roomsCleaningApi } from "@/app/(admin)/rooms/list/[id]/clean/_service/RoomsCleaningApi";
import { roomTypeApi } from "@/app/(admin)/rooms/room-types/_services/roomTypesApi";
import { usersApi } from "@/app/(admin)/users/_services/usersApi";
import { authApi } from "@/app/(auth)/log-in/_services/authApi";
import { servicesApi } from "./servicesApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [reservationApi.reducerPath]: reservationApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [roomTypeApi.reducerPath]: roomTypeApi.reducer,
    [roomsCleaningApi.reducerPath]: roomsCleaningApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [movementsApi.reducerPath]: movementsApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configuración para evitar errores de "non-serializable value"
      serializableCheck: {
        // Ignorar las acciones que no son serializables, específicamente de classApi
        ignoredActions: [
          "customersApi/executeMutation/fulfilled",
          "customersApi/executeMutation/rejected",
          "customersApi/executeQuery/fulfilled",
          "customersApi/executeQuery/rejected",
          "customersApi/executeQuery/pending",
          //
          "reportsApi/executeQuery/fulfilled",
          "reportsApi/executeQuery/rejected",
          "reportsApi/executeQuery/pending",
        ],
        // Ignorar las rutas en el estado que contienen valores no serializables
        ignoredPaths: ["customersApi.mutations", "customersApi.queries", "reportsApi.queries"],
      },
    })
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(usersApi.middleware)
      .concat(customersApi.middleware)
      .concat(productsApi.middleware)
      .concat(reservationApi.middleware)
      .concat(roomTypeApi.middleware)
      .concat(roomsApi.middleware)
      .concat(roomsCleaningApi.middleware)
      .concat(servicesApi.middleware)
      .concat(paymentsApi.middleware)
      .concat(expensesApi.middleware)
      .concat(movementsApi.middleware)
      .concat(warehouseApi.middleware)
      .concat(reportsApi.middleware)
      .concat(dashboardApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
