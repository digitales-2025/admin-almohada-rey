export type RTKUseQueryHookResult<TData> = {
  currentData?: TData;
  data?: TData;
  error?: unknown;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  refetch: () => void;
  // Marca isLoadingError como opcional
  isLoadingError?: boolean;
};
