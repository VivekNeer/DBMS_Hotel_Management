export const COLLECTIONS = {
  rooms: "rooms",
  bookings: "bookings",
  users: "users",
} as const;

export const ROOM_TYPES = ["Single", "Double", "Suite"] as const;
export const ROOM_STATUSES = ["Available", "Occupied", "Maintenance"] as const;

export type RoomType = (typeof ROOM_TYPES)[number];
export type RoomStatus = (typeof ROOM_STATUSES)[number];

export interface RoomDocument {
  room_no: number;
  floor_no: number;
  room_type: RoomType;
  cost_per_day: number;
  status: RoomStatus;
}

export interface BookingDocument {
  room_no: number;
  room_type: RoomType;
  guest_name: string;
  guest_email: string;
  guests: number;
  check_in_date: Date;
  check_out_date: Date;
  created_at: Date;
}

export interface UserDocument {
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}
