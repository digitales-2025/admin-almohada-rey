import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateRoomTypeWithImagesMutation,
  useDeleteRoomTypesMutation,
  useGetAllRoomTypesQuery,
  useGetRoomTypeByIdQuery,
  useGetRoomTypeWithImagesByIdQuery,
  useReactivateRoomTypesMutation,
  useUpdateRoomTypeWithImageMutation,
} from "../_services/roomTypesApi";
import {
  CreateRoomTypeWithImagesDto,
  DeleteRoomTypeDto,
  ReactivateRoomTypeDto,
  RoomType,
  TypedFormData,
  UpdateRoomTypeWithImageDto,
} from "../_types/roomTypes";

export const useRoomTypes = () => {
  // CONSULTAS
  const {
    data: roomTypesList,
    error: roomTypesError,
    isLoading: isLoadingRoomTypes,
    isSuccess: isSuccessRoomTypes,
    refetch: refetchRoomTypes,
  } = useGetAllRoomTypesQuery();

  // Cambiamos de useGetRoomTypeById a getRoomTypeById (no es un hook, es una función)
  const useGetRoomTypeById = (id: string) => {
    const { data, isLoading, error } = useGetRoomTypeByIdQuery(id);
    return { roomType: data, isLoading, error };
  };

  // Cambiamos de useGetRoomTypeWithImagesById a getRoomTypeWithImagesById (no es un hook, es una función)
  const useGetRoomTypeWithImagesById = (id: string) => {
    const { data, isLoading, error } = useGetRoomTypeWithImagesByIdQuery(id);
    return { roomType: data, isLoading, error };
  };

  // MUTACIONES
  const [createRoomType, { isSuccess: isSuccessCreateRoomType, isLoading: isLoadingCreateRoomType }] =
    useCreateRoomTypeWithImagesMutation();

  const [updateRoomType, { isSuccess: isSuccessUpdateRoomType, isLoading: isLoadingUpdateRoomType }] =
    useUpdateRoomTypeWithImageMutation();

  const [deleteRoomTypes, { isSuccess: isSuccessDeleteRoomTypes, isLoading: isLoadingDeleteRoomTypes }] =
    useDeleteRoomTypesMutation();

  const [reactivateRoomTypes, { isSuccess: isSuccessReactivateRoomTypes, isLoading: isLoadingReactivateRoomTypes }] =
    useReactivateRoomTypesMutation();

  // FUNCIONES DE ACCIÓN

  /**
   * Crea un nuevo tipo de habitación con imágenes
   * @param formData FormData con los datos del tipo de habitación e imágenes
   * @returns La data del tipo de habitación creado o error
   */
  async function onCreateRoomType(formData: TypedFormData<CreateRoomTypeWithImagesDto>) {
    // Verificación del tipo de formData y conversión si es necesario
    console.log("===== HOOK: onCreateRoomType =====");
    console.log("Tipo de formData recibido:", Object.prototype.toString.call(formData));
    console.log("Es instancia de FormData:", formData instanceof FormData);

    let finalFormData: FormData;

    // Si no es un FormData, creamos uno a partir de los datos recibidos
    if (!(formData instanceof FormData)) {
      console.log("Convirtiendo objeto a FormData...");
      console.log("Datos originales:", formData);

      finalFormData = new FormData();

      // Agregamos los campos de texto
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          console.log(`Agregando campo ${key}:`, value);
          finalFormData.append(key, String(value));
        }
      });

      // Agregamos las imágenes
      if (Array.isArray(formData.images)) {
        console.log("Imágenes encontradas:", formData.images.length);
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            console.log(`Agregando imagen ${index}:`, image.name);
            finalFormData.append(`images`, image);
          } else {
            console.log(`Error: La imagen ${index} no es un File:`, image);
          }
        });
      } else {
        console.log("Error: No se encontraron imágenes o no es un array");
      }
    } else {
      finalFormData = formData;
      // Log de contenido del FormData recibido
      console.log("Contenido del FormData recibido:");
      finalFormData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      });
    }

    console.log("FormData final listo para enviar");

    const promise = runAndHandleError(async () => {
      try {
        console.log("Enviando solicitud createRoomType...");
        const response = await createRoomType(finalFormData).unwrap();
        console.log("Respuesta recibida:", response);
        // Extraemos solo la data del BaseApiResponse
        return response.data;
      } catch (error) {
        console.error("Error en createRoomType:", error);
        throw error;
      }
    });

    toast.promise(promise, {
      loading: "Creando tipo de habitación...",
      success: "Tipo de habitación creado con éxito",
      error: (err) => {
        console.error("Error en toast:", err);
        return err.message;
      },
    });

    return await promise;
  }

  /**
   * Actualiza un tipo de habitación existente
   * @param data Datos del tipo de habitación a actualizar
   * @returns La data del tipo de habitación actualizado o error
   */
  async function onUpdateRoomType(data: UpdateRoomTypeWithImageDto) {
    console.log("===== HOOK: onUpdateRoomType =====");
    console.log("Datos recibidos:", data);

    const id = data.id;
    if (!id) {
      throw new Error("ID no proporcionado para actualización");
    }

    // Preparar el objeto final a enviar (convertimos todo a un solo objeto)
    const requestData = new FormData();

    // Agregar campos básicos de texto
    if (data.name) requestData.append("name", data.name);
    if (data.guests) requestData.append("guests", String(data.guests));
    if (data.price) requestData.append("price", String(data.price));
    if (data.tv) requestData.append("tv", data.tv);
    if (data.floorType) requestData.append("floorType", data.floorType);
    if (data.description) requestData.append("description", data.description);
    if (data.area) requestData.append("area", String(data.area));
    if (data.bed) requestData.append("bed", data.bed);

    // Manejar imagen nueva si existe
    if (data.newImage && data.newImage instanceof File) {
      requestData.append("newImage", data.newImage);
    }

    // Manejar correctamente imageUpdate - CLAVE DEL PROBLEMA
    if (data.imageUpdate) {
      // Asegurarse de que el objeto imageUpdate tenga la estructura correcta
      const imageUpdateObject = {
        id: data.imageUpdate.id, // Asegurarse de que exista este campo
        url: data.imageUpdate.url, // Asegurarse de que exista este campo
        isMain: Boolean(data.imageUpdate.isMain), // Convertir a boolean explícito
      };

      // Como el backend espera un objeto JSON, lo serializamos
      const imageUpdateJSON = JSON.stringify(imageUpdateObject);

      // Enviar como "data" y no como "blobs" en el FormData
      requestData.append("imageUpdate", imageUpdateJSON);

      console.log("imageUpdate estructurado correctamente:", imageUpdateObject);
      console.log("imageUpdate serializado:", imageUpdateJSON);
    }

    console.log("Contenido del FormData a enviar:");
    requestData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    // Enviar solicitud
    const promise = runAndHandleError(async () => {
      console.log("Enviando solicitud updateRoomType...");
      const response = await updateRoomType({ id, formData: requestData }).unwrap();
      console.log("Respuesta recibida:", response);
      return response.data;
    });

    toast.promise(promise, {
      loading: "Actualizando tipo de habitación...",
      success: "Tipo de habitación actualizado exitosamente",
      error: (error) => error.message || "Error al actualizar habitación",
    });

    return await promise;
  }

  /**
   * Desactiva (elimina lógicamente) varios tipos de habitación
   * @param roomTypes Array de tipos de habitación a desactivar
   * @returns Array con los tipos de habitación desactivados o error
   */
  const onDeleteRoomTypes = async (roomTypes: RoomType[]) => {
    // Filtramos para asegurarnos de que id no sea undefined
    const ids = roomTypes.map((roomType) => roomType.id).filter((id): id is string => id !== undefined);

    // Usamos el DTO explícitamente
    const deleteDto: DeleteRoomTypeDto = { ids };

    const promise = runAndHandleError(async () => {
      const response = await deleteRoomTypes(deleteDto).unwrap();
      // Extraemos solo la data del BaseApiResponse
      return response.data;
    });

    toast.promise(promise, {
      loading: "Desactivando tipos de habitación...",
      success: "Tipos de habitación desactivados con éxito",
      error: (err) => err.message,
    });

    return await promise;
  };

  /**
   * Reactiva tipos de habitación previamente desactivados
   * @param roomTypes Array de tipos de habitación a reactivar
   * @returns Array con los tipos de habitación reactivados o error
   */
  const onReactivateRoomTypes = async (roomTypes: RoomType[]) => {
    // Filtramos para asegurarnos de que id no sea undefined
    const ids = roomTypes.map((roomType) => roomType.id).filter((id): id is string => id !== undefined);

    // Usamos el DTO explícitamente
    const reactivateDto: ReactivateRoomTypeDto = { ids };

    const promise = runAndHandleError(async () => {
      const response = await reactivateRoomTypes(reactivateDto).unwrap();
      // Extraemos solo la data del BaseApiResponse
      return response.data;
    });

    toast.promise(promise, {
      loading: "Reactivando tipos de habitación...",
      success: "Tipos de habitación reactivados con éxito",
      error: (err) => err.message,
    });

    return await promise;
  };

  return {
    // Datos y estados de consultas
    roomTypesList,
    roomTypesError,
    isLoadingRoomTypes,
    isSuccessRoomTypes,
    refetchRoomTypes,
    useGetRoomTypeById, // Cambio de nombre
    useGetRoomTypeWithImagesById, // Cambio de nombre

    // Funciones de acción
    onCreateRoomType,
    onUpdateRoomType,
    onDeleteRoomTypes,
    onReactivateRoomTypes,

    // Estados de mutaciones
    isSuccessCreateRoomType,
    isLoadingCreateRoomType,
    isSuccessUpdateRoomType,
    isLoadingUpdateRoomType,
    isSuccessDeleteRoomTypes,
    isLoadingDeleteRoomTypes,
    isSuccessReactivateRoomTypes,
    isLoadingReactivateRoomTypes,
  };
};
