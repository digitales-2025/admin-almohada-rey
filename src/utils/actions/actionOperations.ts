import {
  GetOneResponse,
  GetResponse,
  MutationListResponse,
  MutationResponse,
  SearchByField,
} from "@/types/api/actions-crud";

export type RequestUri = string;

export interface ActionServerOperation<T> {
  get<V = T>(uri: RequestUri): Promise<GetResponse<V>>;

  getOne<V = T>(uri: RequestUri): Promise<GetOneResponse<V>>;

  searchByFieldCoincidence<V = T>(uri: RequestUri, field: keyof V, value: string): Promise<SearchByField<V>>;

  create<V = T>(uri: RequestUri, dto?: BodyInit | object): Promise<MutationResponse<V>>;

  update<V = T>(uri: RequestUri, id: string, dto?: BodyInit | object): Promise<MutationResponse<V>>;

  delete<V = T>(uri: RequestUri, ids: string[]): Promise<MutationListResponse<V>>;

  restore<V = T>(uri: RequestUri, ids: string[]): Promise<MutationListResponse<V>>;
}
