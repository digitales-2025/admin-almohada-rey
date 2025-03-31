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
