import { components } from "../api";

export type PaginatedResponsePrototype = components["schemas"]["PaginatedResponse"];
export type PaginatedResponse<T> = {
  data: T[];
  meta: components["schemas"]["PaginationMetadata"];
};

export type PaginationParams = { page?: number; pageSize?: number };
