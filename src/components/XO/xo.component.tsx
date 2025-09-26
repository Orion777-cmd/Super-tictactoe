import Cell from "../cell/cell.component";
import "./xo.styles.css";
import { GridState } from "../../types/gridStateType";

interface XOProps {
  board: (GridState | null)[];
  winner: GridState | "draw" | null;
  boardIndex: number;
  turn: string; // User ID
  gameStatus: string;
  activeBoard: number;
  currentPlayerTurn: string; // User ID
  handleCellClick: (boardIdx: number, cellIdx: number) => void;
}

const XO: React.FC<XOProps> = ({
  board,
  winner,
  boardIndex,
  turn,
  gameStatus,
  activeBoard,
  currentPlayerTurn,
  handleCellClick,
}) => {
  const handleCellClickWrapper = (cellIdx: number) => {
    handleCellClick(boardIndex, cellIdx);
  };

  const playable =
    (gameStatus === "playing" || gameStatus === "waiting") &&
    (activeBoard === -1 || activeBoard === boardIndex) &&
    winner === null &&
    currentPlayerTurn === turn;

  // Debug logging
  console.log(`[DEBUG] XO Board ${boardIndex} Playability:`, {
    gameStatus,
    activeBoard,
    boardIndex,
    winner,
    currentPlayerTurn,
    turn,
    playable,
    activeBoardCheck: activeBoard === -1 || activeBoard === boardIndex,
  });

  return (
    <div
      className={`grid-container ${
        winner === null
          ? playable
            ? "board-active"
            : "board-inactive"
          : "board-disable"
      }`}
    >
      {winner != null ? (
        <div className={`winner-${winner}`}></div>
      ) : (
        board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleCellClickWrapper(index)}
            disabled={!!cell || !playable}
          />
        ))
      )}
    </div>
  );
};

export default XO;
