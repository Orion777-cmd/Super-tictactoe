import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../state/authContext";
import { useNotificationContext } from "../context/NotificationContext";
// import { GameStatus } from "../types/gameStatus.type";

interface ErrorRecoveryState {
  hasError: boolean;
  errorType: "connection" | "game_state" | "database" | "unknown";
  errorMessage: string;
  canRecover: boolean;
  isRecovering: boolean;
}

export const useErrorRecovery = (gameId?: string, _roomId?: string) => {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const [recoveryState, setRecoveryState] = useState<ErrorRecoveryState>({
    hasError: false,
    errorType: "unknown",
    errorMessage: "",
    canRecover: false,
    isRecovering: false,
  });

  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Handle different types of errors
  const handleError = useCallback(
    (error: Error, context: string) => {
      console.error(`Error in ${context}:`, error);

      let errorType: ErrorRecoveryState["errorType"] = "unknown";
      let canRecover = false;
      let errorMessage = error.message;

      // Classify error type
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorType = "connection";
        canRecover = true;
        errorMessage = "Connection error. Attempting to recover...";
      } else if (
        error.message.includes("game") ||
        error.message.includes("state")
      ) {
        errorType = "game_state";
        canRecover = true;
        errorMessage = "Game state error. Attempting to recover...";
      } else if (
        error.message.includes("database") ||
        error.message.includes("supabase")
      ) {
        errorType = "database";
        canRecover = true;
        errorMessage = "Database error. Attempting to recover...";
      }

      setRecoveryState({
        hasError: true,
        errorType,
        errorMessage,
        canRecover,
        isRecovering: false,
      });

      // Show notification
      notifications.showGameNotification(
        "error",
        "Error Occurred",
        errorMessage,
        { duration: 5000 }
      );
    },
    [notifications]
  );

  // Recover from connection errors
  const recoverFromConnectionError = useCallback(async () => {
    if (!user) return false;

    try {
      setRecoveryState((prev) => ({ ...prev, isRecovering: true }));

      // Test connection
      const { error } = await supabase.from("rooms").select("id").limit(1);

      if (error) throw error;

      setRecoveryState({
        hasError: false,
        errorType: "unknown",
        errorMessage: "",
        canRecover: false,
        isRecovering: false,
      });

      notifications.showGameNotification(
        "success",
        "Recovery Successful",
        "Connection restored!",
        { duration: 3000 }
      );

      return true;
    } catch (error) {
      console.error("Recovery failed:", error);
      return false;
    }
  }, [user, notifications]);

  // Recover from game state errors
  const recoverFromGameStateError = useCallback(async () => {
    if (!gameId || !user) return false;

    try {
      setRecoveryState((prev) => ({ ...prev, isRecovering: true }));

      // Fetch latest game state
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (gameError) throw gameError;

      if (!gameData || !gameData.state) {
        throw new Error("No game state found");
      }

      setRecoveryState({
        hasError: false,
        errorType: "unknown",
        errorMessage: "",
        canRecover: false,
        isRecovering: false,
      });

      notifications.showGameNotification(
        "success",
        "Game State Recovered",
        "Your game has been restored!",
        { duration: 3000 }
      );

      return true;
    } catch (error) {
      console.error("Game state recovery failed:", error);
      return false;
    }
  }, [gameId, user, notifications]);

  // Recover from database errors
  const recoverFromDatabaseError = useCallback(async () => {
    if (!user) return false;

    try {
      setRecoveryState((prev) => ({ ...prev, isRecovering: true }));

      // Test database connection with a simple query
      const { error } = await supabase.from("rooms").select("id").limit(1);

      if (error) throw error;

      setRecoveryState({
        hasError: false,
        errorType: "unknown",
        errorMessage: "",
        canRecover: false,
        isRecovering: false,
      });

      notifications.showGameNotification(
        "success",
        "Database Recovered",
        "Database connection restored!",
        { duration: 3000 }
      );

      return true;
    } catch (error) {
      console.error("Database recovery failed:", error);
      return false;
    }
  }, [user, notifications]);

  // Main recovery function
  const attemptRecovery = useCallback(async () => {
    if (!recoveryState.canRecover || recoveryState.isRecovering) {
      return false;
    }

    if (retryCountRef.current >= maxRetries) {
      setRecoveryState((prev) => ({
        ...prev,
        canRecover: false,
        errorMessage:
          "Maximum recovery attempts reached. Please refresh the page.",
      }));

      notifications.showGameNotification(
        "error",
        "Recovery Failed",
        "Unable to recover. Please refresh the page.",
        { duration: 8000 }
      );

      return false;
    }

    retryCountRef.current += 1;

    let success = false;

    switch (recoveryState.errorType) {
      case "connection":
        success = await recoverFromConnectionError();
        break;
      case "game_state":
        success = await recoverFromGameStateError();
        break;
      case "database":
        success = await recoverFromDatabaseError();
        break;
      default:
        // For unknown errors, try general recovery
        success = await recoverFromConnectionError();
    }

    if (!success) {
      // Wait before next retry (exponential backoff)
      const delay = Math.min(
        1000 * Math.pow(2, retryCountRef.current - 1),
        10000
      );
      setTimeout(() => {
        attemptRecovery();
      }, delay);
    }

    return success;
  }, [
    recoveryState,
    recoverFromConnectionError,
    recoverFromGameStateError,
    recoverFromDatabaseError,
    notifications,
  ]);

  // Auto-recovery on error
  useEffect(() => {
    if (
      recoveryState.hasError &&
      recoveryState.canRecover &&
      !recoveryState.isRecovering
    ) {
      const timer = setTimeout(() => {
        attemptRecovery();
      }, 2000); // Wait 2 seconds before attempting recovery

      return () => clearTimeout(timer);
    }
  }, [recoveryState, attemptRecovery]);

  // Reset error state
  const resetError = useCallback(() => {
    setRecoveryState({
      hasError: false,
      errorType: "unknown",
      errorMessage: "",
      canRecover: false,
      isRecovering: false,
    });
    retryCountRef.current = 0;
  }, []);

  // Manual recovery trigger
  const triggerRecovery = useCallback(() => {
    if (recoveryState.canRecover && !recoveryState.isRecovering) {
      attemptRecovery();
    }
  }, [recoveryState, attemptRecovery]);

  return {
    ...recoveryState,
    handleError,
    attemptRecovery: triggerRecovery,
    resetError,
  };
};
