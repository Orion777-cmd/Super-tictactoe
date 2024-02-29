// TicTacToeContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";

type GridState = "X" | "O" | null;

interface TicTacToeContextProps {
    sign: "X" | "O";
    toggleSign: () => void;
    updateWinnerBoardState: (index: number, state: GridState) => void;
    winner: GridState[];
    setWinner: React.Dispatch<React.SetStateAction<GridState[]>>;
    bigBoard: (GridState | "draw")[][]; // Change type to a 2D array
    setBigBoard: React.Dispatch<React.SetStateAction<(GridState | "draw")[][]>>; // Adjusted type
    updateBigBoardState: (index: number, innerIndex: number, state: GridState | "draw") => void;
    wholeGameWinner: GridState | "draw" | null;
    setWholeGameWinner: React.Dispatch<React.SetStateAction<GridState | "draw" | null>>;
    updateWholeGameWinner: (state: GridState) => void;
}

const TicTacToeContext = createContext<TicTacToeContextProps>({
    sign: "X",
    toggleSign: () => {},
    updateWinnerBoardState: () => {},
    winner: [],
    setWinner: () => {},
    bigBoard: [[]], // Initialize as an array of empty arrays
    setBigBoard: () => {},
    updateBigBoardState: () => {},
    wholeGameWinner: null,
    setWholeGameWinner: () => {},
    updateWholeGameWinner: () => {},
  
});

export const TicTacToeProvider = ({ children }: { children: ReactNode }) => {
    const [sign, setSign] = useState<"X" | "O">("O");
    const [winner, setWinner] = useState<Array<GridState>>(Array(9).fill(null));
    const [bigBoard, setBigBoard] = useState<Array<Array<GridState | "draw">>>(Array(9).fill(Array(9).fill(null)));
    

    const toggleSign = () => {
        setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
    };

    const updateWinnerBoardState = (index: number, state: GridState) => {
        const newBoard = [...winner];
        if (state) {
            newBoard[index] = state;
        }
        setWinner(newBoard);
    };

    const updateBigBoardState = (index: number, innerIndex: number, state: GridState | "draw") => {
        const newBigBoard = [...bigBoard];
        if (state) {
            newBigBoard[index][innerIndex] = state;
        }
        setBigBoard(newBigBoard);
    };

    const [wholeGameWinner, setWholeGameWinner] = useState<GridState | "draw" | null>(null);
    const updateWholeGameWinner = (state: GridState | "draw") => {
        setWholeGameWinner(state);
    };

    return (
        <TicTacToeContext.Provider value={{ sign, toggleSign, updateWinnerBoardState, winner, bigBoard, updateBigBoardState, setWinner, setBigBoard, wholeGameWinner,setWholeGameWinner, updateWholeGameWinner}}>
            {children}
        </TicTacToeContext.Provider>
    );
};

export const useTicTacToe = () => {
    return useContext(TicTacToeContext);
};
