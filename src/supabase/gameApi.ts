import { supabase } from "./supabaseClient";
import { generateUserAvatar } from "../util/avatar.util";
import { GameState } from "../types/gameState.type";
import { RoomData } from "../types/room.type";

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
  // First, check if the room exists and get its current state
  const { data: roomData, error: roomError } = await supabase
    .from("rooms")
    .select("host_id, guest_id")
    .eq("id", room_id)
    .single();

  if (roomError) throw roomError;
  if (!roomData) throw new Error("Room not found");

  // If the user is already the host, they can access their room directly
  if (roomData.host_id === guest_id) {
    // Return the room data without updating (they're already the host)
    const { data: existingRoom, error: fetchError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", room_id)
      .single();

    if (fetchError) throw fetchError;
    return existingRoom as RoomData;
  }

  // Check if the room already has a guest
  if (roomData.guest_id) {
    // If the user is already the guest, return the room data
    if (roomData.guest_id === guest_id) {
      const { data: existingRoom, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", room_id)
        .single();

      if (fetchError) throw fetchError;
      return existingRoom as RoomData;
    }

    // If there's already a different guest, the room is full
    throw new Error("This room is already full. Find another room to join.");
  }

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
  return data as RoomData;
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
  const channel = supabase
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

  // eslint-disable-next-line no-console
  console.log(`Subscribed to games channel for game ${game_id}`, channel);
  return channel;
}

// Subscribe to real-time room updates
export function subscribeToRoom(
  room_id: string,
  callback: (room: RoomData) => void
) {
  // Use a unique channel per room and listen to all row changes for robustness
  const channel = supabase
    .channel(`room:${room_id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${room_id}`,
      },
      (payload) => {
        // Some providers send OLD on DELETE; guard for NEW payloads
        const next = payload.new as RoomData as RoomData | undefined;
        if (next) {
          callback(next);
        }
      }
    )
    .subscribe();

  // eslint-disable-next-line no-console
  console.log(`Subscribed to room channel for ${room_id}`, channel);
  return channel;
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
