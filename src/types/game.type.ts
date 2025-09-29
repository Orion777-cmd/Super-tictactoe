import { GameState } from "./gameState.type";

export interface Game {
  id: string;
  room_id: string;
  state: GameState;
  created_at: string;
  updated_at: string;
}

export interface GameWithRoom extends Game {
  rooms?: {
    host_id: string;
    guest_id?: string;
  };
}
