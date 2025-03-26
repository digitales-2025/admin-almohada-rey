export type Room = {
  id: string;
  number: number;
  status: RoomStatus;
  isActive: boolean;

  RoomTypes?: RoomTypes;

  // Limpieza de Habitación
  trashBin: boolean;
  towel: boolean;
  toiletPaper: boolean;
  showerSoap: boolean;
  handSoap: boolean;
  lamp: boolean;

  roomTypeId?: string;
};

export type RoomTypes = {
  id: string;
  name: string;
  ImageRoomType: {
    id: string;
    imageUrl: string;
    isMain: boolean;
  };
};

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  CLEANING = "CLEANING",
}
