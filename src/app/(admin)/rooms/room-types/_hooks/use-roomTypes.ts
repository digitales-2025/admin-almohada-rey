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
   * @param id ID del tipo de habitación
   * @param formData FormData con los datos a actualizar
   * @returns La data del tipo de habitación actualizado o error
   */
  async function onUpdateRoomType({
    id,
    formData,
  }: {
    id: string;
    formData: TypedFormData<UpdateRoomTypeWithImageDto>;
  }) {
    // Verificación similar para el formData de actualización
    console.log("===== HOOK: onUpdateRoomType =====");
    console.log("ID:", id);
    console.log("Tipo de formData recibido:", Object.prototype.toString.call(formData));
    console.log("Es instancia de FormData:", formData instanceof FormData);

    let finalFormData: FormData;

    if (!(formData instanceof FormData)) {
      console.log("Convirtiendo objeto a FormData...");
      console.log("Datos originales:", formData);

      finalFormData = new FormData();

      // Agregamos los campos de texto
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "newImage" && key !== "selectedImageId") {
          console.log(`Agregando campo ${key}:`, value);
          finalFormData.append(key, String(value));
        }
      });

      // Agregamos el ID de la imagen seleccionada
      if (formData.selectedImageId) {
        console.log("Agregando selectedImageId:", formData.selectedImageId);
        finalFormData.append("selectedImageId", formData.selectedImageId);
      }

      // Agregamos la nueva imagen si existe
      if (formData.newImage && formData.newImage instanceof File) {
        console.log("Agregando nueva imagen:", formData.newImage.name);
        finalFormData.append("newImage", formData.newImage);
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
        console.log("Enviando solicitud updateRoomType...");
        const response = await updateRoomType({ id, formData: finalFormData }).unwrap();
        console.log("Respuesta recibida:", response);
        // Extraemos solo la data del BaseApiResponse
        return response.data;
      } catch (error) {
        console.error("Error en updateRoomType:", error);
        throw error;
      }
    });

    toast.promise(promise, {
      loading: "Actualizando tipo de habitación...",
      success: "Tipo de habitación actualizado exitosamente",
      error: (error) => {
        console.error("Error en toast de actualización:", error);
        return error.message;
      },
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
