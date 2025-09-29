import { useState, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";

// Interface for Supabase response with joined room data
interface GameWithRoomData {
  id: string;
  room_id: string;
  state: {
    gameStatus?: string;
    wholeGameWinner?: string;
    score?: [number, number];
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
  rooms: {
    host_id: string;
    guest_id?: string;
    host_username?: string;
    guest_username?: string;
  }[];
}

export interface GameHistoryEntry {
  id: string;
  roomId: string;
  hostId: string;
  guestId: string;
  hostUsername: string;
  guestUsername: string;
  winner: "host" | "guest" | "draw" | null;
  gameStatus: string;
  finalScore: [number, number];
  gameDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  moves: GameMove[];
}

export interface GameMove {
  playerId: string;
  playerSymbol: "X" | "O";
  boardIndex: number;
  cellIndex: number;
  timestamp: string;
  moveNumber: number;
}

interface GameHistoryHook {
  games: GameHistoryEntry[];
  loading: boolean;
  error: string | null;
  fetchGameHistory: (userId: string, limit?: number) => Promise<void>;
  getGameDetails: (gameId: string) => Promise<GameHistoryEntry | null>;
  getPlayerStats: (userId: string) => Promise<{
    totalGames: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    averageGameTime: number;
    longestWinStreak: number;
    currentStreak: number;
  }>;
}

export const useGameHistory = (): GameHistoryHook => {
  const [games, setGames] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameHistory = useCallback(
    async (userId: string, limit: number = 50) => {
      setLoading(true);
      setError(null);

      try {
        // Fetch games with room data for proper filtering
        const { data: gamesData, error: gamesError } = await supabase
          .from("games")
          .select(
            `
            id,
            room_id,
            state,
            created_at,
            updated_at,
            rooms!inner(host_id, guest_id, host_username, guest_username)
          `
          )
          .order("updated_at", { ascending: false })
          .limit(limit * 2); // Fetch more to account for filtering

        if (gamesError) throw gamesError;

        // Filter games where user was either host or guest
        const userGames = ((gamesData as GameWithRoomData[]) || [])
          .filter(
            (game) =>
              game.rooms?.[0]?.host_id === userId ||
              game.rooms?.[0]?.guest_id === userId
          )
          .slice(0, limit); // Apply limit after filtering

        // Transform the data with proper room information
        const transformedGames: GameHistoryEntry[] = userGames.map(
          (game: GameWithRoomData) => {
            const isHost = game.rooms?.[0]?.host_id === userId;

            // Determine winner based on game state
            let winner: "host" | "guest" | "draw" | null = null;
            if (
              game.state?.gameStatus === "win" &&
              game.state?.wholeGameWinner
            ) {
              if (game.state.wholeGameWinner === "X") {
                winner = isHost ? "host" : "guest";
              } else if (game.state.wholeGameWinner === "O") {
                winner = isHost ? "guest" : "host";
              }
            } else if (game.state?.gameStatus === "tie") {
              winner = "draw";
            }

            // Calculate game duration using created_at and updated_at
            const gameDuration = Math.round(
              (new Date(game.updated_at).getTime() -
                new Date(game.created_at).getTime()) /
                1000 /
                60
            );

            return {
              id: game.id,
              roomId: game.room_id,
              hostId: game.rooms?.[0]?.host_id || "unknown",
              guestId: game.rooms?.[0]?.guest_id || "unknown",
              hostUsername: isHost
                ? "You"
                : game.rooms?.[0]?.host_username ||
                  `Player ${game.rooms?.[0]?.host_id?.slice(-4) || "Unknown"}`,
              guestUsername: isHost
                ? game.rooms?.[0]?.guest_username ||
                  `Player ${game.rooms?.[0]?.guest_id?.slice(-4) || "Unknown"}`
                : "You",
              winner,
              gameStatus: game.state?.gameStatus || "unknown",
              finalScore: game.state?.score || [0, 0],
              gameDuration,
              createdAt: game.created_at,
              updatedAt: game.updated_at,
              moves: [], // We'll implement move tracking separately
            };
          }
        );

        setGames(transformedGames);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch game history";
        setError(errorMessage);
        console.error("Game history error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getGameDetails = useCallback(
    async (gameId: string): Promise<GameHistoryEntry | null> => {
      try {
        const { data, error } = await supabase
          .from("games")
          .select(
            `
          id,
          room_id,
          state,
          created_at,
          updated_at,
          rooms!inner(
            host_id,
            guest_id,
            host_username,
            guest_username
          )
        `
          )
          .eq("id", gameId)
          .single();

        if (error) throw error;

        // Transform the data (same logic as fetchGameHistory)
        const game = data;
        const gameDuration = Math.round(
          (new Date(game.updated_at).getTime() -
            new Date(game.created_at).getTime()) /
            1000 /
            60
        );

        let winner: "host" | "guest" | "draw" | null = null;
        if (game.state?.gameStatus === "win" && game.state?.wholeGameWinner) {
          if (game.state.wholeGameWinner === "X") {
            winner = "host";
          } else if (game.state.wholeGameWinner === "O") {
            winner = "guest";
          }
        } else if (game.state?.gameStatus === "tie") {
          winner = "draw";
        }

        return {
          id: game.id,
          roomId: game.room_id,
          hostId: game.rooms?.[0]?.host_id || "unknown",
          guestId: game.rooms?.[0]?.guest_id || "unknown",
          hostUsername: game.rooms?.[0]?.host_username || "Unknown Host",
          guestUsername: game.rooms?.[0]?.guest_username || "Unknown Guest",
          winner,
          gameStatus: game.state?.gameStatus || "unknown",
          finalScore: game.state?.score || [0, 0],
          gameDuration,
          createdAt: game.created_at,
          updatedAt: game.updated_at,
          moves: [],
        };
      } catch (err) {
        console.error("Error fetching game details:", err);
        return null;
      }
    },
    []
  );

  const getPlayerStats = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select(
          `
          state,
          created_at,
          updated_at,
          rooms!inner(host_id, guest_id)
        `
        )
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Filter games where user was either host or guest
      const userGames = ((data as GameWithRoomData[]) || []).filter(
        (game) =>
          game.rooms?.[0]?.host_id === userId ||
          game.rooms?.[0]?.guest_id === userId
      );

      let totalGames = 0;
      let wins = 0;
      let losses = 0;
      let draws = 0;
      let totalGameTime = 0;
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      userGames.forEach((game: GameWithRoomData) => {
        if (
          game.state?.gameStatus === "win" ||
          game.state?.gameStatus === "tie"
        ) {
          totalGames++;

          // Calculate actual game time using created_at and updated_at
          const gameTime =
            new Date(game.updated_at).getTime() -
            new Date(game.created_at).getTime();
          totalGameTime += gameTime;

          const isHost = game.rooms?.[0]?.host_id === userId;
          let isWin = false;

          if (game.state?.gameStatus === "win") {
            if (game.state?.wholeGameWinner === (isHost ? "X" : "O")) {
              wins++;
              isWin = true;
            } else {
              losses++;
            }
          } else {
            draws++;
          }

          // Update streak
          if (isWin) {
            tempStreak++;
            currentStreak = Math.max(currentStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
      });

      longestStreak = currentStreak;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
      const averageGameTime =
        totalGames > 0 ? totalGameTime / totalGames / 1000 / 60 : 0;

      return {
        totalGames,
        wins,
        losses,
        draws,
        winRate: Math.round(winRate * 10) / 10,
        averageGameTime: Math.round(averageGameTime * 10) / 10,
        longestWinStreak: longestStreak,
        currentStreak: tempStreak,
      };
    } catch (err) {
      console.error("Error calculating player stats:", err);
      return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageGameTime: 0,
        longestWinStreak: 0,
        currentStreak: 0,
      };
    }
  }, []);

  return {
    games,
    loading,
    error,
    fetchGameHistory,
    getGameDetails,
    getPlayerStats,
  };
};
