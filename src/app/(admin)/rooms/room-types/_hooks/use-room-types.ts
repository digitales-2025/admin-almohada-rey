import { toast } from "sonner";

import { runAndHandleError } from "@/utils/baseQuery";
import {
  useCreateRoomTypeWithImagesMutation,
  useDeleteRoomTypesMutation,
  useGetAllRoomTypesQuery,
  useGetAllSummaryRoomTypeQuery,
  useGetRoomTypeByIdQuery,
  useGetRoomTypeWithImagesByIdQuery,
  useReactivateRoomTypesMutation,
  useUpdateMainImageMutation,
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

  const { data: dataCreatableTypeRooms, refetch: refetchDataCreatableTypeRooms } = useGetAllSummaryRoomTypeQuery();

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

  const [updateMainImage, { isSuccess: isSuccessUpdateMainImage, isLoading: isLoadingUpdateMainImage }] =
    useUpdateMainImageMutation();

  // FUNCIONES DE ACCIÓN

  /**
   * Crea un nuevo tipo de habitación con imágenes
   * @param formData FormData con los datos del tipo de habitación e imágenes
   * @returns La data del tipo de habitación creado o error
   */
  async function onCreateRoomType(formData: TypedFormData<CreateRoomTypeWithImagesDto>) {
    let finalFormData: FormData;

    // Si no es un FormData, creamos uno a partir de los datos recibidos
    if (!(formData instanceof FormData)) {
      finalFormData = new FormData();

      // Agregamos los campos de texto
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          finalFormData.append(key, String(value));
        }
      });

      // Agregamos las imágenes
      if (Array.isArray(formData.images)) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            finalFormData.append(`images`, image);
          }
        });
      }
    } else {
      finalFormData = formData;
    }

    const promise = runAndHandleError(async () => {
      try {
        const response = await createRoomType(finalFormData).unwrap();
        return response.data;
      } catch (error) {
        throw error;
      }
    });

    toast.promise(promise, {
      loading: "Creando tipo de habitación...",
      success: "Tipo de habitación creado con éxito",
      error: (err) => err.message,
    });

    return await promise;
  }

  /**
   * Actualiza un tipo de habitación existente
   * @param data Datos del tipo de habitación a actualizar
   * @returns La data del tipo de habitación actualizado o error
   */
  async function onUpdateRoomType(data: UpdateRoomTypeWithImageDto & { id: string }) {
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

    // Manejar correctamente imageUpdate
    if (data.imageUpdate) {
      // Asegurarse de que el objeto imageUpdate tenga la estructura correcta
      const imageUpdateObject = {
        id: data.imageUpdate.id,
        url: data.imageUpdate.url,
        isMain: Boolean(data.imageUpdate.isMain),
      };

      // Como el backend espera un objeto JSON, lo serializamos
      const imageUpdateJSON = JSON.stringify(imageUpdateObject);

      // Enviar como "data" y no como "blobs" en el FormData
      requestData.append("imageUpdate", imageUpdateJSON);
    }

    // Enviar solicitud
    const promise = runAndHandleError(async () => {
      const response = await updateRoomType({ id, formData: requestData }).unwrap();
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

  /**
   * Establece una imagen como principal para un tipo de habitación
   * @param roomTypeId ID del tipo de habitación
   * @param imageUpdate Objeto con datos de la imagen a establecer como principal
   */
  async function onUpdateMainImage(
    roomTypeId: string,
    imageUpdate: { id: string; url: string; isMain: boolean }
  ): Promise<RoomType> {
    if (!roomTypeId) {
      throw new Error("ID de tipo de habitación no proporcionado");
    }

    if (!imageUpdate || !imageUpdate.id) {
      throw new Error("Datos de imagen incorrectos");
    }

    // Asegurarse de que isMain sea true
    imageUpdate.isMain = true;

    const promise = runAndHandleError(async () => {
      const response = await updateMainImage({ roomTypeId, imageUpdate }).unwrap();
      return response.data; // Esto es de tipo RoomType
    });

    toast.promise(promise, {
      loading: "Actualizando imagen principal...",
      success: "Imagen principal actualizada exitosamente",
      error: (error) => error.message || "Error al actualizar imagen principal",
    });

    return await promise;
  }

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
    onUpdateMainImage,

    // Estados de mutaciones
    isSuccessCreateRoomType,
    isLoadingCreateRoomType,
    isSuccessUpdateRoomType,
    isLoadingUpdateRoomType,
    isSuccessDeleteRoomTypes,
    isLoadingDeleteRoomTypes,
    isSuccessReactivateRoomTypes,
    isLoadingReactivateRoomTypes,
    isSuccessUpdateMainImage,
    isLoadingUpdateMainImage,

    // Datos de tipos habitaciones activas
    dataCreatableTypeRooms,
    refetchDataCreatableTypeRooms,
  };
};
