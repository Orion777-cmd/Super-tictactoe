import { GameStatus } from "./gameStatusType";
import { GameTurn } from "./gameTurn";
import { GridState } from "./gridStateType";

export type GameData = {
    user1?: string;
    user2?: string;
    game?: GridState[][];
    gameStatus: GameStatus;
    turn?: GameTurn;
    winner?: string;
    // winningLine?: [number, number, number];
    score?: [number, number];
}