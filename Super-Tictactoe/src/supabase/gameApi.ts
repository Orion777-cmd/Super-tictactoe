import { supabase } from "./supabaseClient";
import { generateUserAvatar } from "../util/avatar.util";

// Define types for better type safety
interface GameState {
  bigBoard: (string | null)[][];
  winnerBoard: (string | null)[];
  turn: string;
  gameStatus: string;
  winner: string;
  score: [number, number];
  activeBoard: number;
  wholeGameWinner: string | null;
}

interface RoomData {
  id: string;
  host_id: string;
  guest_id?: string;
  host_avatar?: string;
  guest_avatar?: string;
  created_at: string;
  updated_at: string;
}

// Create a new room and game
export async function createRoom(host_id: string) {
  // Generate avatars for both players
  const hostAvatar = generateUserAvatar(host_id);

  // Create the room with avatar data
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert([
      {
        host_id,
        host_avatar: hostAvatar,
        guest_avatar: null, // Will be set when guest joins
      },
    ])
    .select()
    .single();
  if (roomError) throw roomError;

  // Create the game for this room
  const initialState = {
    bigBoard: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
    winnerBoard: Array(9).fill(null),
    turn: host_id,
    gameStatus: "waiting",
    winner: "",
    score: [0, 0],
    activeBoard: -1,
    wholeGameWinner: null,
  };

  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert([{ room_id: room.id, state: initialState }])
    .select()
    .single();
  if (gameError) throw gameError;

  return { room, game };
}

// Join a room as guest
export async function joinRoom(room_id: string, guest_id: string) {
  // Generate avatar for guest
  const guestAvatar = generateUserAvatar(guest_id);

  const { data, error } = await supabase
    .from("rooms")
    .update({
      guest_id,
      guest_avatar: guestAvatar,
    })
    .eq("id", room_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Create a new game for a room
export async function createGame(room_id: string, initialState: GameState) {
  const { data, error } = await supabase
    .from("games")
    .insert([{ room_id, state: initialState }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update game state
export async function updateGameState(game_id: string, newState: GameState) {
  const { data, error } = await supabase
    .from("games")
    .update({ state: newState, updated_at: new Date().toISOString() })
    .eq("id", game_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Subscribe to real-time game state updates
export function subscribeToGameState(
  game_id: string,
  callback: (state: GameState) => void
) {
  return supabase
    .channel("games")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "games",
        filter: `id=eq.${game_id}`,
      },
      (payload) => {
        callback(payload.new.state);
      }
    )
    .subscribe();
}

// Subscribe to real-time room updates
export function subscribeToRoom(
  room_id: string,
  callback: (room: RoomData) => void
) {
  return supabase
    .channel("rooms")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${room_id}`,
      },
      (payload) => {
        callback(payload.new as RoomData);
      }
    )
    .subscribe();
}

// Get room data
export async function getRoom(room_id: string): Promise<RoomData> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", room_id)
    .single();
  if (error) throw error;
  return data as RoomData;
}

// Get game for a room
export async function getGameForRoom(room_id: string) {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("room_id", room_id)
    .single();
  if (error) throw error;
  return data;
}
