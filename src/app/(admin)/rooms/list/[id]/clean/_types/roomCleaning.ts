export type RoomCleaning = {
  id: string;
  date: string;
  staffName: string;
  userCheck: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    number: number;
    RoomTypes: {
      id: string;
      name: string;
    };
  };
  observations?: string;
  roomId?: string;
};

// Nuevo tipo para la respuesta paginada
export type PaginatedRoomCleaningResponse = {
  data: {
    room: {
      id: string;
      number: number;
      RoomTypes: {
        id: string;
        name: string;
      };
    };
    cleaningChecklist: RoomCleaning[];
  };
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
};
