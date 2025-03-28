import {
  GetOneResponse,
  GetResponse,
  MutationListResponse,
  MutationResponse,
  SearchByField,
} from "@/types/api/actions-crud";
import { http } from "../serverFetch";
import { ActionServerOperation, RequestUri } from "./actionOperations";

export abstract class BaseActionOps<T> implements ActionServerOperation<T> {
  async get<V = T>(uri: RequestUri): Promise<GetResponse<V>> {
    try {
      const [data, error] = await http.get<GetResponse<V>>(uri);
      if (error) {
        return {
          error:
            typeof error === "object" && error !== null && "message" in error
              ? String(error.message)
              : "Error al obtener registros",
        };
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async getOne<V = T>(uri: RequestUri): Promise<GetOneResponse<V>> {
    try {
      const [data, error] = await http.get<GetOneResponse<V>>(uri);
      if (error) {
        return {
          error:
            typeof error === "object" && error !== null && "message" in error
              ? String(error.message)
              : "Error al obtener el registro",
        };
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async searchByFieldCoincidence<V = T>(uri: RequestUri, field: keyof V, value: string): Promise<SearchByField<V>> {
    try {
      const [data, error] = await http.get<SearchByField<V>>(`${uri}?${String(field)}=${value}`);
      if (error) {
        return {
          error: `Error al buscar registros: ${error.message}`,
        };
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async create<V = T>(uri: RequestUri, dto?: BodyInit | object): Promise<MutationResponse<V>> {
    try {
      const [data, error] = await http.post<MutationResponse<V>>(uri, dto);

      if (error) {
        return {
          error: `Error al crear el registro: ${error.message}`,
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async update<V = T>(uri: RequestUri, id: string, dto?: BodyInit | object): Promise<MutationResponse<V>> {
    const localUri = `${uri}/${id}`;
    try {
      const [data, error] = await http.patch<MutationResponse<V>>(localUri, dto);

      if (error) {
        return {
          error: `Error al actualizar el registro: ${error.message}`,
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async delete<V = T>(uri: RequestUri, ids: string[]): Promise<MutationListResponse<V>> {
    try {
      const deleteDto = {
        ids,
      };
      const [data, error] = await http.deleteMany<MutationListResponse<V>>(uri, deleteDto);

      if (error) {
        return {
          error: `Error al eliminar el registro: ${error.message}`,
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }

  async restore<V = T>(uri: RequestUri, ids: string[]): Promise<MutationListResponse<V>> {
    try {
      const restoreDto = {
        ids,
      };
      const [data, error] = await http.patch<MutationListResponse<V>>(uri, restoreDto);

      if (error) {
        return {
          error: `Error al restaurar el registro: ${error.message}`,
        };
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      }
      return {
        error: "Error desconocido",
      };
    }
  }
}
