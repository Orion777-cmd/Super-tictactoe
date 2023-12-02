// TicTacToeContext.js
import { createContext, useContext, useState, ReactNode } from "react";

type GridState = "X" | "O" | "draw" | null;

type TicTacToeGrid = GridState[][];

interface TicTacToeContextProps {
    sign: "X" | "O";
    toggleSign : () => void;
    gridStates: TicTacToeGrid;
    updateGridState: (row: number, col: number, state: GridState) => void;
    board : GridState[];
    setBoard: React.Dispatch<React.SetStateAction<GridState[]>>;
}

const defaultGrid: TicTacToeGrid = [
    [null , null, null],
    [null, null , null],
    [null, null, null],
];



const TicTacToeContext = createContext<TicTacToeContextProps>({
        sign: "X",
        toggleSign: () => {},
        gridStates: defaultGrid,
        updateGridState: () => {},
        board: [],
        setBoard: () => {},
    } );

export const TicTacToeProvider = ({ children }: {children: ReactNode}) => {
  const [sign, setSign] = useState<"X" | "O">("O");
  const [gridStates, setGridStates] = useState<TicTacToeGrid>(defaultGrid);
  const [board, setBoard] = useState<Array<GridState>>(Array(9).fill(null));

  const toggleSign = () => {
    setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
  };

  const updateGridState = (row: number, col: number, state: GridState) => {
    const newGridStates = [...gridStates];
    newGridStates[row][col] = state;
    setGridStates(newGridStates)
  }

  return (
    <TicTacToeContext.Provider value={{ sign, toggleSign, gridStates, updateGridState,board, setBoard }}>
      {children}
    </TicTacToeContext.Provider>
  );
};

export const useTicTacToe = () => {
  return useContext(TicTacToeContext);
};
