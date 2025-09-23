import { supabase } from "./supabaseClient";

// Create a new room and game
export async function createRoom(host_id: string) {
  // Create the room first
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert([{ host_id }])
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
  const { data, error } = await supabase
    .from("rooms")
    .update({ guest_id })
    .eq("id", room_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Create a new game for a room
export async function createGame(room_id: string, initialState: any) {
  const { data, error } = await supabase
    .from("games")
    .insert([{ room_id, state: initialState }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update game state
export async function updateGameState(game_id: string, newState: any) {
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
  callback: (state: any) => void
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
  callback: (room: any) => void
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
        callback(payload.new);
      }
    )
    .subscribe();
}

// Get room data
export async function getRoom(room_id: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", room_id)
    .single();
  if (error) throw error;
  return data;
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
