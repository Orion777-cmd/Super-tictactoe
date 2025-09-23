import { useParams } from "react-router-dom";
import useGameLogic from "../../hooks/gameHook";
import BigXO from "../../components/BigXO/bigXo.component";
import { GameStatus } from "../../types/gameStatusType";
import "./gamepage.styles.css";

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const gameLogic = useGameLogic({ roomId: roomId || "" });

  return (
    <div className="game-container">
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Room: {roomId}</h2>
        <p>
          Game Status:{" "}
          {gameLogic.gameStatus === GameStatus.WAITING
            ? "Waiting for players"
            : gameLogic.gameStatus === GameStatus.PLAYING
            ? "Playing"
            : gameLogic.gameStatus === GameStatus.WIN
            ? "Game Over"
            : gameLogic.gameStatus === GameStatus.TIE
            ? "Tie Game"
            : gameLogic.gameStatus}
        </p>
        <p>
          Turn:{" "}
          {gameLogic.turn === gameLogic.currentPlayerTurn ? "You" : "Opponent"}
        </p>
        <p>
          You are: <strong>{gameLogic.playerSymbol}</strong>
        </p>
        {gameLogic.activeBoard !== -1 && (
          <p style={{ color: "blue", fontWeight: "bold" }}>
            🎯 Must play in board {gameLogic.activeBoard + 1}
          </p>
        )}
        {gameLogic.wholeGameWinner && (
          <p style={{ color: "green", fontWeight: "bold", fontSize: "1.2em" }}>
            🏆{" "}
            {gameLogic.wholeGameWinner === gameLogic.playerSymbol
              ? "You won!"
              : "You lost!"}
          </p>
        )}
        {gameLogic.gameStatus === GameStatus.WAITING && (
          <p style={{ color: "orange", fontWeight: "bold" }}>
            ⏳ Waiting for both players to join... Click any cell to start the
            game!
          </p>
        )}
        {gameLogic.gameStatus === GameStatus.PLAYING && (
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ Game is active! Click on any cell to make your move.
          </p>
        )}
      </div>
      <BigXO
        bigBoard={gameLogic.bigBoard}
        winnerBoard={gameLogic.winnerBoard}
        turn={gameLogic.turn}
        gameStatus={gameLogic.gameStatus}
        activeBoard={gameLogic.activeBoard}
        currentPlayerTurn={gameLogic.currentPlayerTurn}
        handleCellClick={gameLogic.handleCellClick}
      />
    </div>
  );
};

const Cell = ({ value, onClick, disabled }) => (
  <div className="cell-container" onClick={disabled ? undefined : onClick}>
    {value && <div className={`render-${value}`}></div>}
  </div>
);

export default GamePage;
