// TicTacToeContext.js
import { createContext, useContext, useState, ReactNode } from "react";

const TicTacToeContext = createContext({
        sign: "X",
        toggleSign: () => {}
    } );

export const TicTacToeProvider = ({ children }: {children: ReactNode}) => {
  const [sign, setSign] = useState("O");

  const toggleSign = () => {
    setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
  };

  return (
    <TicTacToeContext.Provider value={{ sign, toggleSign }}>
      {children}
    </TicTacToeContext.Provider>
  );
};

export const useTicTacToe = () => {
  return useContext(TicTacToeContext);
};
