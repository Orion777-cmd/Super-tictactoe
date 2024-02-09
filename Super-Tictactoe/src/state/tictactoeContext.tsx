// TicTacToeContext.js

import { createContext, useContext, useState, ReactNode } from "react";

type GridState = string | null;

interface TicTacToeContextProps {
    sign: "X" | "O";
    toggleSign : () => void; 
    updateGridState: (index: number, state: GridState | null) => void;
    board : GridState[];
    setBoard: React.Dispatch<React.SetStateAction<GridState[]>>;
    finished : boolean;
    setFinishedState: (isFinished: boolean) => void;
}

// const defaultGrid: GridState[] = [null, null, null, null, null, null, null, null, null];

const TicTacToeContext = createContext<TicTacToeContextProps>({
        sign: "X",
        toggleSign: () => {},
        updateGridState: () => {},
        board: [],
        setBoard: () => {},
        finished: false,
        setFinishedState : () => {},
    } );

export const TicTacToeProvider = ({ children }: {children: ReactNode}) => {
  const [sign, setSign] = useState<"X" | "O">("O");
  // const [gridStates, setGridStates] = useState<GridState[]>(defaultGrid);
  const [board, setBoard] = useState<Array<GridState>>(Array(9).fill(null));
  const [finished, setFinished] = useState<boolean>(false);
 


  const toggleSign = () => {
    setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
  };

  const updateGridState = (index: number, state: string | null) => {
    const newBoard = [...board];
    if (state) {
        newBoard[index] = state;
    }
    setBoard(newBoard);

  
    
};


  const setFinishedState  = (isFinished: boolean) => {
    setFinished(isFinished)
  }

  return (
    <TicTacToeContext.Provider value={{ sign, toggleSign, updateGridState,board, setBoard, finished, setFinishedState}}>
      {children}
    </TicTacToeContext.Provider>
  );
};

export const useTicTacToe = () => {
  return useContext(TicTacToeContext);
};
