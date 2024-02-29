import { createContext, useContext, useState, ReactNode } from "react";

type GridState = "X" | "O" | null;

interface TicTacToeContextProps {
    sign: "X" | "O";
    toggleSign: () => void;
    updateWinnerBoardState: (index: number, state: GridState | "draw") => void;
    winner: (GridState | "draw")[];
    setWinner: React.Dispatch<React.SetStateAction<(GridState | "draw")[]>>;
    bigBoard: (GridState | "draw")[][]; 
    setBigBoard: React.Dispatch<React.SetStateAction<(GridState | "draw")[][]>>; 
    updateBigBoardState: (index: number, innerIndex: number, state: GridState | "draw") => void;
    wholeGameWinner: GridState | "draw";
    setWholeGameWinner: React.Dispatch<React.SetStateAction<GridState | "draw" | null>>;
    updateWholeGameWinner: (state: GridState | "draw") => void;
}

const TicTacToeContext = createContext<TicTacToeContextProps>({
    sign: "X",
    toggleSign: () => {},
    updateWinnerBoardState: () => {},
    winner: [],
    setWinner: () => {},
    bigBoard: [[]], 
    setBigBoard: () => {},
    updateBigBoardState: () => {},
    wholeGameWinner: null,
    setWholeGameWinner: () => {},
    updateWholeGameWinner: () => {},
  
});

export const TicTacToeProvider = ({ children }: { children: ReactNode }) => {
    const [sign, setSign] = useState<"X" | "O">("O");
    const [winner, setWinner] = useState<Array<GridState|"draw">>(Array(9).fill(null));
    const [bigBoard, setBigBoard] = useState<Array<Array<GridState | "draw">>>(() => {
        const initialBoard: Array<Array<GridState | "draw">> = [];
        for (let i = 0; i < 9; i++) {
            initialBoard.push(Array(9).fill(null));
        }
        return initialBoard;
    });
    
    

    const toggleSign = () => {
        setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
    };

    const updateWinnerBoardState = (index: number, state: GridState | "draw") => {
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
