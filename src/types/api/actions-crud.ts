import { BaseApiResponse } from "./types";

export type ActionError = { error: string };
export type GetResponse<T> = T[] | ActionError;
export type GetOneResponse<T> = T | ActionError;
export type SearchByField<T> = T[] | ActionError;
export type MutationResponse<T> = BaseApiResponse<T> | ActionError;
export type MutationListResponse<T> = BaseApiResponse<T[]> | ActionError;
