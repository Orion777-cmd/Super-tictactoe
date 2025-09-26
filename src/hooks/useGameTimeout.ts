import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../state/authContext";
import { useNotificationContext } from "../context/NotificationContext";

interface GameTimeoutConfig {
  moveTimeout: number; // Time in seconds for each move
  gameTimeout: number; // Time in seconds for entire game
  warningTime: number; // Time in seconds before timeout warning
}

const DEFAULT_CONFIG: GameTimeoutConfig = {
  moveTimeout: 300, // 5 minutes per move
  gameTimeout: 3600, // 1 hour total game time
  warningTime: 60, // 1 minute warning
};

interface GameTimeoutState {
  timeRemaining: number;
  isActive: boolean;
  isWarning: boolean;
  isExpired: boolean;
  lastMoveTime: number;
  gameStartTime: number;
}

export const useGameTimeout = (
  gameId: string,
  roomId: string,
  isPlayerTurn: boolean,
  config: GameTimeoutConfig = DEFAULT_CONFIG
) => {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const [timeoutState, setTimeoutState] = useState<GameTimeoutState>({
    timeRemaining: config.moveTimeout,
    isActive: false,
    isWarning: false,
    isExpired: false,
    lastMoveTime: Date.now(),
    gameStartTime: Date.now(),
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  // Update timeout state when it's the player's turn
  useEffect(() => {
    if (isPlayerTurn && !timeoutState.isExpired) {
      setTimeoutState(prev => ({
        ...prev,
        isActive: true,
        timeRemaining: config.moveTimeout,
        lastMoveTime: Date.now(),
        isWarning: false,
      }));
      warningShownRef.current = false;
    } else if (!isPlayerTurn) {
      setTimeoutState(prev => ({
        ...prev,
        isActive: false,
        isWarning: false,
      }));
    }
  }, [isPlayerTurn, config.moveTimeout, timeoutState.isExpired]);

  // Handle timeout expiration
  const handleTimeout = useCallback(async () => {
    if (!user || timeoutState.isExpired) return;

    try {
      // Mark the game as abandoned due to timeout
      const { error: gameError } = await supabase
        .from("games")
        .update({
          state: {
            gameStatus: "abandoned",
            abandonedBy: user.userId,
            abandonedReason: "timeout",
            abandonedAt: new Date().toISOString(),
          }
        })
        .eq("id", gameId);

      if (gameError) throw gameError;

      // Update room status
      const { error: roomError } = await supabase
        .from("rooms")
        .update({
          status: "abandoned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", roomId);

      if (roomError) throw roomError;

      // Show notification
      notifications.showGameNotification(
        "Game Timeout",
        "You have been timed out due to inactivity. The game has been abandoned.",
        "error"
      );

      setTimeoutState(prev => ({
        ...prev,
        isExpired: true,
        isActive: false,
        timeRemaining: 0,
      }));

    } catch (error) {
      console.error("Error handling timeout:", error);
      notifications.showGameNotification(
        "Timeout Error",
        "Failed to process timeout. Please refresh the page.",
        "error"
      );
    }
  }, [user, gameId, roomId, timeoutState.isExpired, notifications]);

  // Handle move timeout (individual move)
  const handleMoveTimeout = useCallback(async () => {
    if (!user || timeoutState.isExpired) return;

    try {
      // For move timeout, we'll just show a warning and potentially auto-pass
      // In a real implementation, you might want to implement auto-pass or forfeit
      notifications.showGameNotification(
        "Move Timeout",
        "Your turn has timed out. Please make a move or the game will be abandoned.",
        "warning"
      );

      // Set a shorter timeout for abandonment
      setTimeout(() => {
        if (timeoutState.isActive && isPlayerTurn) {
          handleTimeout();
        }
      }, 30000); // 30 seconds grace period

    } catch (error) {
      console.error("Error handling move timeout:", error);
    }
  }, [user, timeoutState.isExpired, timeoutState.isActive, isPlayerTurn, handleTimeout, notifications]);

  // Timer effect
  useEffect(() => {
    if (!timeoutState.isActive || timeoutState.isExpired) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeoutState(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
        const isWarning = newTimeRemaining <= config.warningTime && newTimeRemaining > 0;
        const isExpired = newTimeRemaining === 0;

        // Show warning
        if (isWarning && !warningShownRef.current) {
          notifications.showGameNotification(
            "Time Warning",
            `You have ${config.warningTime} seconds left to make your move!`,
            "warning"
          );
          warningShownRef.current = true;
        }

        // Handle timeout
        if (isExpired) {
          handleMoveTimeout();
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          isWarning,
          isExpired,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeoutState.isActive, timeoutState.isExpired, config.warningTime, handleMoveTimeout, notifications]);

  // Reset timeout when move is made
  const resetTimeout = useCallback(() => {
    setTimeoutState(prev => ({
      ...prev,
      timeRemaining: config.moveTimeout,
      lastMoveTime: Date.now(),
      isWarning: false,
    }));
    warningShownRef.current = false;
  }, [config.moveTimeout]);

  // Pause timeout (when player is away)
  const pauseTimeout = useCallback(() => {
    setTimeoutState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  // Resume timeout
  const resumeTimeout = useCallback(() => {
    if (isPlayerTurn && !timeoutState.isExpired) {
      setTimeoutState(prev => ({
        ...prev,
        isActive: true,
      }));
    }
  }, [isPlayerTurn, timeoutState.isExpired]);

  // Format time for display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining: timeoutState.timeRemaining,
    isActive: timeoutState.isActive,
    isWarning: timeoutState.isWarning,
    isExpired: timeoutState.isExpired,
    formatTime,
    resetTimeout,
    pauseTimeout,
    resumeTimeout,
  };
};
