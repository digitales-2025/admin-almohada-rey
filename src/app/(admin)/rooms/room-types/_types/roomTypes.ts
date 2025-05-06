import { components } from "@/types/api";

// Tipo personalizado para FormData tipado
/* export type TypedFormData<T> = FormData & { _type?: T }; */
export type TypedFormData<T> = T | FormData;

/**
 * Tipos de pisos enums
 */
/* export enum FloorTypeEnum {
  LAMINATING = "LAMINATING",
  CARPETING = "CARPETING",
}

export type FloorTypeAccepted = keyof typeof FloorTypeEnum;

export const FloorType: Record<FloorTypeAccepted, FloorTypeAccepted> = {
  LAMINATING: "LAMINATING",
  CARPETING: "CARPETING",
}; */
/**
 * Tipo de habitación con sus características
 */
export type RoomTypePrototype = components["schemas"]["RoomType"]; //tipado de la respuesta de la api
/* RoomType: {
   id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    name: string;
    guests: number;
    price: number;
    description: string;
    bed: string;
} */

export type imagesRoomType = {
  id: string;
  url: string;
  isMain: boolean;
};
export interface RoomType extends RoomTypePrototype {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  nameEn: string;
  guests: number;
  price: number;
  description: string;
  descriptionEn: string;
  bed: string;
  bedEn: string;
  imagesRoomType: imagesRoomType[];
}
/**
 * Tipo de CreateRoomTypeWithImagesDto con sus características
 */
export type CreateRoomTypeWithImagesPrototype = components["schemas"]["CreateRoomTypeWithImagesDto"]; //tipado de create de la api
/* CreateRoomTypeWithImagesDto: {
 name: string;
    guests: number;
    price: number;
    description: string;
    bed: string;
    images: string[];
} */

export interface images {
  images: File[] | undefined;
}
export type CreateRoomTypeWithImagesDto = Omit<CreateRoomTypeWithImagesPrototype, "images"> & images;

/**
 * Tipo de UpdateRoomTypeWithImageDto con sus características
 */
export type UpdateRoomTypeWithImagePrototype = components["schemas"]["UpdateRoomTypeWithImageDto"]; //tipado de update de la api
/* UpdateRoomTypeWithImageDto = {
    name?: string;
    guests?: number;
    price?: number;
    description?: string;
    bed?: string;
    newImage?: string;
    imageUpdate?: components["schemas"]["ImageRoomTypeUpdateDto"];
} */
// Para el tipo File (newImage)
export interface NewImageField {
  newImage?: File;
}

// Para el objeto de actualización de imagen
export interface ImageUpdateField {
  imageUpdate?: {
    id: string;
    url: string;
    isMain: boolean;
  } | null;
}

// Tipo completo combinado
export type UpdateRoomTypeWithImageDto = Omit<UpdateRoomTypeWithImagePrototype, "newImage" | "imageUpdate"> &
  NewImageField &
  ImageUpdateField;
/**
 * Tipo de ImageRoomTypeUpdateDto con sus características
 */
export type ImageRoomTypeUpdatePrototype = components["schemas"]["ImageRoomTypeUpdateDto"]; //tipado de update de la api
/* ImageRoomTypeUpdateDto = {
    id: string;
    url: string;
    isMain: boolean;
} */

/**
 * Tipo de DeleteRoomTypeDto con sus características
 */
export type DeleteRoomTypeDto = components["schemas"]["DeleteRoomTypeDto"]; //tipado de delete de la api
/* DeleteRoomTypeDto = {
    ids: string[];
} */

/**
 * Tipo de ReactivateRoomTypeDto con sus características
 */
export type ReactivateRoomTypeDto = components["schemas"]["DeleteRoomTypeDto"]; //tipado de reactivar de la api se usa el mismo que delete porque es igual en el bakend

/* DeleteRoomTypeDto = {
    ids: string[];
} */

export type SummaryRoomType = {
  id: string;
  name: number;
  isActive: boolean;
};
