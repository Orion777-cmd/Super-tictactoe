import "./bigXo.styles.css";
import XO from "../XO/xo.component";
import { GridState } from "../../types/gridStateType";
import { GameStatus } from "../../types/gameStatusType";

interface BigXOProps {
  bigBoard: GridState[][];
  winnerBoard: (GridState | "draw")[];
  turn: string; // User ID
  gameStatus: GameStatus;
  activeBoard: number;
  currentPlayerTurn: string; // User ID
  handleCellClick: (boardIdx: number, cellIdx: number) => void;
}

const BigXO: React.FC<BigXOProps> = ({
  bigBoard,
  winnerBoard,
  turn,
  gameStatus,
  activeBoard,
  currentPlayerTurn,
  handleCellClick,
}) => {
  // Safety check for bigBoard
  if (!bigBoard || !Array.isArray(bigBoard) || bigBoard.length === 0) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="ultimate-container">
      {bigBoard.map((smallBoard, idx) => (
        <XO
          key={idx}
          board={smallBoard}
          winner={winnerBoard[idx]}
          boardIndex={idx}
          turn={turn}
          gameStatus={gameStatus}
          activeBoard={activeBoard}
          currentPlayerTurn={currentPlayerTurn}
          handleCellClick={handleCellClick}
        />
      ))}
    </div>
  );
};

export default BigXO;
