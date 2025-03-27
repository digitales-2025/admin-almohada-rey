import { components } from "@/types/api";

// Tipo personalizado para FormData tipado
export type TypedFormData<T> = FormData & { _type?: T };

/**
 * Tipos de pisos enums
 */
export enum FloorTypeEnum {
  LAMINATING = "LAMINATING",
  CARPETING = "CARPETING",
}

export const FloorType = {
  LAMINATING: "LAMINATING",
  CARPETING: "CARPETING",
};
/**
 * Tipo de habitación con sus características
 */
export type RoomTypePrototype = components["schemas"]["RoomType"]; //tipado de la respuesta de la api
/* RoomType: {
    id?: string;
   
    name: string;
    floorType: "LAMINATING" | "CARPETING";
    area: number;
    guests: number;
    price: number;
    isActive?: boolean;
    description: string;
    bed: string;
    tv: string;

} */

export type imagesRoomType = {
  id: string;
  url: string;
  isMain: boolean;
};
export interface RoomType extends RoomTypePrototype {
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
    tv: string;
    floorType: "LAMINATING" | "CARPETING";
    description: string;
    area: number;
    bed: string;
    images: string[];
} */

export interface images {
  images: File[] | null;
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
    tv?: string;
    floorType?: "LAMINATING" | "CARPETING";
    description?: string;
    area?: number;
    bed?: string;
    newImage?: string;
    imageUpdate?: components["schemas"]["ImageRoomTypeUpdateDto"];
} */
export interface newImage {
  newImage: File | null;
}

export type UpdateRoomTypeWithImageDto = Omit<UpdateRoomTypeWithImagePrototype, "newImage" | "imageUpdate"> &
  newImage &
  imageUpdate;

/**
 * Tipo de ImageRoomTypeUpdateDto con sus características
 */
export type ImageRoomTypeUpdatePrototype = components["schemas"]["ImageRoomTypeUpdateDto"]; //tipado de update de la api
/* ImageRoomTypeUpdateDto = {
    id: string;
    url: string;
    isMain: boolean;
} */
export type imageUpdate = {
  id: string;
  url: string;
  isMain: boolean;
};

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
