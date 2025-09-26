export interface Room {
  id: string;
  host_id: string;
  guest_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RoomData extends Room {
  // Additional fields that might be needed
}
