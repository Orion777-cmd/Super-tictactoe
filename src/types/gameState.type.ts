import { GridState } from "./gridStateType";
import { GameStatus } from "./gameStatusType";

export interface GameState {
  bigBoard: (string | null)[][];
  winnerBoard: (string | "draw" | null)[];
  gameStatus: GameStatus;
  turn: string;
  winner: string;
  score: [number, number];
  activeBoard: number;
  wholeGameWinner: string | "draw" | null;
}
