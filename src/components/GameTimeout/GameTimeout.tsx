import React, { useEffect } from "react";
import { useGameTimeout } from "../../hooks/useGameTimeout";
import { useTimeoutContext } from "../../context/TimeoutContext";
import "./GameTimeout.styles.css";

interface GameTimeoutProps {
  gameId: string;
  roomId: string;
  isPlayerTurn: boolean;
  moveTimeout?: number;
  warningTime?: number;
}

const GameTimeout: React.FC<GameTimeoutProps> = ({
  gameId,
  roomId,
  isPlayerTurn,
  moveTimeout = 300,
  warningTime = 60,
}) => {
  const {
    timeRemaining,
    isActive,
    isWarning,
    isExpired,
    formatTime,
    resetTimeout,
    pauseTimeout,
    resumeTimeout,
  } = useGameTimeout(gameId, roomId, isPlayerTurn, {
    moveTimeout,
    warningTime,
  });

  const { resetTimeout: contextResetTimeout } = useTimeoutContext();

  // Reset timeout when context is triggered
  useEffect(() => {
    if (isPlayerTurn) {
      resetTimeout();
    }
  }, [isPlayerTurn, resetTimeout]);

  // Don't show if not active or expired
  if (!isActive || isExpired) {
    return null;
  }

  const handlePause = () => {
    pauseTimeout();
  };

  const handleResume = () => {
    resumeTimeout();
  };

  return (
    <div className={`game-timeout ${isWarning ? "warning" : ""}`}>
      <div className="timeout-content">
        <div className="timeout-icon">
          {isWarning ? "⚠️" : "⏱️"}
        </div>
        <div className="timeout-info">
          <div className="timeout-label">
            {isPlayerTurn ? "Your Turn" : "Opponent's Turn"}
          </div>
          <div className="timeout-timer">
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="timeout-actions">
          <button
            className="timeout-action-btn"
            onClick={handlePause}
            title="Pause timer"
          >
            ⏸️
          </button>
          <button
            className="timeout-action-btn"
            onClick={handleResume}
            title="Resume timer"
          >
            ▶️
          </button>
        </div>
      </div>
      
      {isWarning && (
        <div className="timeout-warning">
          <div className="warning-message">
            ⚠️ Time running out! Make your move soon.
          </div>
          <div className="warning-progress">
            <div 
              className="warning-progress-bar"
              style={{
                width: `${((moveTimeout - timeRemaining) / moveTimeout) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTimeout;
