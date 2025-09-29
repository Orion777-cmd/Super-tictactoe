import React, { createContext, useContext, useState, useCallback } from "react";

interface TimeoutContextType {
  resetTimeout: () => void;
  pauseTimeout: () => void;
  resumeTimeout: () => void;
  isTimeoutActive: boolean;
  setIsTimeoutActive: (active: boolean) => void;
}

const TimeoutContext = createContext<TimeoutContextType | undefined>(undefined);

export const TimeoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);

  const resetTimeout = useCallback(() => {
    // This will be called by the GameTimeout component
    setIsTimeoutActive(true);
  }, []);

  const pauseTimeout = useCallback(() => {
    setIsTimeoutActive(false);
  }, []);

  const resumeTimeout = useCallback(() => {
    setIsTimeoutActive(true);
  }, []);

  return (
    <TimeoutContext.Provider
      value={{
        resetTimeout,
        pauseTimeout,
        resumeTimeout,
        isTimeoutActive,
        setIsTimeoutActive,
      }}
    >
      {children}
    </TimeoutContext.Provider>
  );
};

export const useTimeoutContext = () => {
  const context = useContext(TimeoutContext);
  if (context === undefined) {
    throw new Error("useTimeoutContext must be used within a TimeoutProvider");
  }
  return context;
};
