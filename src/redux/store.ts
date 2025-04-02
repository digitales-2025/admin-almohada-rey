import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { customersApi } from "@/app/(admin)/customers/_services/customersApi";
import { productsApi } from "@/app/(admin)/inventory/products/_services/productsApi";
import { paymentsApi } from "@/app/(admin)/payment/_services/paymentsApi";
import { adminApi } from "@/app/(admin)/profile/_services/adminApi";
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configuración para evitar errores de "non-serializable value"
      serializableCheck: {
        // Ignorar las acciones que no son serializables, específicamente de classApi
        ignoredActions: [
          "quotationsApi/executeMutation/fulfilled",
          "quotationsApi/executeMutation/rejected",
          "observationApi/executeMutation/fulfilled",
          "observationApi/executeMutation/rejected",
          "designProjectApi/executeMutation/fulfilled",
          "designProjectApi/executeMutation/rejected",
          "budgetsApi/executeMutation/fulfilled",
          "budgetsApi/executeMutation/rejected",
          "finishesBudgetsApi/executeMutation/fulfilled",
          "finishesBudgetsApi/executeMutation/rejected",
          "finishesApi/executeMutation/fulfilled",
          "finishesApi/executeMutation/rejected",
          "reportsApi/executeMutation/rejected",
          "reportsApi/executeMutation/fulfilled",
          "purchaseOrderApi/executeMutation/fulfilled",
          "purchaseOrderApi/executeMutation/rejected",
          "finishesPurchaseOrderApi/executeMutation/fulfilled",
          "finishesPurchaseOrderApi/executeMutation/rejected",
        ],
        // Ignorar las rutas en el estado que contienen valores no serializables
        ignoredPaths: [
          "quotationsApi.mutations",
          "designProjectApi.mutations",
          "observationApi.mutations",
          "budgetsApi.mutations",
          "finishesBudgetsApi.mutations",
          "finishesApi.mutations",
          "reportsApi.mutations",
          "purchaseOrderApi.mutations",
          "finishesPurchaseOrderApi.mutations",
        ],
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
      .concat(paymentsApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
